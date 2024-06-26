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
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  StudentAttendance,
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
import dayjs from 'dayjs';

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

/* Update attendance note and date for course and students
 Note: This does not update individual student attendance */
export function updateCourseAttendanceDetails(
  courseId: string,
  studentIdList: Array<string>,
  oldAttendance: Attendance,
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
      var updatePromises = [];

      if (oldAttendance.date !== newAttendance.date) {
        // Reject if new attendance date already exists for course and isn't the same as previous
        if (course.attendance.find((att) => att.date === newAttendance.date)) {
          reject(new Error('Attendance already exists for date'));
          throw 'Attendance already exists for date';
        } // Only update student attendance if date has changed
        else {
          var studentPromises = [];
          for (const studentId of studentIdList) {
            studentPromises.push(
              transaction.get(doc(db, 'Students', studentId)),
            );
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
              // Update attendance for student if it exists
              const studentAttendance = student.courseInformation[
                studentCourse
              ].attendance.find((att) => att.date === oldAttendance.date);
              if (studentAttendance) {
                studentAttendance.date = newAttendance.date;
              } else {
                student.courseInformation[studentCourse].attendance.push({
                  date: newAttendance.date,
                  attended: false,
                });
              }
              updatePromises.push(
                transaction.update(doc(db, 'Students', studentIdList[i]), {
                  courseInformation: student.courseInformation,
                }),
              );
            }
          }
        }
      }

      // Update course attendance
      const courseAttendance = course.attendance.find(
        (att) => att.date === oldAttendance.date,
      );
      if (courseAttendance) {
        courseAttendance.date = newAttendance.date;
        courseAttendance.notes = newAttendance.notes;
      }
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

export function updateStudentAttendance(
  courseId: string,
  studentIdList: Array<string>,
  presentStudentIds: Array<string>,
  attendanceDate: string,
): Promise<Array<StudentID>> {
  return new Promise((resolve, reject) => {
    runTransaction(db, async (transaction) => {
      let students: StudentID[] = [];

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
          const studentAttendance = student.courseInformation[
            studentCourse
          ].attendance.find((att) => att.date === attendanceDate);

          if (
            studentAttendance &&
            presentStudentIds.includes(studentIdList[i])
          ) {
            studentAttendance.attended = true;
          } else if (
            studentAttendance &&
            !presentStudentIds.includes(studentIdList[i])
          ) {
            studentAttendance.attended = false;
          } else {
            reject(new Error('Attendance date does not exist in student'));
          }
          updatePromises.push(
            transaction.update(doc(db, 'Students', studentIdList[i]), {
              courseInformation: student.courseInformation,
            }),
          );
        }
        students.push({ ...student, id: studentIdList[i] });
      }

      await Promise.all(updatePromises)
        .then(() => {
          resolve(students);
        })
        .catch(() => {
          reject();
        });
    }).catch(() => {
      reject();
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

// Remove homework from course and students
export function removeCourseHomework(
  courseId: string,
  studentIdList: Array<string>,
  homeworkName: string,
): Promise<Course> {
  return new Promise((resolve, reject) => {
    runTransaction(db, async (transaction) => {
      const courseRef = await transaction.get(doc(db, 'Courses', courseId));
      if (!courseRef.exists()) {
        reject(new Error('Course does not exist!'));
        throw 'Course does not exist!';
      }

      const course: Course = courseRef.data() as Course;
      // Reject if homework name doesn't exist for course
      if (!course.homeworks.find((hw) => hw.name == homeworkName)) {
        reject(new Error('Homework does not exist'));
        throw 'Homework does not exist';
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
          // Remove homework from student if it exists
          if (
            student.courseInformation[studentCourse].homeworks.find(
              (hw) => hw.name == homeworkName,
            )
          ) {
            student.courseInformation[studentCourse].homeworks =
              student.courseInformation[studentCourse].homeworks.filter(
                (hw) => {
                  return hw.name != homeworkName;
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

      // Remove homework from course
      course.homeworks = course.homeworks.filter((hw) => {
        return hw.name != homeworkName;
      });
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

/* Update homework note and name for course and students
 Note: This does not update individual student homework completion */
export function updateCourseHomeworkDetails(
  courseId: string,
  studentIdList: Array<string>,
  oldHomework: Homework,
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
      var updatePromises = [];

      if (oldHomework.name !== newHomework.name) {
        // Reject if new homework name already exists for course and isn't the same as previous
        if (course.homeworks.find((hw) => hw.name === newHomework.name)) {
          reject(new Error('Homework already exists for date'));
          throw 'Homework already exists for date';
        } // Only update student homework if name has changed
        else {
          var studentPromises = [];
          for (const studentId of studentIdList) {
            studentPromises.push(
              transaction.get(doc(db, 'Students', studentId)),
            );
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
              // Update homework for student if it exists
              const studentHomework = student.courseInformation[
                studentCourse
              ].homeworks.find((hw) => hw.name === oldHomework.name);
              if (studentHomework) {
                studentHomework.name = newHomework.name;
              } else {
                student.courseInformation[studentCourse].homeworks.push({
                  name: newHomework.name,
                  completed: false,
                });
              }
              updatePromises.push(
                transaction.update(doc(db, 'Students', studentIdList[i]), {
                  courseInformation: student.courseInformation,
                }),
              );
            }
          }
        }
      }

      // Update course homework
      const addCourseHomework = course.homeworks.find(
        (hw) => hw.name === oldHomework.name,
      );
      if (addCourseHomework) {
        addCourseHomework.name = newHomework.name;
        addCourseHomework.notes = newHomework.notes;
      }
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

export function updateStudentHomeworks(
  courseId: string,
  studentIdList: Array<string>,
  completedStudentIds: Array<string>,
  homeworkName: string,
): Promise<Array<StudentID>> {
  return new Promise((resolve, reject) => {
    runTransaction(db, async (transaction) => {
      let students: StudentID[] = [];

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
          const studentHomework = student.courseInformation[
            studentCourse
          ].homeworks.find((hw) => hw.name === homeworkName);

          if (
            studentHomework &&
            completedStudentIds.includes(studentIdList[i])
          ) {
            studentHomework.completed = true;
          } else if (
            studentHomework &&
            !completedStudentIds.includes(studentIdList[i])
          ) {
            studentHomework.completed = false;
          } else {
            reject(new Error('Homework does not exist in student'));
          }
          updatePromises.push(
            transaction.update(doc(db, 'Students', studentIdList[i]), {
              courseInformation: student.courseInformation,
            }),
          );
        }
        students.push({ ...student, id: studentIdList[i] });
      }

      await Promise.all(updatePromises)
        .then(() => {
          resolve(students);
        })
        .catch(() => {
          reject();
        });
    }).catch(() => {
      reject();
    });
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
