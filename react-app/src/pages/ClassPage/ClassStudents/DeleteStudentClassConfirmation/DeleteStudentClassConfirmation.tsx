import { useState } from 'react';
import { TeacherID } from '../../../../types/UserType';
import { removeStudentCourse } from '../../../../backend/FirestoreCalls';
import styles from './DeleteStudentClassConfirmation.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';

interface popupModalType {
  onClose: () => void;
  open: any;
  popupName: String;
  popupEmail: String;
  removeStudentId: String;
  courseId: String;
  courseName: String;
  setReloadList: Function;
  students: Array<Partial<TeacherID>>;
  setStudents: Function;
  setClassStudents: Function;
  setRemoveSuccess: Function;
}

const DeleteStudentClassConfirmation = ({
  onClose,
  open,
  popupName,
  popupEmail,
  removeStudentId,
  setReloadList,
  setStudents,
  students,
  setClassStudents,
  courseId,
  courseName,
  setRemoveSuccess,
}: popupModalType): React.ReactElement => {
  const [submittedError, setSubmittedError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  function handleConfirm() {
    if (removeStudentId != 'undefined') {
      removeStudentCourse(removeStudentId.valueOf(), courseId.valueOf())
        .then(() => {
          setStudents(
            students.filter((student) => {
              return student.id !== removeStudentId.valueOf();
            }),
          );
          setClassStudents(
            students.filter((student) => {
              return student.id !== removeStudentId.valueOf();
            }),
          );
          onClose();
          setReloadList(true);
          setRemoveSuccess(true);
        })
        .catch((err) => {
          setErrorMessage('*Student could not be removed');
        });
    }
  }

  const handleOnClose = (): void => {
    setSubmittedError(false);
    onClose();
  };

  return (
    <Modal
      height={280}
      open={open}
      onClose={() => {
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
          <h2 className={styles.title}>Remove Teacher</h2>
          <p className={styles.error}>{errorMessage}</p>
          <div className={styles.contentBody}>
            {submittedError ? (
              'Log out failed. Try again later.'
            ) : (
              <>
                Are you sure you would like to remove from
                <span className={styles.courseName}> {courseName}</span>?
                <div className={styles.name}>
                  {popupName === 'undefined' ? '' : popupName}
                </div>
                <div className={styles.email}>
                  {popupEmail === 'undefined' ? '' : <>({popupEmail})</>}
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.actionsContainer}>
            {submittedError ? (
              <></>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleConfirm();
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => {
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

export default DeleteStudentClassConfirmation;
