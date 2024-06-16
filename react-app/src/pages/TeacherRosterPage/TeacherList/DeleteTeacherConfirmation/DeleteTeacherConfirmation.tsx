import { useState } from 'react';
import { TeacherID } from '../../../../types/UserType';
import { deleteUser } from '../../../../backend/CloudFunctionsCalls';
import styles from './DeleteTeacherConfirmation.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';

interface popupModalType {
  onClose: () => void;
  open: any;
  popupName: string;
  popupEmail: string;
  removeTeacherId: string;
  setReloadList: Function;
  teachers: Array<Partial<TeacherID>>;
  setTeachers: Function;
  setOpenSuccess: Function;
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
  setOpenSuccess,
}: popupModalType): React.ReactElement => {
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

  return (
    <Modal
      height={270}
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
          <h2 className={styles.title}>Remove Teacher Confirmation</h2>
          <p className={styles.error}>{errorMessage}</p>
          <p className={styles.contentBody}>
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
            <button
              onClick={() => {
                handleConfirm();
              }}
            >
              Yes
            </button>
            <button
              onClick={() => {
                onClose();
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTeacherConfirmation;
