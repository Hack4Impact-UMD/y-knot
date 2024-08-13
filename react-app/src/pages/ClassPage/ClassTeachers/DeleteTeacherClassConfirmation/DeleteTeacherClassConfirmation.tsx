import { useState } from 'react';
import { TeacherID } from '../../../../types/UserType';
import { removeTeacherCourse } from '../../../../backend/FirestoreCalls';
import styles from './DeleteTeacherClassConfirmation.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';

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
  setClassTeachers: Function;
  setRemoveSuccess: Function;
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
  setClassTeachers,
  courseId,
  courseName,
  setRemoveSuccess,
}: popupModalType): React.ReactElement => {
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
          setClassTeachers(
            teachers.filter((teacher) => {
              return teacher.id !== removeTeacherId.valueOf();
            }),
          );
          onClose();
          setReloadList(true);
          setRemoveSuccess(true);
        })
        .catch((err) => {
          setErrorMessage('*Teacher could not be removed');
        });
    }
  }

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
          <h2 className={styles.title}>Remove Teacher</h2>
          <p className={styles.error}>{errorMessage}</p>
          <div className={styles.contentBody}>
            Are you sure you would like to remove from
            <span className={styles.courseName}> {courseName}</span>?
            <div className={styles.name}>
              {popupName === 'undefined' ? '' : popupName}
            </div>
            <div className={styles.email}>
              {popupEmail === 'undefined' ? '' : <>({popupEmail})</>}
            </div>
          </div>
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

export default DeleteTeacherClassConfirmation;
