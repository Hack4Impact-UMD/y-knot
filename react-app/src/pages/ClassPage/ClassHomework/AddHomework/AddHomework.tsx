import React, { useState } from 'react';
import styles from './AddHomework.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';

interface modalType {
  open: boolean;
  onClose: any;
}

const AddHomework = ({ open, onClose }: modalType): React.ReactElement => {
  const [name, setName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAddHomework = () => {
    if (name == '') {
      setErrorMessage('*Name is required');
    } else {
      // TODO: Save name and note
      handleOnClose();
    }
  };

  const handleOnClose = (): void => {
    onClose();
    setName('');
    setNote('');
    setErrorMessage('');
  };

  return (
    <Modal
      open={open}
      height={410}
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
          <h1 className={styles.heading}>Add Homework</h1>
          <p className={styles.error}>{errorMessage}</p>
          <input
            type="text"
            placeholder="Name:"
            className={styles.nameInput}
            onChange={(event) => setName(event.target.value)}
          />
          <textarea
            placeholder="Create note here:"
            className={styles.noteInput}
            onChange={(event) => setNote(event.target.value)}
          />
          <button
            className={styles.button}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              handleAddHomework();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddHomework;
