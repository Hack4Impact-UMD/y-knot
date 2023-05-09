import { useState } from 'react';
import styles from './AddTeacherConfirmation.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import { addStudent } from '../../../../backend/FirestoreCalls';

interface popupModalType {
  onClose: () => void;
  open: any;
  popupName: String;
  popupEmail: String;
  addTeacherId: String;
  setReloadList: Function;
}

const AddTeacherConfirmation = ({
  onClose,
  open,
  popupName,
  popupEmail,
  addTeacherId,
  setReloadList,
}: popupModalType): React.ReactElement => {
  const [submittedError, setSubmittedError] = useState<boolean>(false);

  const handleConfirm = (): void => {
    if (addTeacherId != 'undefined') {
      // TODO: MAKE ADDUSER BACKEND FUNCTION
      // addStudent(addTeacherId.valueOf());
      setReloadList(true);
    }
    onClose();
  };

  const handleOnClose = (): void => {
    setSubmittedError(false);
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
          <h2 className={styles.title}>Add Teacher Confirmation</h2>
          <p>
            {submittedError ? (
              'Log out failed. Try again later.'
            ) : (
              <div className={styles.bodyText}>
                Are you sure you would like to add?
                <div className={styles.name}>
                  {popupName === 'undefined' ? '' : popupName}
                </div>
                <div className={styles.email}>
                  {popupEmail === 'undefined' ? '' : <>({popupEmail})</>}
                </div>
              </div>
            )}
          </p>
        </div>
        <div className={styles.actions}>
          <div className={styles.actionsContainer}>
            {submittedError ? (
              <></>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddTeacherConfirmation;