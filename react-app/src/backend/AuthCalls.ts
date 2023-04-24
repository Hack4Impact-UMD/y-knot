import {
  getAuth,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type AuthError,
} from 'firebase/auth';
import app from '../config/firebase';

/*
Updates the logged-in user's email.
May fail if the login token is old. Currently not handling this case, because
this function should be called with the RequireAdminAuth function
which should update the token. Another solution is to include a password
field in the frontend for this.

TODO: make error messages work

Parameters:
Email: the new email
*/
export async function updateUserEmail(email: string): Promise<string> {
  const auth = getAuth(app);
  const user = auth.currentUser;
  let status = 'Unknown Error Occured';

  if (user != null) {
    const currEmail = user.email;
    await updateEmail(user, email)
      .then(() => {
        status = `Changed current account's email from ${currEmail} to ${email}`;
      })
      .catch((error) => {
        const code = (error as AuthError).code;
        if (
          code === 'auth/invalid-email' ||
          code === 'auth/email-already-in-use'
        ) {
          status = 'Invalid email entered';
        } else if (code === 'auth/requires-recent-login') {
          status = 'Session expired. Please sign in again.';
        } else {
          status = 'Failed to change email. Please try again later.';
        }
      });
  } else {
    status = 'Session expired. Please sign in again.';
  }

  return status;
}

/*
Updates the logged-in user's password.
Shouldn't face the re-authentication issue because password is provided to re-authenticate within the function.

TODO: make error messages change properly.
 */
export async function updateUserPassword(
  newPassword: string,
  oldPassword: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user != null) {
      const credential = EmailAuthProvider.credential(user.email!, oldPassword);
      reauthenticateWithCredential(user, credential)
        .then(async () => {
          updatePassword(user, newPassword)
            .then(() => {
              resolve('Successfully updated password');
            })
            .catch((error) => {
              const code = (error as AuthError).code;
              if (code === 'auth/weak-password') {
                reject('New password should be at least 6 characters');
              } else {
                reject('Error updating password. Please try again later.');
              }
            });
        })
        .catch((error) => {
          const code = (error as AuthError).code;
          if (code === 'auth/wrong-password') {
            reject('Your original password is incorrect.');
          } else if (code === 'auth/too-many-request') {
            reject(`Access to this account has been temporarily disabled due to many failed
            login attempts or due to too many failed password resets. Please try again later`);
          } else {
            reject('Failed to authenticate user. Please log in again.');
          }
        });
    } else {
      reject('Session expired. Please sign in again.');
    }
  });
}
