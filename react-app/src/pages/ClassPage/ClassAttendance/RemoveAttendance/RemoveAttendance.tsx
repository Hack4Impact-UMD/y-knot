import React, { useState } from 'react';
import { StudentID } from '../../../../types/StudentType';
import { Course } from '../../../../types/CourseType';
import {
  getStudentsFromList,
  removeCourseAttendance,
} from '../../../../backend/FirestoreCalls';
import { DateTime } from 'luxon';
import styles from './RemoveAttendance.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import Select from 'react-select';
import x from '../../../../assets/x.svg';

const RemoveAttendance = (props: {
  open: boolean;
  onClose: any;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
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
    let studentIdList = props.students.map((student) => student.id);
    if (selectedDate == '') {
      setErrorMessage('Please select an assignment**');
    } else {
      removeCourseAttendance(props.courseID, studentIdList, selectedDate)
        .then((courseData) => {
          props.setCourse(courseData);
          getStudentsFromList(courseData.students).then((data) => {
            props.setStudents(data);
          });
          handleOnClose();
          props.setOpenAlert(true);
          setClicked(false);
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
          <h1 className={styles.heading}>Remove Attendance</h1>
          <p className={styles.error}>{errorMessage}</p>
          <Select
            placeholder="Select Attendance"
            className={styles.dateSelection}
            onChange={(option) => {
              setErrorMessage('');
              setClicked(false);
              setSelectedDate(option?.value.toString() ?? '');
            }}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                height: 'fit-content',
                borderColor: 'black',
                boxShadow: 'none',
                '&:focus-within': {
                  border: '1.5px solid black',
                },
                '&:hover': {
                  border: '1px solid black',
                },
              }),
            }}
            options={props.course.attendance.map((attendance) => {
              return {
                value: attendance.date,
                label: DateTime.fromISO(attendance.date).toFormat(
                  'LLL dd, yyyy',
                ),
              };
            })}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: 'var(--color-pastel-orange)',
                primary50: 'var(--color-bright-orange)',
                primary: 'var(--color-orange)',
              },
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
