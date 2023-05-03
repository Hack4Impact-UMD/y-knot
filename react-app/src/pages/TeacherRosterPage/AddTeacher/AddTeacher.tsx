import { useState } from 'react';
import { authenticateUser } from '../../../backend/FirebaseCalls';
import { useAuth } from '../../../auth/AuthProvider';
import { updateUserEmail } from '../../../backend/CloudFunctionsCalls';
import { useNavigate } from 'react-router-dom';
import styles from './ResetEmail.module.css';
import Modal from '../../../components/ModalWrapper/Modal';
import Loading from '../../../components/LoadingScreen/Loading';
import x from '../../../assets/x.svg';

interface modalType {
  open: boolean;
  onClose: any;
}

const AddTeacher = ({ open, onClose }: modalType): React.ReactElement => {
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleOnClose = (): void => {
    onClose();
    setSubmitted(false);
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
              Thank you! You will now be redirected to the login page.
            </div>
          ) : (
            <>
              <h2 className={styles.title}>Reset Email</h2>
              <p className={styles.error}>{errorMessage}</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
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
              }}
              disabled={loading}
            >
              {submitted ? (
                'Back to Login'
              ) : (
                <div>{loading ? <Loading /> : 'Reset Email'}</div>
              )}
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default AddTeacher;
