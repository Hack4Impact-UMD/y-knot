import styles from './LoginPage.css'
import loginbanner from '../../assets/login-banner.png'
import LoginPageForm from './LoginPageForm/LoginPageForm'

const LoginPage = () => {
    return <div className={styles.splitScreen}>
        <div className={styles.leftPane}>{loginbanner}</div>
        <div className={styles.rightPane}>{<LoginPageForm/>}</div>
    </div>;
};

export default LoginPage;