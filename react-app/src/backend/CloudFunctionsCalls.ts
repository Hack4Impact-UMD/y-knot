import app, { functions } from '../config/firebase';

import { httpsCallable } from 'firebase/functions';
import { getAuth, sendPasswordResetEmail } from '@firebase/auth';
import { authenticateUser } from './FirebaseCalls';

/*
 * Creates a user and sends a password reset email to that user.
 */
export function createUser(
  newEmail: string,
  newName: string,
  newRole: string,
): void {
  const createUserCloudFunction = httpsCallable(functions, 'createUser');
  const auth = getAuth(app);

  createUserCloudFunction({ email: newEmail, name: newName, role: newRole })
    .then(() => {
      sendPasswordResetEmail(auth, newEmail).catch((error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

export function createAdmin(): void {
  const createFirstAdmin = httpsCallable(functions, 'createFirstAdmin');
  createFirstAdmin()
    .then(() => {})
    .catch((error) => {
      console.log(error);
    });
}

export function updateUserEmail(
  oldEmail: string,
  currentEmail: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const createUserCloudFunction = httpsCallable(functions, 'updateUserEmail');
    const auth = getAuth(app);

    createUserCloudFunction({ email: oldEmail, newEmail: currentEmail })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
export default {};
