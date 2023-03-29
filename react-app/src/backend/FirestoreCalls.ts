import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { type Student } from '../types/StudentType';
import { type Course } from '../types/CourseType';
import { type Teacher, type TeacherCourse } from '../types/UserType';

// Sample function
export function sampleFunction(object: Object): Promise<string> {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, 'CollectionName'), object)
      .then((docRef) => {
        resolve(docRef.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getAllStudents(): Promise<Student[]> {
  const studentsRef = collection(db, 'Students');
  return new Promise((resolve, reject) => {
    getDocs(studentsRef)
      .then((snapshot) => {
        const students = snapshot.docs.map((doc) => doc.data() as Student);
        resolve(students);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getAllTeachers(): Promise<Teacher[]> {
  const teachersRef = collection(db, 'Users');
  return new Promise((resolve, reject) => {
    getDocs(teachersRef)
      .then((snapshot) => {
        const teachers = snapshot.docs.map((doc) => doc.data() as Teacher);
        resolve(teachers);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getAllCourses(): Promise<Course[]> {
  const coursesRef = collection(db, 'Courses');
  return new Promise((resolve, reject) => {
    getDocs(coursesRef)
      .then((snapshot) => {
        const courses = snapshot.docs.map((doc) => doc.data() as Course);
        resolve(courses);
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
    deleteDoc(doc(db, 'Students', id))
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
    getDoc(doc(db, "Users", id))
      .then((teacherSnapshot) => {
        if (teacherSnapshot.exists()) {
          resolve(teacherSnapshot.data() as Teacher);
        } else {
          reject(new Error("Teacher does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      })
  });
}

export function getStudent(id: string): Promise<Student> {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, "Students", id))
      .then((studentSnapshot) => {
        if (studentSnapshot.exists()) {
          resolve(studentSnapshot.data() as Student)
        } else {
          reject(new Error("Student does not exist"))
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getCourse(id: string): Promise<Course> {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, "Courses", id))
      .then((courseSnapshot) => {
        if (courseSnapshot.exists()) {
          resolve(courseSnapshot.data() as Course)
        } else {
          reject(new Error("Course does not exist"))
        }
      })
      .catch((e) => {
        reject(e);
      })
  });
}
