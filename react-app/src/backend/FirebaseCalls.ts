import { type AuthError, type User } from '@firebase/auth';
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import app from '../config/firebase';

export async function authenticateUser(
  email: string,
  password: string,
): Promise<User> {
  return await new Promise((resolve, reject) => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        resolve(userCredential.user);
      })
      .catch((error: AuthError) => {
        reject(error);
      });
  });
}

export async function logOut(): Promise<void> {
  await new Promise((resolve, reject) => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function sendResetEmail(email: string): Promise<void> {
  await new Promise((resolve, reject) => {
    const auth = getAuth(app);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
