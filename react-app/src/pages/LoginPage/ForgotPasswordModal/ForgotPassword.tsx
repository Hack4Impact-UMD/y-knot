import { useState } from 'react';
import Modal from '../../../components/ModalWrapper/Modal';
import styles from './ForgotPassword.module.css';
import { sendResetEmail } from '../../../backend/FirebaseCalls';

interface forgotModalType {
  open: boolean;
  onClose: any;
}

const ForgotPassword = ({
  open,
  onClose,
}: forgotModalType): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordReset = (): void => {
    // placeholder for password reset logic
    if (submitted) {
      handleOnClose();
    } else {
      // validate email input
      if (/^[\w]+@[\w]+(\.\w+)+$/.test(email)) {
        // send reset email
        sendResetEmail(email);

        setSubmitted(true);
      } else if (!email) {
        setErrorEmail('*This field is required');
      } else {
        setErrorEmail('*Invalid email address');
      }
      setLoading(false);
    }
  };

  const handleOnClose = (): void => {
    onClose();
    setSubmitted(false);
    setErrorEmail('');
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
            type="button"
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
              <p className={styles.error}>{errorEmail}</p>

              <input
                autoFocus
                className={styles.email}
                type="email"
                placeholder="Email"
                required
                onChange={({ target: { value } }) => {
                  setEmail(value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    setLoading(true);
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
              type="button"
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
