import React, { useState } from 'react';
import styles from './RemoveAttendance.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import Select from 'react-select';
import x from '../../../../assets/x.svg';
import { StudentID } from '../../../../types/StudentType';
import { Course } from '../../../../types/CourseType';
import {
  removeAttendanceFromStudents,
  removeCourseAttendance,
} from '../../../../backend/FirestoreCalls';

const RemoveAttendance = (props: {
  open: boolean;
  onClose: any;
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): React.ReactElement => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);
  const handleRemoveAttendance = async () => {
    if (selectedDate == '') {
      setErrorMessage('Please select an assignment**');
    } else {
      removeCourseAttendance(props.course, props.courseID, selectedDate)
        .then((newCourse) => {
          removeAttendanceFromStudents(
            props.courseID,
            selectedDate,
            props.students,
          )
            .then((newStudentList) => {
              props.setCourse(newCourse);
              props.setStudents(newStudentList);
              handleOnClose();
              setClicked(false);
            })
            .catch((e: Error) => {
              setErrorMessage(e.message + '**');
            });
        })
        .catch((e: Error) => {
          setErrorMessage(e.message + '**');
        });
    }
  };

  const handleRemoveConfirmation = () => {
    if (selectedDate == '') {
      setErrorMessage('Please select an assignment**');
    } else {
      if (clicked) {
        //Remove was confirmed
        handleRemoveAttendance();
      } else {
        //Ask user to confirm
        setClicked(!clicked);
      }
    }
  };

  const handleOnClose = (): void => {
    props.onClose();
    setSelectedDate('');
    setErrorMessage('');
    setClicked(false);
  };

  return (
    <Modal
      open={props.open}
      height={240}
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
          <Select
            placeholder="Select Attendance"
            className={styles.dateSelection}
            onChange={(option) => {
              setErrorMessage('');
              setClicked(false);
              setSelectedDate(option?.label.toString() ?? '');
            }}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                borderColor: 'black',
              }),
            }}
            options={props.course.attendance.map((attendance) => {
              return { value: attendance.date, label: attendance.date };
            })}
          />
          <button
            className={`${styles['animated-button']} ${
              clicked ? styles.clicked : ''
            }`}
            onClick={handleRemoveConfirmation}
          >
            {clicked ? 'Confirm Remove' : 'Remove'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveAttendance;
