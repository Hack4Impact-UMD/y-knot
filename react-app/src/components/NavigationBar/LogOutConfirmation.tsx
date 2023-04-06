import { logOut } from '../../backend/FirebaseCalls';
import { useNavigate } from 'react-router';
import styles from '../../components/NavigationBar/LogOutConfirmation.module.css';
import { useState } from 'react';
import Modal from '../../components/ModalWrapper/Modal';

interface popupModalType {
  onClose: () => void;
  onConfirm: () => void;
  open: any;
}

const LogOutConfirmation = ({
  onConfirm,
  onClose,
  open,
}: popupModalType): React.ReactElement => {
  const navigate = useNavigate();

  const handleConfirm = (): void => {
    onClose();
    onConfirm();
    logOut().then(() => {
      navigate('/');
    });
  };

  const handleOnClose = (): void => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
        handleOnClose();
      }}
    >
      <>
        <div className={styles.content}>
          <h2 className={styles.title}>Log Out Confirmation</h2>
        </div>
        <div className={styles.content}>
          <p>Are you sure you're ready log out?</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.container}>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                handleConfirm();
              }}
            >
              Yes
            </button>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                handleOnClose();
              }}
            >
              No
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default LogOutConfirmation;
