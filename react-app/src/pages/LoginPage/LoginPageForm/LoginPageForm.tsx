import styles from './LoginPageForm.module.css';
import React, { useState } from 'react';

const LoginPageForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className = {styles.formContainer}>
      <img
        className={styles.yknotlogo}
        src={require('../../../assets/yknot-logo.png')}
        alt="y-knot logo"
      />
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

          <button className={styles.showPasswordButton} onClick={toggleShowPassword}>
            {showPassword ? "Hide" : "Show"}
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
