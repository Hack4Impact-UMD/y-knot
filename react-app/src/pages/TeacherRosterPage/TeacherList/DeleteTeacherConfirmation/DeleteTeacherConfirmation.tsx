import { useState } from 'react';
import { TeacherID } from '../../../../types/UserType';
import { deleteUser } from '../../../../backend/CloudFunctionsCalls';
import { removeAllTeacherCourses } from '../../../../backend/FirestoreCalls';
import styles from './DeleteTeacherConfirmation.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import Loading from '../../../../components/LoadingScreen/Loading';
import x from '../../../../assets/x.svg';

interface popupModalType {
  onClose: () => void;
  open: any;
  popupName: string;
  popupEmail: string;
  removeTeacherAuthId: string;
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
  removeTeacherAuthId,
  removeTeacherId,
  setReloadList,
  setTeachers,
  teachers,
  setOpenSuccess,
}: popupModalType): React.ReactElement => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [canClose, setCanClose] = useState<boolean>(true);

  function handleConfirm() {
    if (removeTeacherId != 'undefined') {
      setLoading(true);
      setCanClose(false);
      removeAllTeacherCourses(removeTeacherId)
        .then(() =>
          deleteUser(removeTeacherAuthId.valueOf())
            .then(() => {
              setTeachers(
                teachers.filter((teacher) => {
                  return teacher.auth_id !== removeTeacherAuthId.valueOf();
                }),
              );
              handleOnClose();
              setReloadList(true);
              setOpenSuccess(true);
            })
            .catch(() => {
              setErrorMessage('*Teacher could not be removed');
            })
            .finally(() => {
              setCanClose(true);
            }),
        )
        .catch(() => {
          setErrorMessage('*Teacher could not be removed');
        })
        .finally(() => setCanClose(true));
    }
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }

  function handleOnClose() {
    if (canClose) {
      onClose();
      setLoading(false);
    }
  }

  return (
    <Modal
      height={270}
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
              disabled={loading}
            >
              {loading ? <Loading /> : 'Yes'}
            </button>
            <button
              onClick={() => {
                handleOnClose();
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
