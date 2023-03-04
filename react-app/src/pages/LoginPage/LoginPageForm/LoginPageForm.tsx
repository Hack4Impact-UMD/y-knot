import styles from './LoginPageForm.module.css';

const LoginPageForm = () => {
  return (
    <div>
      <img
        className={styles.yknotlogo}
        src={require('../../../assets/yknot-logo.png')}
        alt="y-knot logo"
      />
      <h1>Sign In</h1>
      <div className={styles.inputBox}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Email"
        ></input>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Password"
        ></input>
      </div>
      <a className={styles.forgotPassword}>Forgot Password?</a>
      <br />
      <button className={styles.signInButton}>Sign In</button>
    </div>
  );
};

export default LoginPageForm;
