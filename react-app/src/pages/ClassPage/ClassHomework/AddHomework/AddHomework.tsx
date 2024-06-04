import React, { useState, useEffect } from 'react';
import { Course } from '../../../../types/CourseType';
import { StudentID } from '../../../../types/StudentType';
import styles from './AddHomework.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import {
  addCourseHomework,
  getStudentsFromList,
  getCourse,
} from '../../../../backend/FirestoreCalls';

const AddHomework = (props: {
  open: boolean;
  onClose: any;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): React.ReactElement => {
  const [name, setName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAddHomework = () => {
    let studentIdList = props.students.map((student) => student.id);
    if (name == '') {
      setErrorMessage('*Name is required');
    } else {
      addCourseHomework(props.courseID, studentIdList, {
        name: name,
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
    }
  };

  const handleOnClose = (): void => {
    props.onClose();
    setName('');
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
          <h1 className={styles.heading}>Add Homework</h1>
          <p className={styles.error}>{errorMessage}</p>
          <input
            type="text"
            placeholder="Name:"
            className={styles.nameInput}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
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
