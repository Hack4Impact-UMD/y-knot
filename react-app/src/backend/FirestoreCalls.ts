import dayjs from 'dayjs';
import { diceCoefficient } from 'dice-coefficient';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { db } from '../config/firebase';
import { Attendance, Homework, Course, CourseID } from '../types/CourseType';
import {
  LeadershipApplicant,
  StudentAttendance,
  StudentHomework,
  StudentMatch,
  Student,
  StudentID,
} from '../types/StudentType';
import { TeacherID, Teacher, YKNOTUser } from '../types/UserType';

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

export function getAcademyApplications(
  classId: string,
): Promise<LeadershipApplicant[]> {
  const leadershipRef = collection(db, 'LeadershipApplications');
  const filter = query(leadershipRef, where('classId', '==', classId));

  return new Promise((resolve, reject) => {
    getDocs(filter)
      .then((snapshot) => {
        const allApplications: LeadershipApplicant[] = [];
        snapshot.docs.map((doc) => {
          const application = {
            ...doc.data(),
            firebaseID: doc.id,
          } as LeadershipApplicant;
          allApplications.push(application);
        });
        resolve(allApplications);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function rejectLeadershipApplication(
  currentApplicant: LeadershipApplicant,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // Delete the Leadership Application
    const applicationRef = doc(
      db,
      'LeadershipApplications',
      currentApplicant.firebaseID,
    );
    await deleteDoc(applicationRef)
      .then(() => {
        resolve();
      })
      .catch(() => reject());

    // Delete files from the storage
    const storage = getStorage();
    for (
      let j = 0;
      j < (currentApplicant['transcriptFiles']?.length || 0);
      j++
    ) {
      const pathReference = ref(
        storage,
        currentApplicant['transcriptFiles'][j]['ref'],
      );
      await deleteObject(pathReference).catch((error) => {});
    }

    for (let j = 0; j < (currentApplicant['recFiles']?.length || 0); j++) {
      const pathReference = ref(
        storage,
        currentApplicant['recFiles'][j]['ref'],
      );
      await deleteObject(pathReference).catch((error) => {});
    }
  });
}

export function acceptLeadershipApplication(
  currentApplicant: LeadershipApplicant,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // Next we check if the student exists in the database
    const studentRef = collection(db, 'Students');
    const filter = query(
      studentRef,
      where('birthDate', '==', currentApplicant.birthDate),
    );
    let possibleStudentMatches: any[] = [];
    const matchingStudent = await getDocs(filter)
      .then((snapshot) => {
        if (snapshot.docs.length == 0) {
          return undefined;
        }
        const student = snapshot.docs.find((doc) => {
          const studentData = doc.data();
          const formName =
            currentApplicant.firstName.toLowerCase() +
            (currentApplicant?.middleName?.toLowerCase() || '') +
            currentApplicant.lastName.toLowerCase();
          const databaseName =
            studentData.firstName.toLowerCase() +
            (studentData.middleName || '').toLowerCase() +
            studentData.lastName.toLowerCase();

          // We check for similarity in order to suggest whether two students might be the same
          const similarity = diceCoefficient(formName, databaseName);
          if (similarity == 1) {
            return doc;
          } else if (similarity > 0.35) {
            possibleStudentMatches.push(doc.id);
          }
        });
        if (student) {
          /* If the student already exists, we don't need to indicate possible matches
           as that was already done when the student was first created
        */
          possibleStudentMatches = [];
        }
        return student;
      })
      .catch((e) => {});

    const student: Student = {
      firstName: currentApplicant.firstName,
      middleName: currentApplicant.middleName,
      lastName: currentApplicant.lastName,
      addrFirstLine: currentApplicant.addrFirstLine,
      addrSecondLine: currentApplicant.addrSecondLine,
      city: currentApplicant.city,
      state: currentApplicant.state,
      zipCode: currentApplicant.zipCode,
      email: currentApplicant.email,
      phone: currentApplicant.phone,
      guardianFirstName: currentApplicant.guardianFirstName,
      guardianLastName: currentApplicant.guardianLastName,
      guardianEmail: currentApplicant.guardianEmail,
      guardianPhone: currentApplicant.guardianPhone,
      birthDate: currentApplicant.birthDate, // "YYYY-MM-DD"
      gradeLevel: currentApplicant.gradeLevel,
      schoolName: currentApplicant.schoolName,
      courseInformation: [
        {
          id: currentApplicant.classId,
          attendance: [],
          homeworks: [],
          progress: 'NA',
        },
      ],
    };
    const selectedCourse: void | { course: Course; id: DocumentReference } =
      await getDoc(doc(db, 'Courses', currentApplicant.classId))
        .then((classSnapshot) => {
          if (classSnapshot.exists()) {
            return {
              course: classSnapshot.data() as Course,
              id: classSnapshot.ref,
            };
          } else {
            reject();
          }
        })
        .catch((e) => {
          reject(e);
        });
    // Update the current student's course information if there is a match
    if (matchingStudent) {
      student.courseInformation = matchingStudent.data().courseInformation;
      console.log(student.courseInformation);

      const studentClass = matchingStudent
        .data()
        .courseInformation.find((course: any) => {
          if (course.id == currentApplicant.classId) {
            return course;
          }
        });

      if (!studentClass) {
        const attendances: StudentAttendance[] = [];
        const homeworks: StudentHomework[] = [];
        selectedCourse?.course.attendance.forEach((day) => {
          attendances.push({ date: day.date, attended: false });
        });
        selectedCourse?.course.homeworks.forEach((homework) => {
          homeworks.push({ name: homework.name, completed: false });
        });
        student.courseInformation.push({
          id: currentApplicant.classId,
          attendance: attendances,
          homeworks: homeworks,
          progress: 'NA',
        });
      }
    }

    const batch = writeBatch(db);

    // Creates a new auto-generated id
    const autoID = matchingStudent
      ? matchingStudent.ref
      : doc(collection(db, 'Students'));

    batch.set(autoID, student);
    const studentId = matchingStudent ? matchingStudent.id : autoID.id;

    // Update the class's students
    const classStudents = selectedCourse?.course.students || [];
    if (!classStudents.includes(studentId)) {
      classStudents.push(studentId);
    }

    batch.update(selectedCourse?.id!, { students: classStudents });

    if (possibleStudentMatches.length > 0) {
      const docRef = doc(collection(db, 'StudentMatches'));
      batch.set(docRef, {
        studentOne: studentId,
        matches: possibleStudentMatches,
      });
    }

    await batch
      .commit()
      .then()
      .catch(async () => {
        reject();
      });

    // Delete the Leadership Application
    rejectLeadershipApplication(currentApplicant)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

export function updateAcademyNote(newNote: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === '' || !id) {
      reject(new Error('Invalid id'));
      return;
    }

    const courseRef = doc(db, 'LeadershipApplications', id);
    updateDoc(courseRef, { statusNote: newNote })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getAllStudentMatches(): Promise<StudentMatch[]> {
  const studentsRef = collection(db, 'StudentMatches');
  return new Promise((resolve, reject) => {
    getDocs(studentsRef)
      .then((snapshot) => {
        const allStudentMatches: StudentMatch[] = [];
        const students = snapshot.docs.map((doc) => {
          const studentMatch: StudentMatch = doc.data() as StudentMatch;
          allStudentMatches.push(studentMatch);
        });
        resolve(allStudentMatches);
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

export function getAllCourses(auth_id?: string): Promise<CourseID[]> {
  let coursesRef: any = collection(db, 'Courses');
  if (auth_id) {
    coursesRef = query(
      collection(db, 'Courses'),
      where('teachers', 'array-contains', auth_id),
    );
  }
  return new Promise((resolve, reject) => {
    getDocs(coursesRef)
      .then((snapshot) => {
        const courseID: CourseID[] = [];
        const courses = snapshot.docs.map((doc) => {
          console.log(doc.data());
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

export function deleteStudentMatch(
  studentOneId: string,
  studentTwoId: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const studentMatchesRef = collection(db, 'StudentMatches');
    const filter = query(
      studentMatchesRef,
      where('studentOne', '==', studentOneId),
    );
    getDocs(filter)
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          const studentMatch: StudentMatch = doc.data() as StudentMatch;

          // Remove entries in studentOne matching studentTwo
          if (studentMatch.matches.includes(studentTwoId)) {
            const newMatches = studentMatch.matches.filter(
              (id) => id !== studentTwoId,
            );

            // If studentMatch.matches is empty, delete the document. Otherwise, update the document.
            if (newMatches.length === 0) {
              deleteDoc(doc.ref)
                .then(() => {
                  resolve();
                })
                .catch(() => {
                  reject();
                });
            } else {
              updateDoc(doc.ref, { matches: newMatches })
                .then(() => {
                  resolve();
                })
                .catch(() => {
                  reject();
                });
            }
          }
        });
      })
      .catch(() => {
        reject();
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
      let students: string[][] = [];
      const studentCourses: any[] = [];
      studentRef.courseInformation.map(async (course) => {
        idOrder.push(course.id);
        studentCourses.push(transaction.get(doc(db, 'Courses', course.id)));
      }),
        await Promise.all(studentCourses).then((result) => {
          result.forEach((course) => {
            students.push((course.data() as Course).students);
          });
        });
      students = students.map((student, index) => {
        return student.filter((s) => s !== id);
      });
      const promisesList = [];
      idOrder.map((id, index) => {
        promisesList.push(
          transaction.update(doc(db, 'Courses', id), {
            students: students[index],
          }),
        );
      });
      promisesList.push(transaction.delete(doc(db, 'Students', id)));
      await Promise.all(promisesList);
    })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
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

export function addStudentCourseFromList(
  studentIdList: Array<string>,
  courseId: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    runTransaction(db, async (transaction) => {
      const courseRef = await transaction.get(doc(db, 'Courses', courseId));
      if (!courseRef.exists()) {
        throw 'Course does not exist!';
      }

      const course: Course = courseRef.data() as Course;
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
        });

      var updatePromises = [];

      for (let i = 0; i < studentRefList.length; i++) {
        var studentRef = studentRefList[i];
        const student: Student = studentRef.data() as Student;
        if (
          !student.courseInformation.find(
            (student) => student.id === courseId,
          ) &&
          !course.students.includes(studentIdList[i])
        ) {
          const attendances: StudentAttendance[] = [];
          const homeworks: StudentHomework[] = [];
          course.attendance.forEach((day) => {
            attendances.push({ date: day.date, attended: false });
          });
          course.homeworks.forEach((homework) => {
            homeworks.push({ name: homework.name, completed: false });
          });
          student.courseInformation.push({
            id: courseId,
            attendance: attendances,
            homeworks: homeworks,
            progress: 'NA',
          });
          course.students.push(studentIdList[i]);
          updatePromises.push(
            transaction.update(doc(db, 'Students', studentIdList[i]), {
              courseInformation: student.courseInformation,
            }),
          );
        }
      }

      updatePromises.push(
        transaction.update(doc(db, 'Courses', courseId), {
          students: course.students,
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

/* Removes a teacher from all of their courses and vice versa */
export function removeAllTeacherCourses(teacherId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    runTransaction(db, async (transaction) => {
      const teacherRef = await transaction.get(doc(db, 'Users', teacherId));

      if (!teacherRef.exists()) {
        throw 'Teacher does not exist!';
      }
      const teacher: Teacher = teacherRef.data() as Teacher;
      const teacherCourseList = teacher.courses;

      var coursePromises = [];

      for (const courseId of teacherCourseList) {
        coursePromises.push(transaction.get(doc(db, 'Courses', courseId)));
      }

      var courseRefList: any[] = [];
      await Promise.all(coursePromises)
        .then((courseRef) => {
          courseRefList = courseRef;
        })
        .catch(() => {
          reject(new Error('A course does not exist!'));
        });

      var updatePromises: any[] = [];

      for (let i = 0; i < courseRefList.length; i++) {
        if (!courseRefList[i].exists()) {
          reject(new Error('A course does not exist!'));
          throw new Error('A course does not exist!');
        }

        const courseId = teacherCourseList[i];
        const course: Course = courseRefList[i].data() as Course;

        if (teacher.courses.includes(courseId)) {
          teacher.courses = teacher.courses.filter((c) => c !== courseId);
          updatePromises.push(
            transaction.update(doc(db, 'Users', teacherId), {
              courses: teacher.courses,
            }),
          );
        } else {
          reject(new Error('Course does not exist in teacher'));
          throw new Error('Course does not exist in teacher');
        }

        if (course.teachers.includes(teacherId)) {
          course.teachers = course.teachers.filter((t) => t !== teacherId);
          updatePromises.push(
            transaction.update(doc(db, 'Courses', courseId), {
              teachers: course.teachers,
            }),
          );
        } else {
          reject(new Error('Teacher does not exist in course'));
          throw new Error('Teacher does not exist in course');
        }
      }

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

export function deleteCourse(courseId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    runTransaction(db, async (transaction) => {
      // retrieve course
      const courseRef = await transaction.get(doc(db, 'Courses', courseId));
      if (!courseRef.exists()) {
        throw 'Course does not exist!';
      }
      const course: Course = courseRef.data() as Course;

      // retrieve course teachers
      var teacherPromises = [];
      const teacherIdList = course.teachers;
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

      // retrieve course students
      var studentPromises = [];
      const studentIdList = course.students;
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
        });

      const removePromises = [];
      // remove course from teachers
      for (let i = 0; i < teacherRefList.length; i++) {
        var teacherRef = teacherRefList[i];
        const teacher: Teacher = teacherRef.data() as Teacher;
        if (teacher.courses.includes(courseId)) {
          teacher.courses = teacher.courses.filter(function (c) {
            return c !== courseId;
          });
          removePromises.push(
            transaction.update(doc(db, 'Users', teacherIdList[i]), {
              courses: teacher.courses,
            }),
          );
        }
      }

      // remove course from students
      for (let i = 0; i < studentRefList.length; i++) {
        var studentRef = studentRefList[i];
        const student: Student = studentRef.data() as Student;
        if (
          student.courseInformation.find((student) => student.id === courseId)
        ) {
          student.courseInformation = student.courseInformation.filter(
            (student) => student.id !== courseId,
          );
          removePromises.push(
            transaction.update(doc(db, 'Students', studentIdList[i]), {
              courseInformation: student.courseInformation,
            }),
          );
        }
      }

      // delete course
      removePromises.push(transaction.delete(doc(db, 'Courses', courseId)));
      await Promise.all(removePromises);
    })
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
  return new Promise(async (resolve, reject) => {
    const promises: any[] = [];
    let res = idList.map((id) => {
      const student = promises.push(getDoc(doc(db, 'Students', id)));
    });
    const students: StudentID[] = [];
    await Promise.all(promises)
      .then((values) => {
        values.map((student) => {
          if (student.exists()) {
            students.push({ ...student.data(), id: student.id });
          } else {
            reject(new Error('Student does not exist'));
          }
        });
        resolve(students);
      })
      .catch((error) => {
        reject();
      });
  });
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
