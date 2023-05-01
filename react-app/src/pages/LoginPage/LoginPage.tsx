import { logOut } from '../../backend/FirebaseCalls';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

import styles from './LoginPage.module.css';
import LoginPageForm from './LoginPageForm/LoginPageForm';
import loginBanner from '../../assets/login-banner.png';

const LoginPage = (): JSX.Element => {
  const location = useLocation();
  const directTo: string = location.state?.redir || '/courses';
  useEffect(() => {
    logOut();
  }, []);
  return (
    <div className={styles.pageContainer}>
      <div className={styles.splitleft}>
        <div className={styles.leftPane}>
          <img className={styles.banner} src={loginBanner} />
        </div>
      </div>
      <div className={styles.splitright}>
        {<LoginPageForm redirect={directTo} />}{' '}
      </div>
    </div>
  );
};

export default LoginPage;
