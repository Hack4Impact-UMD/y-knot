import { useState } from 'react';
import Modal from '../ModalWrapper/Modal';
import styles from './ResetPassword.module.css';

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

  const handlePasswordReset = (): void => {
    // placeholder for password reset logic
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
    setOriginalPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrorPassword('');
    setLoading(false);
  };

  return (
    <Modal
      type="resetPassword"
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
              <h2 className={styles.title}>Reset Password</h2>
              <p className={styles.error}>{errorPassword}</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setLoading(true);
                  handlePasswordReset();
                }}
              >
                <input
                  className={styles.textInput}
                  type="password"
                  placeholder="Original Password"
                  onChange={({ target: { value } }) => {
                    setOriginalPassword(value);
                  }}
                />
                <input
                  className={styles.textInput}
                  type="password"
                  placeholder="New Password"
                  onChange={({ target: { value } }) => {
                    setNewPassword(value);
                  }}
                />
                <input
                  className={styles.textInput}
                  type="password"
                  placeholder="Re-enter New Password"
                  onChange={({ target: { value } }) => {
                    setConfirmNewPassword(value);
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

export default ResetPassword;
