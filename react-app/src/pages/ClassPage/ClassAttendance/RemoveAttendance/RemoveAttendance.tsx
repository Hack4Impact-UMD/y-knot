import React, { useState } from 'react';
import styles from './RemoveAttendance.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';

interface modalType {
  open: boolean;
  onClose: any;
}

const RemoveAttendance = ({ open, onClose }: modalType): React.ReactElement => {
  const [attendanceList, setAttendanceList] = useState<string[]>([
    '1/1/2023',
    '1/8/2023',
    '1/16/2023',
  ]);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleRemoveAttendance = () => {
    if (selectedDate == '') {
      setErrorMessage('*Please select an assignment');
    } else {
      // TODO: Confirmation popup(?) & remove homework
      handleOnClose();
    }
  };

  const handleOnClose = (): void => {
    onClose();
    setSelectedDate('');
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
          <h1 className={styles.heading}>Remove Attendance</h1>
          <p className={styles.error}>{errorMessage}</p>
          <select
            className={styles.selection}
            defaultValue=""
            onChange={(event) => {
              setSelectedDate(event.target.value);
            }}
          >
            <option value="" disabled hidden>
              Select Attendance:
            </option>
            {attendanceList.map(function (date) {
              return <option value={date}>{date}</option>;
            })}
          </select>
          <button
            className={styles.button}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              handleRemoveAttendance();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveAttendance;
