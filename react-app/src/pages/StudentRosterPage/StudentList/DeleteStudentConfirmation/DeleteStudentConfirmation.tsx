import { useState } from 'react';
import styles from './DeleteStudentConfirmation.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import { deleteStudent } from '../../../../backend/FirestoreCalls';
import { type StudentID } from '../../../../types/StudentType';

interface popupModalType {
  onClose: () => void;
  open: any;
  popupName: String;
  popupEmail: String;
  removeStudentId: String;
  setReloadList: Function;
  students: Array<Partial<StudentID>>;
  setStudents: Function;
  reloadList: Boolean;
  setOpenSuccess: Function;
  setOpenFailure: Function;
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
  setOpenFailure,
}: popupModalType): React.ReactElement => {
  const [submittedError, setSubmittedError] = useState<boolean>(false);

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
          setOpenSuccess(true);
        })
        .catch((err) => {
          setOpenFailure(true);
        });
    }
    onClose();
  }

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
          <h2 className={styles.title}>Remove Student Confirmation</h2>
          <p>
            {submittedError ? (
              'Log out failed. Try again later.'
            ) : (
              <div className={styles.bodyText}>
                Are you sure you would like to remove?
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

export default DeleteStudentConfirmation;