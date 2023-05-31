import { useState } from 'react';
import styles from './RemoveTeacherError.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
//import { deleteTeacher } from '../../../../backend/FirestoreCalls';

interface popupModalType {
  onClose: () => void;
  open: any;
  popupEmail: String;
}

const RemoveTeacherError = ({
  onClose,
  open,
  popupEmail,
}: popupModalType): React.ReactElement => {
  const handleOnClose = (): void => {
    onClose();
  };

  return (
    <Modal
      height={260}
      open={open}
      onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
        handleOnClose();
      }}
    >
      <div>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.close}
            onClick={() => {
              handleOnClose();
            }}
          >
            <img src={x} alt="Close popup" />
          </button>
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>Teacher Removal Error</h2>
          <p>
            <div className={styles.bodyText}>
              No teacher with the email 
              <div className={styles.email}>
                {popupEmail === 'undefined' ? '' : <>({popupEmail})</>}
              </div>
              found
            </div>
          </p>
        </div>
        <div className={styles.actions}>
          <div className={styles.actionsContainer}>
              <>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    handleOnClose();
                  }}
                >
                  Try Again
                </button>
              </>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveTeacherError;