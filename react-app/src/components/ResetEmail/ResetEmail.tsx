import { useState } from 'react';
import Modal from '../ModalWrapper/Modal';
import styles from './ResetEmail.module.css';

interface modalType {
  open: boolean;
  onClose: any;
}

const ResetEmail = ({ open, onClose }: modalType): React.ReactElement => {
  const [newEmail, setNewEmail] = useState<string>('');
  const [confirmNewEmail, setConfirmNewEmail] = useState<string>('');
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordReset = (): void => {
    // placeholder for email reset logic
    if (submitted) {
      handleOnClose();
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };

  const handleOnClose = (): void => {
    onClose();
    setSubmitted(false);
    setNewEmail('');
    setConfirmNewEmail('');
    setErrorEmail('');
    setLoading(false);
  };

  return (
    <Modal
      type="resetEmail"
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
            &#x2715;
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
              <p className={styles.error}>{errorEmail}</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setLoading(true);
                  handlePasswordReset();
                }}
              >
                <input
                  className={styles.textInput}
                  type="email"
                  placeholder="New Email"
                  onChange={({ target: { value } }) => {
                    setNewEmail(value);
                  }}
                />
                <input
                  className={styles.textInput}
                  type="email"
                  placeholder="Re-enter New Email"
                  onChange={({ target: { value } }) => {
                    setConfirmNewEmail(value);
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
                setLoading(true);
                handlePasswordReset();
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
                    'Reset Password'
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
