import { useState } from 'react';
import Modal from '../../../components/ModalWrapper/Modal';
import styles from './ForgotPassword.module.css';

type forgotModalType = {
  open: boolean;
  onClose: any;
};

const ForgotPassword = ({ open, onClose }: forgotModalType) => {
  const [email, setEmail] = useState<string>('');
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordReset = () => {
    // placeholder for password reset logic
    if (submitted) {
      handleOnClose();
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    onClose();
    setSubmitted(false);
    setErrorEmail('');
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={(e: React.MouseEvent<HTMLButtonElement>) => handleOnClose()}
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
              <p className={styles.error}>{errorEmail ? errorEmail : ''}</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setLoading(true);
                  handlePasswordReset();
                }}
              >
                <input
                  className={styles.email}
                  type="email"
                  placeholder="Email"
                  onChange={({ target: { value } }) => {
                    setEmail(value);
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
                'Back to Login'
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

export default ForgotPassword;
