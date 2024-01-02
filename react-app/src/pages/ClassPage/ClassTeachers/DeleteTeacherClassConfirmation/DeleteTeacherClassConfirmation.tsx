import { useState } from 'react';
import styles from './DeleteTeacherClassConfirmation.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import { TeacherID } from '../../../../types/UserType';
import { removeTeacherCourse } from '../../../../backend/FirestoreCalls';

interface popupModalType {
  onClose: () => void;
  open: any;
  popupName: String;
  popupEmail: String;
  removeTeacherId: String;
  courseId: String;
  courseName: String;
  setReloadList: Function;
  teachers: Array<Partial<TeacherID>>;
  setTeachers: Function;
  reloadList: Boolean;
  setOpenSuccess: Function;
  setOpenFailure: Function;
}

const DeleteTeacherClassConfirmation = ({
  onClose,
  open,
  popupName,
  popupEmail,
  removeTeacherId,
  setReloadList,
  setTeachers,
  teachers,
  courseId,
  courseName,
  setOpenSuccess,
  setOpenFailure,
}: popupModalType): React.ReactElement => {
  const [submittedError, setSubmittedError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  function handleConfirm() {
    if (removeTeacherId != 'undefined') {
      removeTeacherCourse(removeTeacherId.valueOf(), courseId.valueOf())
        .then(() => {
          setTeachers(
            teachers.filter((teacher) => {
              return teacher.id !== removeTeacherId.valueOf();
            }),
          );
          onClose();
          setReloadList(true);
          setOpenSuccess(true);
        })
        .catch((err) => {
          setErrorMessage('*Teacher could not be removed');
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

export default DeleteTeacherClassConfirmation;
