import { useState } from 'react';
import Modal from '../../../components/ModalWrapper/Modal';
import x from '../../../assets/x.svg';
import styles from './UpdateStudent.module.css';
import Loading from '../../../components/LoadingScreen/Loading';
import { authenticateUser } from '../../../backend/FirebaseCalls';
import { updateStudent } from '../../../backend/FirestoreCalls';
import { updateUserPassword } from '../../../backend/AuthCalls';

interface modalType {
  open: boolean;
  onClose: any;
}

const UpdateStudent = ({ open, onClose }: modalType): React.ReactElement => {
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newGrade, setNewGrade] = useState<string>('');
  const [newSchool, setNewSchool] = useState<string>('');
  const [errorStudent, setErrorStudent] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordReset = async () => {
    setLoading(true);
    if (submitted) {
      handleOnClose();
    } else if (
      newName.trim() == '' ||
      newEmail.trim() == '' ||
      newGrade.trim() == '' ||
      newSchool.trim() == ''
    ) {
      setErrorStudent('*All fields are required');
    } else {
      await updateUserPassword(newEmail, newName)
        .then(() => {
          setSubmitted(true);
          setErrorStudent('');
        })
        .catch((error) => {
          setErrorStudent(error);
          if (error.length > 50) {
            setSubmitted(true);
          }
        });
    }
    setTimeout(() => setLoading(false), 100);
  };

  const handleOnClose = (): void => {
    onClose();
    setSubmitted(false);
    setNewName('');
    setNewEmail('');
    setNewGrade('');
    setNewSchool('');
    setErrorStudent('');
    setLoading(false);
  };

  return (
    <Modal
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
              {errorStudent != ''
                ? errorStudent
                : 'Your information has been updated.'}
            </div>
          ) : (
            <>
              <h2 className={styles.title}>Reset Student</h2>
              <p className={styles.error}>{errorStudent}</p>
              <input
                required
                className={styles.textInput}
                type="password"
                placeholder="Name"
                onChange={(event) => {
                  setNewName(event.target.value);
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
                placeholder="Email"
                onChange={(event) => {
                  setNewEmail(event.target.value);
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
                placeholder="Grade"
                onChange={(event) => {
                  setNewGrade(event.target.value);
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
                placeholder="School"
                onChange={(event) => {
                  setNewSchool(event.target.value);
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
                <div>{loading ? <Loading /> : 'Reset Student'}</div>
              )}
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default UpdateStudent;