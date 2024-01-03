import { useState } from 'react';
import styles from './DeleteStudentConfirmation.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import { deleteStudent } from '../../../../backend/FirestoreCalls';
import { type StudentID } from '../../../../types/StudentType';

interface popupModalType {
  onClose: () => void;
  open: any;
  popupName: string;
  popupEmail: string;
  removeStudentId: string;
  setReloadList: Function;
  students: Array<Partial<StudentID>>;
  setStudents: Function;
  reloadList: boolean;
  setOpenSuccess: Function;
}

const DeleteStudentConfirmation = ({
  onClose,
  open,
  popupName,
  popupEmail,
  removeStudentId,
  setReloadList,
  setStudents,
  students,
  reloadList,
  setOpenSuccess,
}: popupModalType): React.ReactElement => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  function handleConfirm() {
    if (removeStudentId != 'undefined') {
      deleteStudent(removeStudentId.valueOf())
        .then(() => {
          setStudents(
            students.filter((student) => {
              return student.id !== removeStudentId.valueOf();
            }),
          );
          setReloadList(true);
          onClose();
          setOpenSuccess(true);
        })
        .catch((err) => {
          setErrorMessage('*Student could not be Removed');
        });
    }
  }

  const handleOnClose = (): void => {
    onClose();
  };

  return (
    <Modal
      height={270}
      open={open}
      onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
        handleOnClose();
      }}
    >
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
      <div className={styles.titleContent}>
        <h2 className={styles.title}>Remove Student Confirmation</h2>
      </div>
      <p className={styles.error}>{errorMessage}</p>
      <div className={styles.content}>
        <p>
          <div className={styles.bodyText}>
            Are you sure you would like to remove?
            <div className={styles.name}>
              {popupName === 'undefined' ? '' : popupName}
            </div>
            <div className={styles.email}>
              {popupEmail === 'undefined' ? '' : <>({popupEmail})</>}
            </div>
          </div>
        </p>
      </div>
      <div className={styles.actions}>
        <div className={styles.actionsContainer}>
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
        </div>
      </div>
    </Modal>
  );
};

export default DeleteStudentConfirmation;
