import React, { useState } from 'react';
import styles from './RemoveHomework.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';

interface modalType {
  open: boolean;
  onClose: any;
}

const RemoveHomework = ({ open, onClose }: modalType): React.ReactElement => {
  const [homeworkList, setHomeworkList] = useState<string[]>([
    'Introduction',
    'Exam 1',
    'Exam 2',
    'Homework 1',
  ]);
  const [selectedHwk, setSelectedHwk] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleRemoveHomework = () => {
    if (selectedHwk == '') {
      setErrorMessage('*Please select an assignment');
    } else {
      // TODO: Confirmation popup(?) & remove homework
      handleOnClose();
    }
  };

  const handleOnClose = (): void => {
    onClose();
    setSelectedHwk('');
    setErrorMessage('');
  };

  return (
    <Modal
      open={open}
      height={235}
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
          <h1 className={styles.heading}>Remove Homework</h1>
          <p className={styles.error}>{errorMessage}</p>
          <select
            className={styles.selection}
            defaultValue=""
            onChange={(event) => setSelectedHwk(event.target.value)}
          >
            <option value="" disabled hidden>
              Select Homework:
            </option>
            {homeworkList.map(function (homework) {
              return <option value={homework}>{homework}</option>;
            })}
          </select>
          <button
            className={styles.button}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              handleRemoveHomework();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveHomework;
