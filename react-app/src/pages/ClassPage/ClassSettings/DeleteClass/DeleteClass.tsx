import { useState } from 'react';
import styles from './DeleteClass.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import DeleteClassConfirmation from './DeleteClassConfirmation/DeleteClassConfirmation';
import x from '../../../../assets/x.svg';

interface popupModalType {
  onClose: () => void;
  open: any;
  courseId: String;
  courseName: String;
}

const DeleteClass = ({
  onClose,
  open,
  courseId,
  courseName,
}: popupModalType): React.ReactElement => {
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] =
    useState<boolean>(false);

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
            Are you sure you would like to delete
            <span className={styles.courseName}> {courseName}</span>?
            <div className={styles.warning}>
              This will permanently delete the course and remove all data
              associated with the course from enrolled students
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.actionsContainer}>
            <button
              onClick={() => {
                setOpenDeleteConfirmModal(true);
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
      <DeleteClassConfirmation
        open={openDeleteConfirmModal}
        onClose={() => {
          setOpenDeleteConfirmModal(!openDeleteConfirmModal);
        }}
        courseId={courseId}
        courseName={courseName}
      />
    </Modal>
  );
};

export default DeleteClass;
