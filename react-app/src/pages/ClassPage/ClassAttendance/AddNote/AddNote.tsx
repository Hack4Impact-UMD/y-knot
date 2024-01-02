import React, { useState, useEffect } from 'react';
import type { Course, CourseID } from '../../../../types/CourseType';
import styles from './AddNote.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import editImage from '../../../../assets/edit.svg';
import saveImage from '../../../../assets/save.svg';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {
  updateCourseAttendance,
  updateCourseHomework,
} from '../../../../backend/FirestoreCalls';
import { ToolTip } from '../../../../components/ToolTip/ToolTip';

const AddNote = (props: {
  open: boolean;
  onClose: any;
  title: string;
  selectedDate: string;
  currNote: string;
  course: Course;
  courseID: string;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): React.ReactElement => {
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [canWrite, setCanWrite] = useState<boolean>(false);
  const [datePickerDate, setDatePickerDate] = useState<Dayjs | null>();

  const handleEditNote = async () => {
    setCanWrite(false);
    if (note !== props.currNote) {
      if (props.title === 'Attendance') {
        updateCourseAttendance(props.course, props.courseID, {
          date: props.selectedDate,
          notes: note,
        })
          .then((newCourse) => {
            props.setCourse(newCourse);
          })
          .catch((e: Error) => {
            setErrorMessage(e.message + '**');
          });
      } else {
        updateCourseHomework(props.course, props.courseID, {
          name: props.selectedDate,
          notes: note,
        })
          .then((newCourse) => {
            props.setCourse(newCourse);
          })
          .catch((e: Error) => {
            setErrorMessage(e.message + '**');
          });
      }
    }
  };

  const handleOnClose = (): void => {
    props.onClose();
    setCanWrite(false);
    setErrorMessage('');
  };

  useEffect(() => {
    setNote(props.currNote);
  }, [props.selectedDate]);

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
          <h1 className={styles.heading}>{props.title} Note</h1>
          <p className={styles.error}>{errorMessage}</p>
          <div className={styles.nameContainer}>
            <div className={styles.nameInput}>{props.selectedDate}</div>
            <ToolTip title={canWrite ? 'Save' : 'Edit'} placement="top">
              <button
                className={styles.button}
                onClick={() => {
                  if (props.selectedDate !== 'No attendance currently exists') {
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
              placeholder={props.currNote}
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
