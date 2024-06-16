import { useState } from 'react';
import styles from './DeleteClassConfirmation.module.css';
import Modal from '../../../../../components/ModalWrapper/Modal';
import x from '../../../../../assets/x.svg';

interface popupModalType {
  onClose: () => void;
  open: any;
  courseId: String;
  courseName: String;
}

const DeleteClassConfirmation = ({
  onClose,
  open,
  courseId,
  courseName,
}: popupModalType): React.ReactElement => {
  const [confirmText, setConfirmText] = useState<string>('');

  function handleConfirm() {}

  return (
    <Modal
      height={280}
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      <div>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.close}
            onClick={() => {
              onClose();
            }}
          >
            <img src={x} alt="Close popup" />
          </button>
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>Delete {courseName}</h2>
          <div className={styles.contentBody}>
            To confirm, type "{courseName}" in the box below
            <input
              className={styles.inputBox}
              onChange={(event) => {
                setConfirmText(event.target.value);
              }}
            ></input>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.actionsContainer}>
            <button
              onClick={() => {
                handleConfirm();
              }}
            >
              Delete this course
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteClassConfirmation;
