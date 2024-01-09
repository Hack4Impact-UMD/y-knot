import React, { useState, useEffect } from 'react';
import type { Course, CourseID } from '../../../../types/CourseType';
import { StudentID } from '../../../../types/StudentType';
import styles from './AddNote.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import editImage from '../../../../assets/edit.svg';
import saveImage from '../../../../assets/save.svg';
import {
  updateCourseHomework,
  updateHomeworkStudents,
} from '../../../../backend/FirestoreCalls';
import { ToolTip } from '../../../../components/ToolTip/ToolTip';

const AddNote = (props: {
  open: boolean;
  onClose: any;
  selectedName: string;
  setSelectedName: React.Dispatch<React.SetStateAction<string>>;
  selectedNote: string;
  setSelectedNote: React.Dispatch<React.SetStateAction<string>>;
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): React.ReactElement => {
  const [inputName, setInputName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [canWrite, setCanWrite] = useState<boolean>(false);

  const handleEditNote = async () => {
    setErrorMessage('');
    setCanWrite(false);
    if (inputName == '') {
      setErrorMessage('*Name is required');
    } else if (
      note !== props.selectedNote ||
      inputName !== props.selectedName
    ) {
      updateCourseHomework(
        props.course,
        props.courseID,
        { name: props.selectedName, notes: props.selectedNote },
        {
          name: inputName,
          notes: note,
        },
      )
        .then((newCourse) => {
          updateHomeworkStudents(
            props.courseID,
            props.selectedName,
            inputName,
            props.students,
          )
            .then((newStudentList) => {
              props.setSelectedName(inputName);
              props.setSelectedNote(note);
              props.setStudents(newStudentList);
              props.setCourse(newCourse);
            })
            .catch((e: Error) => {
              setNote(props.selectedNote);
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
    setCanWrite(false);
    setInputName(props.selectedName);
    setNote(props.selectedNote);
    setErrorMessage('');
  };

  useEffect(() => {
    setInputName(props.selectedName);
    setNote(props.selectedNote);
  }, [props.selectedName]);

  return (
    <Modal
      open={props.open}
      height={375}
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
          <h1 className={styles.heading}>Homework Note</h1>
          <p className={styles.error}>{errorMessage}</p>
          <div className={styles.nameContainer}>
            <textarea
              placeholder={props.selectedName}
              className={styles.nameInput}
              onChange={(event) => {
                setInputName(event.target.value);
              }}
              disabled={!canWrite}
              value={inputName}
            />
            <ToolTip title={canWrite ? 'Save' : 'Edit'} placement="top">
              <button
                className={styles.button}
                onClick={() => {
                  if (props.selectedName !== 'No homework currently exists') {
                    if (canWrite) {
                      handleEditNote();
                    } else {
                      setCanWrite(!canWrite);
                    }
                  }
                }}
              >
                <img
                  className={styles.editButton}
                  src={canWrite ? saveImage : editImage}
                />
              </button>
            </ToolTip>
          </div>
          <div className={styles.noteContainer}>
            <textarea
              placeholder={props.selectedNote}
              className={styles.noteInput}
              onChange={(event) => {
                setNote(event.target.value);
              }}
              disabled={!canWrite}
              value={note}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddNote;
