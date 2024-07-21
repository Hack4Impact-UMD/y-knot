import { getAuth, sendPasswordResetEmail } from '@firebase/auth';
import { httpsCallable } from 'firebase/functions';
import app, { functions } from '../config/firebase';
import { deleteTeacher } from './FirestoreCalls';

/*
 * Creates a user and sends a password reset email to that user.
 */
export function createUser(
  newEmail: string,
  newName: string,
  newRole: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (newRole != 'TEACHER' && newRole != 'ADMIN') {
      reject();
    }
    const createUserCloudFunction = httpsCallable(functions, 'createUser');
    const auth = getAuth(app);

    createUserCloudFunction({ email: newEmail, name: newName, role: newRole })
      .then(async () => {
        await sendPasswordResetEmail(auth, newEmail)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject();
          });
      })
      .catch((error) => {
        reject();
      });
  });
}

/*
 * Creates a user and sends a password reset email to that user.
 */
export function setUserRole(auth_id: string, newRole: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (newRole != 'TEACHER' && newRole != 'ADMIN') {
      reject('Role must be TEACHER or ADMIN');
    }
    const setUserCloudFunction = httpsCallable(functions, 'setUserRole');
    setUserCloudFunction({ firebase_id: auth_id, role: newRole })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/*
 * Deletes a user given their auth id
 */
export function deleteUser(auth_id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const deleteUserCloudFunction = httpsCallable(functions, 'deleteUser');
    deleteTeacher(auth_id)
      .then(async () => {
        await deleteUserCloudFunction({ firebase_id: auth_id });
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateUserEmail(
  oldEmail: string,
  currentEmail: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const updateUserEmailCloudFunction = httpsCallable(
      functions,
      'updateUserEmail',
    );

    updateUserEmailCloudFunction({ email: oldEmail, newEmail: currentEmail })
      .then(async (res) => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/*
 * Sends a certificate to a student
 */
export function sendCertificateEmail(email: string, file: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const sendCert = httpsCallable(functions, 'sendCertificateEmail');

    sendCert({ email: email, attachment: file })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default {};
