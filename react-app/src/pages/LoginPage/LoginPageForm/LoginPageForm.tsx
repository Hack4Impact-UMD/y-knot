import styles from './LoginPageForm.module.css';
import React, { useState } from 'react';
import eyeIcon from '../../../assets/eye.svg';
import eyeSlashIcon from '../../../assets/eye-slash.svg';
import yKnotLogo from '../../../assets/yknot-logo.png';

const LoginPageForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.formContainer}>
      <img className={styles.yknotlogo} src={yKnotLogo} alt="y-knot logo" />
      <h1 className={styles.signInText}>Sign In</h1>
      <div className={styles.inputBox}>
        <div className={styles.emailContainer}>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Email"
          ></input>
        </div>

        <div className={styles.passwordContainer}>
          <input
            className={styles.inputField}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
          ></input>

          <button
            className={styles.showPasswordButton}
            onClick={toggleShowPassword}
          >
            <img
              className={styles.showPasswordIcon}
              src={showPassword ? eyeIcon : eyeSlashIcon}
              alt="Toggle password visibility"
            />
          </button>
        </div>
      </div>
      <a className={styles.forgotPassword}>Forgot Password?</a>
      <br />
      <button className={styles.signInButton}>Sign In</button>
    </div>
  );
};

export default LoginPageForm;
