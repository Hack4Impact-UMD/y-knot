import React, { useState, useEffect } from 'react';
import type { Course } from '../../../../types/CourseType';
import { StudentID } from '../../../../types/StudentType';
import { DateTime } from 'luxon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {
  updateCourseAttendanceDetails,
  getStudentsFromList,
} from '../../../../backend/FirestoreCalls';
import { ToolTip } from '../../../../components/ToolTip/ToolTip';
import styles from './AddNote.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import editImage from '../../../../assets/edit.svg';
import saveImage from '../../../../assets/save.svg';

const AddNote = (props: {
  open: boolean;
  onClose: any;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectComponentValue: React.Dispatch<React.SetStateAction<any>>;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  selectedNote: string;
  setSelectedNote: React.Dispatch<React.SetStateAction<string>>;
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): React.ReactElement => {
  const [datePickerDate, setDatePickerDate] = useState<Dayjs | null>(
    props.selectedDate === '' ? dayjs() : dayjs(props.selectedDate),
  );
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [canWrite, setCanWrite] = useState<boolean>(false);

  const handleEditNote = async () => {
    setErrorMessage('');
    setCanWrite(false);
    const newDate = datePickerDate?.format('YYYY-MM-DD');
    let studentIdList = props.students.map((student) => student.id);
    if (note !== props.selectedNote || newDate !== props.selectedDate) {
      updateCourseAttendanceDetails(
        props.courseID,
        studentIdList,
        { date: props.selectedDate, notes: props.selectedNote },
        {
          date: newDate ? newDate : '',
          notes: note,
        },
      )
        .then((courseData) => {
          props.setCourse(courseData);
          props.setSelectedDate(newDate ? newDate : '');
          props.setSelectedNote(note);
          props.setSelectComponentValue({
            value: newDate ?? '',
            label: newDate ?? '',
          });
          getStudentsFromList(courseData.students).then((data) => {
            props.setStudents(data);
          });
          props.setOpenAlert(true);
          handleOnClose();
        })
        .catch((e: Error) => {
          setNote(props.selectedNote);
          setErrorMessage(e.message + '**');
        });
    }
  };

  const handleOnClose = (): void => {
    props.onClose();
    setCanWrite(false);
    setNote(props.selectedNote);
    setErrorMessage('');
  };

  useEffect(() => {
    setDatePickerDate(dayjs(props.selectedDate));
    setNote(props.selectedNote);
  }, [props.selectedDate]);

  return (
    <Modal
      open={props.open}
      height={375}
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
          <h1 className={styles.heading}>Attendance Note</h1>
          <p className={styles.error}>{errorMessage}</p>
          <div className={styles.nameContainer}>
            {canWrite ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label=""
                  format="MMM DD, YYYY"
                  slotProps={{ textField: { size: 'small' } }}
                  value={
                    props.selectedDate === ''
                      ? dayjs()
                      : dayjs(props.selectedDate)
                  }
                  onChange={(newDate) => setDatePickerDate(newDate)}
                  sx={{
                    backgroundColor: '#d9d9d9',
                    borderRadius: '10px',
                    width: '290px',
                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
                      {
                        border: '0px',
                      }, // at page load
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                      { border: '1px solid black', borderRadius: '10px' }, // at focused state
                  }}
                />
              </LocalizationProvider>
            ) : (
              <div className={styles.nameInput}>
                {DateTime.fromISO(props.selectedDate).toFormat('LLL dd, yyyy')}
              </div>
            )}
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
