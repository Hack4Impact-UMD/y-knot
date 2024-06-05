import { useState } from 'react';
import { createUser } from '../../../backend/CloudFunctionsCalls';
import { useNavigate } from 'react-router-dom';
import styles from './AddTeacher.module.css';
import Modal from '../../../components/ModalWrapper/Modal';
import Loading from '../../../components/LoadingScreen/Loading';
import x from '../../../assets/x.svg';

interface modalType {
  open: boolean;
  onClose: any;
}

const AddTeacher = ({ open, onClose }: modalType): React.ReactElement => {
  const [password, setPassword] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [confirmNewEmail, setConfirmNewEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

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
      await createUser(newEmail, password, 'TEACHER')
        .then(() => {
          window.location.reload();
        })
        .catch(() => {});
    }
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  const handleOnClose = (): void => {
    if (submitted) {
      navigate('../login');
    }
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
      onClose={() => {
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
              <h2 className={styles.title}>Add Teacher</h2>
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
                  type="text"
                  placeholder="Teacher Name"
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
                  placeholder="Teacher Email"
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
                  placeholder="Re-enter Teacher Email"
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
              onClick={() => {
                handleEmailChange();
              }}
              disabled={loading}
            >
              {submitted ? (
                'Back to Login'
              ) : (
                <div>{loading ? <Loading /> : 'Add Teacher'}</div>
              )}
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default AddTeacher;
