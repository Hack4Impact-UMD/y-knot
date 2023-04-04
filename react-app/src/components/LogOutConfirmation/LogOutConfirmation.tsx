import styles from './LogOutConfirmation.module.css';
import { logOut } from '../../backend/FirebaseCalls';

interface LogOutConfirmationProps {
  onClose: () => void;
  onConfirm: () => void;
}

const LogOutConfirmation: React.FC<LogOutConfirmationProps> = ({
  onClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onClose();
    onConfirm();
    logOut().then(() => {
      window.location.href = '/';
    });
  };

  const handleReject = () => {
    onClose();
  };

  return (
    <div className={styles.logOutConfirmation}>
      <div className={styles.popup}>
        <h1>Log Out Confirmation</h1>
        <div className={styles.question}>
          <p>Are you sure you're ready to log out?</p>
        </div>

        <div>
          <button onClick={handleConfirm}>
            <p>Yes</p>
          </button>
          <button onClick={handleReject}>
            <p>No</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogOutConfirmation;
