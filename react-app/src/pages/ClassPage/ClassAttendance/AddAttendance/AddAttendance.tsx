import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import x from '../../../../assets/x.svg';
import {
  addCourseAttendance,
  getStudentsFromList,
} from '../../../../backend/FirestoreCalls';
import Modal from '../../../../components/ModalWrapper/Modal';
import { Course } from '../../../../types/CourseType';
import { StudentID } from '../../../../types/StudentType';
import styles from './AddAttendance.module.css';

const AddAttendance = (props: {
  open: boolean;
  onClose: any;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string;
  setCourse: Function;
}): React.ReactElement => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAddAttendance = async () => {
    let date = selectedDate?.format('YYYY-MM-DD');
    let studentIdList = props.students.map((student) => student.id);
    if (date !== undefined)
      addCourseAttendance(props.courseID, studentIdList, {
        date: date,
        notes: note,
      })
        .then((courseData) => {
          props.setCourse(courseData);
          getStudentsFromList(courseData.students).then((data) => {
            props.setStudents(data);
          });
          props.setOpenAlert(true);
          handleOnClose();
        })
        .catch((e: Error) => {
          setErrorMessage(e.message + '**');
        });
  };

  const handleOnClose = (): void => {
    props.onClose();
    setNote('');
    setErrorMessage('');
  };

  return (
    <Modal
      open={props.open}
      height={425}
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
          <h1 className={styles.heading}>Add Attendance</h1>
          <p className={styles.error}>{errorMessage}</p>
          <div className={styles.datepicker}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label=""
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                slotProps={{ textField: { size: 'small' } }}
                format="MMM DD, YYYY"
                sx={{
                  backgroundColor: '#d9d9d9',
                  borderRadius: '10px',
                  width: '330px',
                  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    border: '0px',
                  }, // at page load
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                    { border: '1px solid black', borderRadius: '10px' }, // at focused state
                }}
              />
            </LocalizationProvider>
          </div>

          <textarea
            placeholder="Create note here:"
            className={styles.noteInput}
            onChange={(event) => {
              setNote(event.target.value);
            }}
          />
          <button
            className={styles.button}
            onClick={() => {
              handleAddAttendance();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddAttendance;
