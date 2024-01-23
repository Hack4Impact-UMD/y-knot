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
  addAttendanceToStudents,
  addCourseAttendance,
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
    addCourseAttendance(props.course, props.courseID, {
      date: date ? date : '',
      notes: note,
    })
      .then((newCourse) => {
        props.setCourse(newCourse);
        addAttendanceToStudents(
          props.courseID,
          date ? date : '',
          props.students,
        )
          .then((newStudentList) => {
            props.setStudents(newStudentList);
            handleOnClose();
          })
          .catch((e: Error) => {
            setErrorMessage(e.message + '**');
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
      height={440}
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
                label="Select Date"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
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
