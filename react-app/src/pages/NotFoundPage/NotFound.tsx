import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';
import yKnotLogo from '../../assets/yknot-logo.png';

const NotFound = (): JSX.Element => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    let path = `/courses`;
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <img className={styles.yKnotLogo} src={yKnotLogo} alt="y-knot logo" />
      <div className={styles.text}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
      </div>
      <button type="button" className={styles.button} onClick={handleRedirect}>
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;
