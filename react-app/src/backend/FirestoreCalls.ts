import { collection, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { type Student } from '../types/StudentType';

// Sample function
export async function sampleFunction(object: Object): Promise<string> {
  return await new Promise((resolve, reject) => {
    addDoc(collection(db, 'CollectionName'), object)
      .then((docRef) => {
        resolve(docRef.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export async function addStudent(student: Student): Promise<string> {
  return await new Promise((resolve, reject) => {
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

export async function deleteStudent(id: string): Promise<void> {
  await new Promise((resolve, reject) => {
    deleteDoc(doc(db, 'Students', id))
      .then((docRef) => {
        resolve(docRef);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
