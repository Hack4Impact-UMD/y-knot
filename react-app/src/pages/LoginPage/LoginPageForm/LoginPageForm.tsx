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
        <input type="text" placeholder="Email"></input>
        <input type="text" placeholder="Password"></input>
      </div>
      <p>Forgot Password?</p>
      <button>Sign In</button>
    </div>
  );
};

export default LoginPageForm;
