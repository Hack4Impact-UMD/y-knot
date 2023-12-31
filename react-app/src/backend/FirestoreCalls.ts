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
  StudentHomework,
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

export function addCourse(course: Course): Promise<string> {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, 'Courses'), course)
      .then((docRef) => {
        resolve(docRef.id);
      })
      .catch((e) => {
        reject(e);
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

export function addCourseAttendance(
  course: Course,
  courseID: string,
  newAttendance: { date: string; notes: string },
): Promise<Course> {
  return new Promise((resolve, reject) => {
    let failed: boolean = false;
    course.attendance.forEach((prevAttendance) => {
      if (prevAttendance.date === newAttendance.date) {
        failed = true;
      }
    });
    if (failed) {
      reject(new Error('Attendance already exists for date'));
      return;
    }

    course.attendance.push(newAttendance);
    updateCourse(course, courseID)
      .then(() => {
        resolve(course);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function updateCourseAttendance(
  course: Course,
  courseID: string,
  updatedAttendance: { date: string; notes: string },
): Promise<Course> {
  return new Promise((resolve, reject) => {
    let noReplace: boolean = true;
    const newAttendance = course.attendance.map((prevAttendance) => {
      if (prevAttendance.date === updatedAttendance.date) {
        noReplace = false;
        return updatedAttendance;
      } else {
        return prevAttendance;
      }
    });
    if (noReplace) {
      reject(new Error('Attendance does not exist'));
      return;
    }

    course.attendance = newAttendance;
    updateCourse(course, courseID)
      .then(() => {
        resolve(course);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function addCourseHomework(
  course: Course,
  courseID: string,
  newHomework: { name: string; notes: string },
): Promise<Course> {
  return new Promise((resolve, reject) => {
    let failed: boolean = false;
    course.homeworks.forEach((prevAttendance) => {
      if (prevAttendance.name === newHomework.name) {
        failed = true;
      }
    });
    if (failed) {
      reject(new Error('Assignment with duplicate name exists'));
      return;
    }

    course.homeworks.push(newHomework);
    updateCourse(course, courseID)
      .then(() => {
        resolve(course);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function updateCourseHomework(
  course: Course,
  courseID: string,
  updatedHomework: { name: string; notes: string },
): Promise<Course> {
  return new Promise((resolve, reject) => {
    let noReplace: boolean = true;
    const newHomework = course.homeworks.map((prevHomework) => {
      if (prevHomework.name === updatedHomework.name) {
        noReplace = false;
        return updatedHomework;
      } else {
        return prevHomework;
      }
    });
    if (noReplace) {
      reject(new Error('Attendance does not exist'));
      return;
    }

    course.homeworks = newHomework;
    updateCourse(course, courseID)
      .then(() => {
        resolve(course);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function addAttendanceToStudents(
  courseID: string,
  date: string,
  students: Array<StudentID>,
): Promise<Array<StudentID>> {
  return new Promise((resolve, reject) => {
    const res = students.map((student) => {
      const newCourseInfo = student.courseInformation.map((course) => {
        if (course.id === courseID) {
          course.attendance.push({ date: date, attended: false });
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
