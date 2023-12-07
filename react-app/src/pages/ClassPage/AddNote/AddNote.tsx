import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './AddNote.module.css';
import Modal from '../../../components/ModalWrapper/Modal';
import x from '../../../assets/x.svg';
import editImage from '../../../assets/edit.svg';
import saveImage from '../../../assets/save.svg';

interface modalType {
  open: boolean;
  onClose: any;
  title: string;
  selected: string;
  currNote: string;
}

const AddNote = ({
  open,
  onClose,
  title,
  selected,
  currNote,
}: modalType): React.ReactElement => {
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [canWrite, setCanWrite] = useState<boolean>(false);

  const handleEditNote = () => {
    // TODO: Save name and note
    setCanWrite(false);
    // save note contents
  };

  const handleOnClose = (): void => {
    onClose();
    setNote('');
    setCanWrite(false);
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
          <h1 className={styles.heading}>{title} Note</h1>
          <p className={styles.error}>{errorMessage}</p>
          <div className={styles.nameContainer}>
            <div className={styles.nameInput}>{selected}</div>
            <button
              className={styles.button}
              onClick={() => {
                if (canWrite) {
                  handleEditNote();
                } else {
                  setCanWrite(!canWrite);
                }
              }}
            >
              <img
                className={styles.editButton}
                src={canWrite ? saveImage : editImage}
              />
            </button>
          </div>
          <div className={styles.noteContainer}>
            <textarea
              placeholder="Create note here:"
              className={styles.noteInput}
              onChange={(event) => {
                setNote(event.target.value);
              }}
              disabled={!canWrite}
            >
              {currNote}
            </textarea>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddNote;
