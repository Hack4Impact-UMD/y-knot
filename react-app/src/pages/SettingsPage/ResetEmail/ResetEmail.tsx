import { useState } from 'react';
import Modal from '../../../components/ModalWrapper/Modal';
import x from '../../../assets/x.svg';
import styles from './ResetEmail.module.css';
import { authenticateUser } from '../../../backend/FirebaseCalls';
import { useAuth } from '../../../auth/AuthProvider';
import { updateUserEmail } from '../../../backend/CloudFunctionsCalls';

interface modalType {
  open: boolean;
  onClose: any;
}

const ResetEmail = ({ open, onClose }: modalType): React.ReactElement => {
  const [password, setPassword] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [confirmNewEmail, setConfirmNewEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useAuth();

  const handleEmailChange = async () => {
    setLoading(true);
    if (submitted) {
      handleOnClose();
    } else if (
      password.trim() == '' ||
      newEmail.trim() == '' ||
      confirmNewEmail.trim() == ''
    ) {
      setErrorMessage('*All fields are required');
    } else if (newEmail !== confirmNewEmail) {
      setErrorMessage('*Your new email addresses must match.');
    } else if (
      !/^[\w]+@[\w]+(\.\w+)+$/.test(newEmail) ||
      !/^[\w]+@[\w]+(\.\w+)+$/.test(confirmNewEmail)
    ) {
      setErrorMessage('*Invalid email address.');
    } else {
      await authenticateUser(auth.user.email!, password)
        .then(() => {
          updateUserEmail(newEmail, confirmNewEmail)
            .then(() => {
              console.log('done!');
            })
            .catch((error) => setErrorMessage(error));
        })
        .catch((error) => {
          setErrorMessage('Password is incorrect');
        });
    }
    setTimeout(() => setLoading(false), 100);
  };

  const handleOnClose = (): void => {
    onClose();
    setSubmitted(false);
    setNewEmail('');
    setConfirmNewEmail('');
    setErrorMessage('');
    setLoading(false);
  };

  return (
    <Modal
      height={325}
      open={open}
      onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
        handleOnClose();
      }}
    >
      <>
        <div className={styles.header}>
          <button
            className={styles.close}
            onClick={() => {
              handleOnClose();
            }}
          >
            <img src={x} alt="Close popup" />
          </button>
        </div>
        <div className={styles.content}>
          {submitted ? (
            <div className={styles.submit}>
              Thank you! Check your email for further instructions.
            </div>
          ) : (
            <>
              <h2 className={styles.title}>Reset Email</h2>
              <p className={styles.error}>{errorMessage}</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleEmailChange();
                }}
              >
                <input
                  required
                  className={styles.textInput}
                  type="password"
                  placeholder="Current Password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleEmailChange();
                    }
                  }}
                />
                <input
                  required
                  className={styles.textInput}
                  type="email"
                  placeholder="New Email"
                  onChange={(event) => {
                    setNewEmail(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleEmailChange();
                    }
                  }}
                />
                <input
                  required
                  className={styles.textInput}
                  type="email"
                  placeholder="Re-enter New Email"
                  onChange={(event) => {
                    setConfirmNewEmail(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleEmailChange();
                    }
                  }}
                />
              </form>
            </>
          )}
        </div>
        <div className={styles.actions}>
          <div className={styles.container}>
            <button
              className={styles.resetButton}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                handleEmailChange();
              }}
              disabled={loading}
            >
              {submitted ? (
                'Close'
              ) : (
                <div>
                  {loading ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    'Reset Email'
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default ResetEmail;
