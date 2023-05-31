import { useState } from 'react';
import { authenticateUser } from '../../../backend/FirebaseCalls';
import { useAuth } from '../../../auth/AuthProvider';
import { updateUserEmail } from '../../../backend/CloudFunctionsCalls';
import { useNavigate } from 'react-router-dom';
import styles from './RemoveTeacher.module.css';
import Modal from '../../../components/ModalWrapper/Modal';
import Loading from '../../../components/LoadingScreen/Loading';
import x from '../../../assets/x.svg';

interface modalType {
  open: boolean;
  onClose: any;
  setRemoveSubmitted: (value: boolean) => void;
  setPopUpName: (value: string) => void;
  setPopUpEmail: (value: string) => void;
}

const RemoveTeacher = ({ open, onClose, setRemoveSubmitted, setPopUpEmail, setPopUpName }: modalType): React.ReactElement => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
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
      height={230}
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
              <h2 className={styles.title}>Remove Teacher</h2>
              <p className={styles.error}>{errorMessage}</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                <input
                  required
                  className={styles.textInput}
                  type="email"
                  placeholder="Teacher's Email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setRemoveSubmitted(true);
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
                setRemoveSubmitted(true);
                console.log(email);
                //TODO: using email, get teacher name from the backend to update PopUpName on the follwoing line
                //something like: name = database.getName(email)
                setPopUpName(name);
                setPopUpEmail(email);
              }}
              disabled={loading}
            >
              {submitted ? (
                'Back to Login'
              ) : (
                <div>{loading ? <Loading /> : 'Confirm'}</div>
              )}
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default RemoveTeacher;
