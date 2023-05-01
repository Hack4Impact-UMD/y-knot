import styles from './LoginPageForm.module.css';
import { useState } from 'react';
import eyeIcon from '../../../assets/eye.svg';
import eyeSlashIcon from '../../../assets/eye-slash.svg';
import yKnotLogo from '../../../assets/yknot-logo.png';
import ForgotPassword from '../ForgotPasswordModal/ForgotPassword';
import { authenticateUser } from '../../../backend/FirebaseCalls';
import { useNavigate } from 'react-router';
import type { AuthError } from 'firebase/auth';
import Loading from '../../../components/LoadingScreen/Loading';

const LoginPageForm = (): JSX.Element => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [openForgotModal, setOpenForgotModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failureMessage, setFailureMessage] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowLoading(true);
    if (email && password) {
      authenticateUser(email, password)
        .then(async (user) => {
          setShowLoading(false);
          setFailureMessage('');
          navigate('/courses');
        })
        .catch(async (error) => {
          setShowLoading(false);
          const code = (error as AuthError).code;
          if (code === 'auth/too-many-requests') {
            setFailureMessage(
              '*Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.',
            );
          } else {
            setFailureMessage('*Incorrect email address or password');
          }
        });
    } else {
      setFailureMessage('*Incorrect email address or password');
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSignIn}>
      <img className={styles.yknotlogo} src={yKnotLogo} alt="y-knot logo" />
      <div className={styles.titleContainer}>
        {showLoading ? (
          <Loading></Loading>
        ) : (
          <h1 className={styles.signInText}>Sign In</h1>
        )}
      </div>
      <div className={styles.inputBox}>
        <div className={styles.emailContainer}>
          <input
            value={email}
            className={styles.inputField}
            type="text"
            placeholder="Email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          ></input>
        </div>

        <div className={styles.passwordContainer}>
          <div className={styles.passwordInputContainer}>
            <input
              value={password}
              className={styles.inputField}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            ></input>
          </div>
          <button
            type="button"
            className={styles.showPasswordButton}
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            <img
              className={styles.showPasswordIcon}
              src={showPassword ? eyeIcon : eyeSlashIcon}
              alt="Toggle password visibility"
            />
          </button>
        </div>
      </div>
      <button
        type="button"
        className={styles.forgotPassword}
        onClick={() => {
          setOpenForgotModal(!openForgotModal);
        }}
      >
        Forgot Password?
      </button>
      <ForgotPassword
        open={openForgotModal}
        onClose={() => {
          setOpenForgotModal(!openForgotModal);
        }}
      />
      <br />
      <button type="submit" className={styles.signInButton}>
        Sign In
      </button>
      <p className={'' ? styles.hideFailureMsg : styles.showFailureMessage}>
        {failureMessage}
      </p>
    </form>
  );
};

export default LoginPageForm;
