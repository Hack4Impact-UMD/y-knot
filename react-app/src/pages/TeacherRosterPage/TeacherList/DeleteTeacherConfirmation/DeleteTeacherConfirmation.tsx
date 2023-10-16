import { useState } from 'react';
import styles from './DeleteTeacherConfirmation.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import { deleteStudent } from '../../../../backend/FirestoreCalls';
import { type StudentID } from '../../../../types/StudentType';
import { TeacherID } from '../../../../types/UserType';
import { deleteUser } from '../../../../backend/CloudFunctionsCalls';

interface popupModalType {
  onClose: () => void;
  open: any;
  popupName: String;
  popupEmail: String;
  removeTeacherId: String;
  setReloadList: Function;
  teachers: Array<Partial<TeacherID>>;
  setTeachers: Function;
  reloadList: Boolean;
  setOpenSuccess: Function;
  setOpenFailure: Function;
}

const DeleteTeacherConfirmation = ({
  onClose,
  open,
  popupName,
  popupEmail,
  removeTeacherId,
  setReloadList,
  setTeachers,
  teachers,
  reloadList,
  setOpenSuccess,
  setOpenFailure,
}: popupModalType): React.ReactElement => {
  const [submittedError, setSubmittedError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  function handleConfirm() {
    if (removeTeacherId != 'undefined') {
      deleteUser(removeTeacherId.valueOf())
        .then(() => {
          setTeachers(
            teachers.filter((teacher) => {
              return teacher.auth_id !== removeTeacherId.valueOf();
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
      height={270}
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
          <h2 className={styles.title}>Remove Teacher Confirmation</h2>
          <p className={styles.error}>{errorMessage}</p>
          <p className={styles.contentBody}>
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

export default DeleteTeacherConfirmation;
