import styles from './LoginPage.module.css';
import LoginPageForm from './LoginPageForm/LoginPageForm';
import loginBanner from '../../assets/login-banner.png'

const LoginPage = () => {
  return (
    <div>
      <div className={styles.splitleft}>
        <div className={styles.leftPane}>
          <img className={styles.banner} src={loginBanner} />
        </div>
      </div>
      <div className={styles.splitright}>
        <div className={styles.rightPane}>{<LoginPageForm />} </div>
      </div>
    </div>
  );
};

export default LoginPage;
