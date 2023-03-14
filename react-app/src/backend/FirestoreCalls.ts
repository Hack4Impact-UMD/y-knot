import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Sample function
export function sampleFunction(object: Object): Promise<string> {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, 'CollectionName'), object)
      .then((docRef) => {
        return resolve(docRef.id);
      })
      .catch((e) => {
        return reject(e);
      });
  });
}
