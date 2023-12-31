import React, { useState } from 'react';
import { Course } from '../../../../types/CourseType';
import { StudentID } from '../../../../types/StudentType';
import styles from './AddHomework.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import {
  addCourseHomework,
  addHomeworkToStudents,
} from '../../../../backend/FirestoreCalls';

interface modalType {
  open: boolean;
  onClose: any;
}

const AddHomework = (props: {
  open: boolean;
  onClose: any;
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
    if (name == '') {
      setErrorMessage('*Name is required');
    } else {
      addCourseHomework(props.course, props.courseID, {
        name: name,
        notes: note,
      })
        .then((newCourse) => {
          props.setCourse(newCourse);
          addHomeworkToStudents(
            props.courseID,
            name !== undefined ? name : '',
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
      height={430}
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
