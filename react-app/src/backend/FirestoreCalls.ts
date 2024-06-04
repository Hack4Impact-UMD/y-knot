import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  runTransaction,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  StudentAttendance,
  StudentHomework,
  StudentCourse,
  type StudentID,
  type Student,
} from '../types/StudentType';
import {
  Attendance,
  Homework,
  type Course,
  type CourseID,
} from '../types/CourseType';
import { TeacherID, type Teacher, type YKNOTUser } from '../types/UserType';
import { promises } from 'dns';
import { rejects } from 'assert';
import dayjs from 'dayjs';
import { resolve } from 'path';

export function getAllStudents(): Promise<StudentID[]> {
  const studentsRef = collection(db, 'Students');
  return new Promise((resolve, reject) => {
    getDocs(studentsRef)
      .then((snapshot) => {
        const allStudents: StudentID[] = [];
        const students = snapshot.docs.map((doc) => {
          const student: Student = doc.data() as Student;
          const newStudent: StudentID = { ...student, id: doc.id };
          allStudents.push(newStudent);
        });
        resolve(allStudents);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getAllTeachers(): Promise<TeacherID[]> {
  const teachersRef = query(
    collection(db, 'Users'),
    where('type', '!=', 'ADMIN'),
  );
  return new Promise((resolve, reject) => {
    getDocs(teachersRef)
      .then((snapshot) => {
        const teacherID: TeacherID[] = [];
        const teachers = snapshot.docs.map((doc) => {
          const teacher = doc.data() as Teacher;
          teacherID.push({ ...teacher, id: doc.id });
        });
        resolve(teacherID);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getAllCourses(): Promise<CourseID[]> {
  const coursesRef = collection(db, 'Courses');
  return new Promise((resolve, reject) => {
    getDocs(coursesRef)
      .then((snapshot) => {
        const courseID: CourseID[] = [];
        const courses = snapshot.docs.map((doc) => {
          const course = doc.data() as Course;
          courseID.push({ ...course, id: doc.id });
        });
        resolve(courseID);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function addStudent(student: Student): Promise<string> {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, 'Students'), student)
      .then((docRef) => {
        // return id of student added
        resolve(docRef.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function deleteStudent(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    /* runTransaction provides protection against race conditions where
       2 people are modifying the data at once. It also ensures that either
       all of these writes succeed or none of them do.
    */
    runTransaction(db, async (transaction) => {
      const studentRef: Student = (
        await transaction.get(doc(db, 'Students', id))
      ).data() as Student;
      const idOrder: string[] = [];
      const students: string[][] = [];
      await Promise.all(
        studentRef.courseInformation.map(async (course) => {
          idOrder.push(course.id);
          return (
            await transaction.get(doc(db, 'Courses', course.id))
          ).data() as Course;
        }),
      ).then((result) => {
        result.forEach((course) => {
          students.push(course.students);
        });
      });
      students.forEach((studentList) => {
        studentList = studentList.filter((student) => {
          return student !== id;
        });
      });
      idOrder.map((id, index) => {
        transaction.update(doc(db, 'Courses', id), {
          students: students[index],
        });
      });
      transaction.delete(doc(db, 'Students', id));
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

export function removeStudentCourse(
  studentId: string,
  courseId: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    /* runTransaction provides protection against race conditions where
       2 people are modifying the data at once. It also ensures that either
       all of these writes succeed or none of them do.
    */
    runTransaction(db, async (transaction) => {
      const studentRef = await transaction.get(doc(db, 'Students', studentId));
      const courseRef = await transaction.get(doc(db, 'Courses', courseId));
      if (!studentRef.exists() || !courseRef.exists()) {
        throw 'Document does not exist!';
      }
      const student: Student = studentRef.data() as Student;
      if (
        student.courseInformation.find((student) => student.id === courseId)
      ) {
        student.courseInformation = student.courseInformation.filter(
          ({ id }) => !id.includes(courseId),
        );
        await transaction.update(doc(db, 'Students', studentId), {
          courseInformation: student.courseInformation,
        });
      } else {
        reject(new Error('Course does not exist in student'));
      }
      const course: Course = courseRef.data() as Course;
      if (course.students.includes(studentId)) {
        course.students = course.students.filter(function (s) {
          return s !== studentId;
        });
        await transaction.update(doc(db, 'Courses', courseId), {
          students: course.students,
        });
      } else {
        reject(new Error('Student does not exist in course'));
      }
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

export function removeTeacherCourse(
  teacherId: string,
  courseId: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    /* runTransaction provides protection against race conditions where
       2 people are modifying the data at once. It also ensures that either
       all of these writes succeed or none of them do.
    */
    runTransaction(db, async (transaction) => {
      const teacherRef = await transaction.get(doc(db, 'Users', teacherId));
      const courseRef = await transaction.get(doc(db, 'Courses', courseId));
      if (!teacherRef.exists() || !courseRef.exists()) {
        throw 'Document does not exist!';
      }
      const teacher: Teacher = teacherRef.data() as Teacher;
      if (teacher.courses.includes(courseId)) {
        teacher.courses = teacher.courses.filter(function (c) {
          return c !== courseId;
        });
        await transaction.update(doc(db, 'Users', teacherId), {
          courses: teacher.courses,
        });
      } else {
        reject(new Error('Course does not exist in teacher'));
      }
      const course: Course = courseRef.data() as Course;
      if (course.teachers.includes(teacherId)) {
        course.teachers = course.teachers.filter(function (t) {
          return t !== teacherId;
        });
        await transaction.update(doc(db, 'Courses', courseId), {
          teachers: course.teachers,
        });
      } else {
        reject(new Error('Teacher does not exist in course'));
      }
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

export function addTeacherCourseFromList(
  teacherIdList: Array<string>,
  courseId: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    /* runTransaction provides protection against race conditions where
       2 people are modifying the data at once. It also ensures that either
       all of these writes succeed or none of them do.
    */
    runTransaction(db, async (transaction) => {
      const courseRef = await transaction.get(doc(db, 'Courses', courseId));
      if (!courseRef.exists()) {
        throw 'Course does not exist!';
      }

      const course: Course = courseRef.data() as Course;
      var teacherPromises = [];

      for (const teacherId of teacherIdList) {
        teacherPromises.push(transaction.get(doc(db, 'Users', teacherId)));
      }

      var teacherRefList: any[] = [];
      await Promise.all(teacherPromises)
        .then((teacherRef) => {
          teacherRefList = teacherRef;
        })
        .catch(() => {
          reject(new Error('A teacher does not exist!'));
        });

      var updatePromises = [];

      for (let i = 0; i < teacherRefList.length; i++) {
        var teacherRef = teacherRefList[i];
        const teacher: Teacher = teacherRef.data() as Teacher;
        if (
          !teacher.courses.includes(courseId) &&
          !course.teachers.includes(teacherIdList[i])
        ) {
          teacher.courses.push(courseId);
          course.teachers.push(teacherIdList[i]);
          updatePromises.push(
            transaction.update(doc(db, 'Users', teacherIdList[i]), {
              courses: teacher.courses,
            }),
          );
        }
      }

      updatePromises.push(
        transaction.update(doc(db, 'Courses', courseId), {
          teachers: course.teachers,
        }),
      );

      await Promise.all(updatePromises)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

export function addTeacherCourse(
  teacherId: string,
  courseId: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    /* runTransaction provides protection against race conditions where
       2 people are modifying the data at once. It also ensures that either
       all of these writes succeed or none of them do.
    */
    runTransaction(db, async (transaction) => {
      const teacherRef = await transaction.get(doc(db, 'Users', teacherId));
      const courseRef = await transaction.get(doc(db, 'Courses', courseId));
      if (!teacherRef.exists() || !courseRef.exists()) {
        throw 'Document does not exist!';
      }
      const teacher: Teacher = teacherRef.data() as Teacher;
      if (!teacher.courses.includes(courseId)) {
        teacher.courses.push(courseId);
        await transaction.update(doc(db, 'Users', teacherId), {
          courses: teacher.courses,
        });
      } else {
        reject(new Error('Course is already added to teacher'));
      }
      const course: Course = courseRef.data() as Course;
      if (!course.teachers.includes(teacherId)) {
        course.teachers.push(teacherId);
        await transaction.update(doc(db, 'Courses', courseId), {
          teachers: course.teachers,
        });
      } else {
        reject(new Error('Teacher is already added to course'));
      }
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

export function addCourse(course: Course): Promise<void> {
  return new Promise((resolve, reject) => {
    /* runTransaction provides protection against race conditions where
       2 people are modifying the data at once. It also ensures that either
       all of these writes succeed or none of them do.
    */
    runTransaction(db, async (transaction) => {
      var courseId;

      // add course
      addDoc(collection(db, 'Courses'), course)
        .then((docRef) => {
          courseId = docRef.id;
        })
        .catch((e) => {
          reject(e);
        });

      // get teachers added to course
      var teacherPromises = [];
      for (const teacherId of course.teachers) {
        teacherPromises.push(transaction.get(doc(db, 'Users', teacherId)));
      }

      var teacherRefList: any[] = [];
      await Promise.all(teacherPromises)
        .then((teacherRef) => {
          teacherRefList = teacherRef;
        })
        .catch(() => {
          reject(new Error('A teacher does not exist!'));
        });

      if (courseId) {
        var updatePromises = [];

        // add course to teacher's course list
        for (let i = 0; i < teacherRefList.length; i++) {
          var teacherRef = teacherRefList[i];
          const teacher: Teacher = teacherRef.data() as Teacher;
          teacher.courses.push(courseId);
          updatePromises.push(
            transaction.update(doc(db, 'Users', course.teachers[i]), {
              courses: teacher.courses,
            }),
          );
        }

        await Promise.all(updatePromises)
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      }
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

export function deleteCourse(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    deleteDoc(doc(db, 'Courses', id))
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getTeacher(id: string): Promise<Teacher> {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, 'Users', id))
      .then((teacherSnapshot) => {
        if (teacherSnapshot.exists()) {
          resolve(teacherSnapshot.data() as Teacher);
        } else {
          reject(new Error('Teacher does not exist'));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getTeachersFromList(
  idList: Array<string>,
): Promise<Array<TeacherID>> {
  let res = idList.map(async (id) => {
    const teacher = await getTeacher(id);
    const teacherWithId: TeacherID = { ...teacher, id };
    return teacherWithId;
  });

  return Promise.all(res);
}

export function getTeacherWithAuth(auth_id: string): Promise<TeacherID> {
  return new Promise((resolve, reject) => {
    const teachersRef = query(
      collection(db, 'Users'),
      where('auth_id', '==', auth_id),
    );
    getDocs(teachersRef)
      .then((teacherSnapshot) => {
        if (teacherSnapshot.size > 0) {
          const teacherData = teacherSnapshot.docs[0].data() as Teacher;
          resolve({ ...teacherData, id: teacherSnapshot.docs[0].id });
        } else {
          reject(new Error('Teacher does not exist'));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getStudent(id: string): Promise<Student> {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, 'Students', id))
      .then((studentSnapshot) => {
        if (studentSnapshot.exists()) {
          resolve(studentSnapshot.data() as Student);
        } else {
          reject(new Error('Student does not exist'));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getStudentsFromList(
  idList: Array<string>,
): Promise<Array<StudentID>> {
  let res = idList.map(async (id) => {
    const student = await getStudent(id);
    const studentWithId: StudentID = { ...student, id };
    return studentWithId;
  });

  return Promise.all(res);
}

export function getCourse(id: string): Promise<Course> {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, 'Courses', id))
      .then((courseSnapshot) => {
        if (courseSnapshot.exists()) {
          resolve(courseSnapshot.data() as Course);
        } else {
          reject(new Error('Course does not exist'));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function updateStudent(student: Student, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === '' || !id) {
      reject(new Error('Invalid id'));
      return;
    }

    const studentRef = doc(db, 'Students', id);
    updateDoc(studentRef, { ...student })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function updateCourse(course: Course, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === '' || !id) {
      reject(new Error('Invalid id'));
      return;
    }

    const courseRef = doc(db, 'Courses', id);
    updateDoc(courseRef, { ...course })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

const compareDayJSDates = (
  obj1: Attendance | StudentAttendance,
  obj2: Attendance | StudentAttendance,
): number => {
  return dayjs(obj1.date).isBefore(dayjs(obj2.date)) ? -1 : 1;
};

// Add new attendance to course and students
export function addCourseAttendance(
  courseId: string,
  studentIdList: Array<string>,
  newAttendance: Attendance,
): Promise<Course> {
  return new Promise((resolve, reject) => {
    runTransaction(db, async (transaction) => {
      const courseRef = await transaction.get(doc(db, 'Courses', courseId));
      if (!courseRef.exists()) {
        reject(new Error('Course does not exist!'));
        throw 'Course does not exist!';
      }

      const course: Course = courseRef.data() as Course;
      // Reject if attendance date already exists for course
      if (course.attendance.find((att) => att.date === newAttendance.date)) {
        reject(new Error('Attendance already exists for date'));
        throw 'Attendance already exists for date';
      }

      var studentPromises = [];
      for (const studentId of studentIdList) {
        studentPromises.push(transaction.get(doc(db, 'Students', studentId)));
      }

      var studentRefList: any[] = [];
      await Promise.all(studentPromises)
        .then((studentRef) => {
          studentRefList = studentRef;
        })
        .catch(() => {
          reject(new Error('A student does not exist!'));
          throw 'A student does not exist!';
        });

      var updatePromises = [];

      for (let i = 0; i < studentRefList.length; i++) {
        var studentRef = studentRefList[i];
        const student: Student = studentRef.data() as Student;

        // Get index of course
        const studentCourse = student.courseInformation.findIndex(
          (c) => c.id === courseId,
        );

        if (studentCourse == -1) {
          reject(new Error('Course does not exist in student'));
        } else {
          // Add new attendance to student if it doesn't exist
          if (
            !student.courseInformation[studentCourse].attendance.find(
              (att) => att.date === newAttendance.date,
            )
          ) {
            student.courseInformation[studentCourse].attendance.push({
              date: newAttendance.date,
              attended: false,
            });
            updatePromises.push(
              transaction.update(doc(db, 'Students', studentIdList[i]), {
                courseInformation: student.courseInformation,
              }),
            );
          }
        }
      }

      // Add attendance to course
      course.attendance.push(newAttendance);
      course.attendance.sort(compareDayJSDates);
      await transaction.update(doc(db, 'Courses', courseId), {
        attendance: course.attendance,
      });

      await Promise.all(updatePromises)
        .then(() => {
          resolve(course);
        })
        .catch(() => {
          reject();
        });
    }).catch(() => {
      reject();
    });
  });
}

export function removeOLDAttendance(
  course: Course,
  courseID: string,
  attendanceDate: string,
): Promise<Course> {
  return new Promise((resolve, reject) => {
    let newCourseAttendanceList: Attendance[] = [];
    course.attendance.forEach((att) => {
      if (att.date !== attendanceDate) {
        newCourseAttendanceList.push(att);
      }
    });

    course.attendance = newCourseAttendanceList;
    updateCourse(course, courseID)
      .then(() => {
        resolve(course);
      })
      .catch((e) => {
        reject(e);
      });
  });

  // TODO: Update students to remove corresponding attendance from list
}

// Remove attendance from course and students
export function removeCourseAttendance(
  courseId: string,
  studentIdList: Array<string>,
  attendanceDate: string,
): Promise<Course> {
  return new Promise((resolve, reject) => {
    runTransaction(db, async (transaction) => {
      const courseRef = await transaction.get(doc(db, 'Courses', courseId));
      if (!courseRef.exists()) {
        reject(new Error('Course does not exist!'));
        throw 'Course does not exist!';
      }

      const course: Course = courseRef.data() as Course;
      // Reject if attendance date doesn't exist for course
      if (!course.attendance.find((att) => att.date == attendanceDate)) {
        reject(new Error('Attendance does not exist for date'));
        throw 'Attendance does not exist for date';
      }

      var studentPromises = [];
      for (const studentId of studentIdList) {
        studentPromises.push(transaction.get(doc(db, 'Students', studentId)));
      }

      var studentRefList: any[] = [];
      await Promise.all(studentPromises)
        .then((studentRef) => {
          studentRefList = studentRef;
        })
        .catch(() => {
          reject(new Error('A student does not exist!'));
          throw 'A student does not exist!';
        });

      var updatePromises = [];

      for (let i = 0; i < studentRefList.length; i++) {
        var studentRef = studentRefList[i];
        const student: Student = studentRef.data() as Student;

        // Get index of course
        const studentCourse = student.courseInformation.findIndex(
          (c) => c.id === courseId,
        );

        if (studentCourse == -1) {
          reject(new Error('Course does not exist in student'));
        } else {
          // Remove attendance from student if it exists
          if (
            student.courseInformation[studentCourse].attendance.find(
              (att) => att.date == attendanceDate,
            )
          ) {
            student.courseInformation[studentCourse].attendance =
              student.courseInformation[studentCourse].attendance.filter(
                (att) => {
                  return att.date != attendanceDate;
                },
              );
            updatePromises.push(
              transaction.update(doc(db, 'Students', studentIdList[i]), {
                courseInformation: student.courseInformation,
              }),
            );
          }
        }
      }

      // Remove attendance from course
      course.attendance = course.attendance.filter((att) => {
        return att.date != attendanceDate;
      });
      course.attendance.sort(compareDayJSDates);
      await transaction.update(doc(db, 'Courses', courseId), {
        attendance: course.attendance,
      });

      await Promise.all(updatePromises)
        .then(() => {
          resolve(course);
        })
        .catch(() => {
          reject();
        });
    }).catch(() => {
      reject();
    });
  });
}

export function updateCourseAttendance(
  course: Course,
  courseID: string,
  prevAttendance: Attendance,
  updatedAttendance: Attendance,
): Promise<Course> {
  return new Promise((resolve, reject) => {
    let noReplace = true;
    let containsDuplicate = false;
    let newAttendanceList: Array<Attendance> = [];
    course.attendance.forEach((att) => {
      if (prevAttendance.date === att.date) {
        noReplace = false;
      } else if (updatedAttendance.date === att.date) {
        containsDuplicate = true;
      } else {
        newAttendanceList.push(att);
      }
    });

    if (noReplace) {
      reject(new Error('Attendance for selected date does not exist '));
      return;
    }

    if (containsDuplicate) {
      reject(new Error('Attendance for selected date already exists '));
      return;
    }

    newAttendanceList.push(updatedAttendance);
    course.attendance = newAttendanceList.sort(compareDayJSDates);
    updateCourse(course, courseID)
      .then(() => {
        resolve(course);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

// Add new homework to course and students
export function addCourseHomework(
  courseId: string,
  studentIdList: Array<string>,
  newHomework: Homework,
): Promise<Course> {
  return new Promise((resolve, reject) => {
    runTransaction(db, async (transaction) => {
      const courseRef = await transaction.get(doc(db, 'Courses', courseId));
      if (!courseRef.exists()) {
        reject(new Error('Course does not exist!'));
        throw 'Course does not exist!';
      }

      const course: Course = courseRef.data() as Course;
      // Reject if homework name already exists for course
      if (course.homeworks.find((att) => att.name === newHomework.name)) {
        reject(new Error('Homework already exists for date'));
        throw 'Attendance already exists for date';
      }

      var studentPromises = [];
      for (const studentId of studentIdList) {
        studentPromises.push(transaction.get(doc(db, 'Students', studentId)));
      }

      var studentRefList: any[] = [];
      await Promise.all(studentPromises)
        .then((studentRef) => {
          studentRefList = studentRef;
        })
        .catch(() => {
          reject(new Error('A student does not exist!'));
          throw 'A student does not exist!';
        });

      var updatePromises = [];

      for (let i = 0; i < studentRefList.length; i++) {
        var studentRef = studentRefList[i];
        const student: Student = studentRef.data() as Student;

        // Get index of course
        const studentCourse = student.courseInformation.findIndex(
          (c) => c.id === courseId,
        );

        if (studentCourse == -1) {
          reject(new Error('Course does not exist in student'));
        } else {
          // Add new homework to student if it doesn't exist
          if (
            !student.courseInformation[studentCourse].homeworks.find(
              (hw) => hw.name === newHomework.name,
            )
          ) {
            student.courseInformation[studentCourse].homeworks.push({
              name: newHomework.name,
              completed: false,
            });
            updatePromises.push(
              transaction.update(doc(db, 'Students', studentIdList[i]), {
                courseInformation: student.courseInformation,
              }),
            );
          }
        }
      }

      // Add homework to course
      course.homeworks.push(newHomework);
      await transaction.update(doc(db, 'Courses', courseId), {
        homeworks: course.homeworks,
      });

      await Promise.all(updatePromises)
        .then(() => {
          resolve(course);
        })
        .catch(() => {
          reject();
        });
    }).catch(() => {
      reject();
    });
  });
}

export function updateCourseHomework(
  course: Course,
  courseID: string,
  prevHomework: Homework,
  updatedHomework: Homework,
): Promise<Course> {
  return new Promise((resolve, reject) => {
    let noReplace = true;
    let containsDuplicate = false;
    let newHomeworkList: Array<Homework> = [];
    course.homeworks.forEach((hw) => {
      if (prevHomework.name === hw.name) {
        noReplace = false;
      } else if (updatedHomework.name === hw.name) {
        containsDuplicate = true;
      } else {
        newHomeworkList.push(hw);
      }
    });

    if (noReplace) {
      reject(new Error('Homework with chosen name does not exist '));
      return;
    }

    if (containsDuplicate) {
      reject(new Error('Homework  with chosen name already exists'));
      return;
    }

    newHomeworkList.push(updatedHomework);
    course.homeworks = newHomeworkList;
    updateCourse(course, courseID)
      .then(() => {
        resolve(course);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

//Old Add Attendance function -> to be deleted
//Replaced by "AddAttendance"
export function removeAttendanceFromStudents(
  courseID: string,
  attendanceDate: string,
  students: Array<StudentID>,
): Promise<Array<StudentID>> {
  return new Promise((resolve, reject) => {
    const newStudentList = students.map((student) => {
      const newCourseInfo: StudentCourse[] = [];
      student.courseInformation.forEach((course) => {
        if (course.id === courseID) {
          let newAttendanceList: StudentAttendance[] = [];
          course.attendance.forEach((att) => {
            if (att.date !== attendanceDate) {
              newAttendanceList.push(att);
            }
          });
          course.attendance = newAttendanceList;
        }
        newCourseInfo.push(course);
      });

      student.courseInformation = newCourseInfo;
      updateStudent(student, student.id).catch((e) => {
        reject(e);
        return;
      });
      return student;
    });
    resolve(newStudentList);
  });
}

export function updateAttendanceStudents(
  courseID: string,
  prevDate: string,
  updatedDate: string,
  students: Array<StudentID>,
): Promise<Array<StudentID>> {
  return new Promise((resolve, reject) => {
    const newStudentList = students.map((student) => {
      const newCourseInfo = student.courseInformation.map((course) => {
        if (course.id === courseID) {
          let newCourseAttendanceList: Array<StudentAttendance> = [];
          let prevAttended = false;
          course.attendance.forEach((attendance) => {
            if (attendance.date !== prevDate) {
              newCourseAttendanceList.push(attendance);
            } else {
              prevAttended = attendance.attended;
            }
          });
          newCourseAttendanceList.push({
            date: updatedDate,
            attended: prevAttended,
          });
          course.attendance = newCourseAttendanceList.sort(compareDayJSDates);
        }
        return course;
      });
      student.courseInformation = newCourseInfo;
      updateStudent(student, student.id).catch((e) => {
        reject(e);
        return;
      });
      return student;
    });
    resolve(newStudentList);
  });
}

export function addHomeworkToStudents(
  courseID: string,
  name: string,
  students: Array<StudentID>,
): Promise<Array<StudentID>> {
  return new Promise((resolve, reject) => {
    const res = students.map((student) => {
      const newCourseInfo = student.courseInformation.map((course) => {
        if (course.id === courseID) {
          course.homeworks.push({ name: name, completed: false });
        }
        return course;
      });
      student.courseInformation = newCourseInfo;
      updateStudent(student, student.id).catch((e) => {
        reject(e);
        return;
      });
      return student;
    });
    resolve(res);
  });
}

export function updateHomeworkStudents(
  courseID: string,
  prevHwName: string,
  updatedHwName: string,
  students: Array<StudentID>,
): Promise<Array<StudentID>> {
  return new Promise((resolve, reject) => {
    const newStudentList = students.map((student) => {
      const newCourseInfo = student.courseInformation.map((course) => {
        if (course.id === courseID) {
          let newCourseHomework: Array<StudentHomework> = [];
          let prevCompleted = false;
          course.homeworks.forEach((homework) => {
            if (homework.name !== prevHwName) {
              newCourseHomework.push(homework);
            } else {
              prevCompleted = homework.completed;
            }
          });
          newCourseHomework.push({
            name: updatedHwName,
            completed: prevCompleted,
          });
          course.homeworks = newCourseHomework;
        }
        return course;
      });
      student.courseInformation = newCourseInfo;
      updateStudent(student, student.id).catch((e) => {
        reject(e);
        return;
      });
      return student;
    });
    resolve(newStudentList);
  });
}

export function updateUser(YKNOTUser: YKNOTUser, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === '' || !id) {
      reject(new Error('Invalid id'));
      return;
    }

    const userRef = doc(db, 'Users', id);
    updateDoc(userRef, { ...YKNOTUser })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}
