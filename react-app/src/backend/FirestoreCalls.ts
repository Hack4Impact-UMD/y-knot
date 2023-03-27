import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
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
