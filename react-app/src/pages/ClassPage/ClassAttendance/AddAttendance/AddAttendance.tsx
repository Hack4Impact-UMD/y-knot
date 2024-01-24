import React, { useState } from 'react';
import styles from './AddAttendance.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Course } from '../../../../types/CourseType';
import { StudentID } from '../../../../types/StudentType';
import {
  addAttendance,
  getStudentsFromList,
  getCourse,
} from '../../../../backend/FirestoreCalls';

const AddAttendance = (props: {
  open: boolean;
  onClose: any;
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): React.ReactElement => {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAddAttendance = async () => {
    let date = selectedDate?.format('YYYY-MM-DD');
    if (date !== undefined)
      addAttendance(props.courseID, props.students, {
        date: date,
        notes: note,
      })
        .then(() => {
          getCourse(props.courseID)
            .then(async (courseData) => {
              props.setCourse(courseData);
              getStudentsFromList(courseData.students).then((data) => {
                props.setStudents(data);
              });
              handleOnClose();
            })
            .catch(() => {
              console.log('Failed to get Course Information in Class Page');
            });
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
          <h1 className={styles.heading}>Add Attendance</h1>
          <p className={styles.error}>{errorMessage}</p>
          <div className={styles.datepicker}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label=""
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                slotProps={{ textField: { size: 'small' } }}
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
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
