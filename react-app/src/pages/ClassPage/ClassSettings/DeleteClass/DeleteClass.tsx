import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCourse } from '../../../../backend/FirestoreCalls';
import styles from './DeleteClass.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';

interface popupModalType {
  onClose: () => void;
  open: any;
  courseId: string;
  courseName: string;
}

const DeleteClass = ({
  onClose,
  open,
  courseId,
  courseName,
}: popupModalType): React.ReactElement => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [confirmAgain, setConfirmAgain] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const navigate = useNavigate();
  let timer: NodeJS.Timeout | null = null;

  const handleCheck = (e: any) => {
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      e.target.value === courseName
        ? setDisableButton(false)
        : setDisableButton(true);
    }, 500);
  };

  function handleConfirm() {
    deleteCourse(courseId)
      .then(() => {
        navigate('/courses');
      })
      .catch((err) => {
        setErrorMessage('*Course could not be deleted');
      });
  }

  return (
    <Modal
      height={280}
      open={open}
      onClose={() => {
        onClose();
        setConfirmAgain(false);
      }}
    >
      <div>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.close}
            onClick={() => {
              onClose();
              setConfirmAgain(false);
            }}
          >
            <img src={x} alt="Close popup" />
          </button>
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>Delete Course</h2>
          {!confirmAgain ? (
            <></>
          ) : (
            <p className={styles.error}>{errorMessage}</p>
          )}
          <div className={styles.contentBody}>
            {!confirmAgain ? (
              <>
                Are you sure you would like to delete
                <span className={styles.courseName}> {courseName}</span>?
                <div className={styles.warning}>
                  This will permanently delete the course and remove all data
                  associated with the course from enrolled students
                </div>
              </>
            ) : (
              <>
                To confirm, type "{courseName}" in the box below
                <div>
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      handleCheck(event);
                    }}
                  ></input>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.actionsContainer}>
            {!confirmAgain ? (
              <>
                <button
                  className={styles.yesNoButton}
                  onClick={() => {
                    setConfirmAgain(true);
                  }}
                >
                  Yes
                </button>
                <button
                  className={styles.yesNoButton}
                  onClick={() => {
                    onClose();
                    setConfirmAgain(false);
                  }}
                >
                  No
                </button>
              </>
            ) : (
              <button
                className={styles.confirmButton}
                onClick={() => {
                  handleConfirm();
                }}
                disabled={disableButton}
              >
                Delete This Course
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteClass;
