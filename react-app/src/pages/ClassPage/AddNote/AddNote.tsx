import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './AddNote.module.css';
import Modal from '../../../components/ModalWrapper/Modal';
import x from '../../../assets/x.svg';

interface modalType {
  open: boolean;
  onClose: any;
  title: string;
  selected: string;
  allValues: string[];
}

const AddNote = ({
  open,
  onClose,
  title,
  selected,
  allValues,
}: modalType): React.ReactElement => {
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedValue, setValue] = useState<string>(selected);
  useEffect(() => {
    setValue(selected);
  }, [selected]);

  const handleAddNote = () => {
    let message = '';
    if (selectedValue == '') {
      message += '*Select an ' + title + ' value';
    } else if (note == '') {
      message += '*Note is empty';
    } else {
      // TODO: Save name and note
      handleOnClose();
    }
    setErrorMessage(message);
  };

  const handleOnClose = (): void => {
    onClose();
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
          <h1 className={styles.heading}>{title} Note</h1>
          <p className={styles.error}>{errorMessage}</p>
          <div className={styles.nameInput}>
            <Select
              defaultValue={
                selectedValue
                  ? { value: selectedValue, label: selectedValue }
                  : { value: 'placeholder', label: 'Choose ' + title }
              }
              className={styles.nameInput}
              onChange={(input) => setValue(input!.value)}
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  width: '100%',
                  borderColor: 'black',
                  borderRadius: '10px',
                }),
                option: (provided) => ({
                  ...provided,
                  color: 'black',
                }),
              }}
              options={allValues.map((assignment) => {
                return { value: assignment, label: assignment };
              })}
            />
          </div>
          <div className={styles.noteContainer}>
            <textarea
              placeholder="Create note here:"
              className={styles.noteInput}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
          <button
            className={styles.button}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              handleAddNote();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddNote;
