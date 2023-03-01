import styles from './LoginPage.module.css';
import LoginPageForm from './LoginPageForm/LoginPageForm';

const LoginPage = () => {
  return (
    <div>
      <div className={styles.splitleft}>
        <div className={styles.leftPane}>
          <img src={require('../../assets/login-banner.png')} />
        </div>
      </div>
      <div className={styles.splitright}>
        <div className={styles.rightPane}>{<LoginPageForm />} </div>
      </div>
    </div>
  );
};

export default LoginPage;
