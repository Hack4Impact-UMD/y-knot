import { useState } from 'react';
import { authenticateUser } from '../../../backend/FirebaseCalls';
import { updateUserPassword } from '../../../backend/AuthCalls';
import styles from './ResetPassword.module.css';
import Modal from '../../../components/ModalWrapper/Modal';
import Loading from '../../../components/LoadingScreen/Loading';
import x from '../../../assets/x.svg';

interface modalType {
  open: boolean;
  onClose: any;
}

const ResetPassword = ({ open, onClose }: modalType): React.ReactElement => {
  const [originalPassword, setOriginalPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordReset = async () => {
    setLoading(true);
    if (submitted) {
      handleOnClose();
    } else if (
      originalPassword.trim() == '' ||
      newPassword.trim() == '' ||
      confirmNewPassword.trim() == ''
    ) {
      setErrorPassword('*All fields are required');
    } else if (newPassword !== confirmNewPassword) {
      setErrorPassword('*Your new passwords must match.');
    } else {
      await updateUserPassword(newPassword, originalPassword)
        .then(() => {
          setSubmitted(true);
          setErrorPassword('');
        })
        .catch((error) => {
          setErrorPassword(error);
          if (error.length > 50) {
            setSubmitted(true);
          }
        });
    }
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  const handleOnClose = (): void => {
    onClose();
    setSubmitted(false);
    setOriginalPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrorPassword('');
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
              {errorPassword != ''
                ? errorPassword
                : 'Your password has been updated.'}
            </div>
          ) : (
            <>
              <h2 className={styles.title}>Reset Password</h2>
              <p className={styles.error}>{errorPassword}</p>
              <input
                required
                className={styles.textInput}
                type="password"
                placeholder="Original Password"
                onChange={(event) => {
                  setOriginalPassword(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handlePasswordReset();
                  }
                }}
              />
              <input
                required
                className={styles.textInput}
                type="password"
                placeholder="New Password"
                onChange={(event) => {
                  setNewPassword(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handlePasswordReset();
                  }
                }}
              />
              <input
                required
                className={styles.textInput}
                type="password"
                placeholder="Re-enter New Password"
                onChange={(event) => {
                  setConfirmNewPassword(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handlePasswordReset();
                  }
                }}
              />
            </>
          )}
        </div>
        <div className={styles.actions}>
          <div className={styles.container}>
            <button
              className={styles.resetButton}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                handlePasswordReset();
              }}
              disabled={loading}
              type="submit"
            >
              {submitted ? (
                'Close'
              ) : (
                <div>{loading ? <Loading /> : 'Reset Password'}</div>
              )}
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default ResetPassword;
