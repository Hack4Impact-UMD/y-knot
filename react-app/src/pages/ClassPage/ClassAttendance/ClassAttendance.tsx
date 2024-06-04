import { useState, useEffect } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import type { StudentID } from '../../../types/StudentType';
import type { Course } from '../../../types/CourseType';
import { Snackbar, Alert } from '@mui/material';
import { updateStudentAttendance } from '../../../backend/FirestoreCalls';
import Select from 'react-select';
import styles from './ClassAttendance.module.css';
import noteIcon from '../../../assets/note.svg';
import AddNote from './AddNote/AddNote';
import RemoveAttendance from './RemoveAttendance/RemoveAttendance';
import AddAttendance from './AddAttendance/AddAttendance';

const ClassAttendance = (props: {
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): JSX.Element => {
  const [selectComponentValue, setSelectComponentValue] = useState<any>({
    value: props.course.attendance.slice(-1)[0]?.date.toString() ?? '',
    label: props.course.attendance.slice(-1)[0]?.date.toString() ?? 'Date',
  });
  const [selectedDate, setSelectedDate] = useState<string>(
    props.course.attendance !== undefined && props.course.attendance.length > 0
      ? props.course.attendance.slice(-1)[0].date.toString()
      : '',
  );
  const [selectedAttNote, setSelectedNote] = useState<string>(
    props.course.attendance !== undefined && props.course.attendance.length > 0
      ? props.course.attendance.slice(-1)[0].notes.toString()
      : '',
  );
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openRemoveModal, setOpenRemoveModal] = useState<boolean>(false);
  const [openAddNoteModal, setOpenAddNoteModal] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [dropdownOptions, setDropdownOptions] = useState<any>();
  const [checkedCheckboxes, setCheckedCheckboxes] = useState<string[]>([]);

  const handleSelectAllChange = () => {
    let studentIdList = props.students.map((student) => student.id);
    setCheckedCheckboxes(studentIdList);
  };

  const handleAddModal = () => {
    setOpenAddModal(!openAddModal);
    setAlertMessage('Attendance successfully added');
  };

  const handleRemoveModal = () => {
    setOpenRemoveModal(!openRemoveModal);
    setAlertMessage('Attendance successfully removed');
  };

  const handleAddNoteModal = () => {
    setOpenAddNoteModal(!openAddNoteModal);
    setAlertMessage('Attendance successfully updated');
  };

  const handleSave = () => {
    let studentIdList = props.students.map((student) => student.id);
    updateStudentAttendance(
      props.courseID,
      studentIdList,
      checkedCheckboxes,
      selectedDate,
    ).then((students) => {
      props.setStudents(students);
      setOpenAlert(true);
    });
    setAlertMessage('Attendance successfully saved');
  };

  const parseAttendance = (date: string): void => {
    if (date.length > 0) {
      props.course.attendance.forEach((att) => {
        if (att.date === date) {
          setSelectedDate(date);
          setSelectedNote(att.notes);
        }
      });
    }
  };

  useEffect(() => {
    let options = props.course.attendance.map((attendance) => {
      return { value: attendance.date, label: attendance.date };
    });
    setDropdownOptions(options);
    setSelectComponentValue({
      value: props.course.attendance.slice(-1)[0]?.date.toString() ?? '',
      label: props.course.attendance.slice(-1)[0]?.date.toString() ?? 'Date',
    });
    setSelectedDate(
      props.course.attendance.slice(-1)[0]?.date.toString() ?? '',
    );
    setSelectedNote(
      props.course.attendance.slice(-1)[0]?.notes.toString() ?? '',
    );
  }, [props.course]);

  useEffect(() => {
    let list: string[] = [];
    props.students.forEach((student) => {
      const studentAttendance = student.courseInformation
        .find((c) => c.id === props.courseID)
        ?.attendance.find((att) => att.date === selectedDate);
      // Add student id to list if student attendance for date is true
      if (studentAttendance && studentAttendance.attended) {
        list.push(student.id);
      }
    });
    setCheckedCheckboxes(list);
  }, [selectedDate]);

  function handleCheckboxChange(studentID: string) {
    // Add student to checkedCheckboxes if it's not already; Remove if it is
    if (checkedCheckboxes.includes(studentID)) {
      setCheckedCheckboxes(
        checkedCheckboxes.filter((student) => {
          return student !== studentID;
        }),
      );
    } else {
      setCheckedCheckboxes([...checkedCheckboxes, studentID]);
    }
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topLevel}>
        <ToolTip title="Attendance Note" placement="top">
          <button className={styles.noteButton} onClick={handleAddNoteModal}>
            <img className={styles.noteIcon} src={noteIcon}></img>
          </button>
        </ToolTip>
        <Select
          value={selectComponentValue}
          className={styles.dateSelection}
          onChange={(option) => {
            setSelectComponentValue(option);
            parseAttendance(option?.label.toString() ?? '');
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
          options={dropdownOptions}
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
      </div>
      {props.students.length === 0 ? (
        <h4 className={styles.noStudent}>No Students Currently in Roster</h4>
      ) : (
        <div className={styles.inputs}>
          {props.students.map(function (student, i) {
            const roundTop = i === 0 ? styles.roundTop : '';
            const roundBottom =
              i === props.students.length - 1 ? styles.roundBottom : '';

            return (
              <div
                className={`${styles.box} ${roundTop} ${roundBottom}`}
                key={student.firstName}
              >
                <p
                  className={styles.boxTitle}
                >{`${student.firstName} ${student.lastName}`}</p>
                <div className={styles.icons}>
                  <label className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      checked={checkedCheckboxes.some(
                        (checkedCheckbox) => checkedCheckbox === student.id,
                      )}
                      onChange={() => handleCheckboxChange(student.id)}
                    ></input>
                    <span className={styles.checkmark}></span>
                  </label>
                  <label className={styles.statusLabel}>
                    {checkedCheckboxes.some(
                      (checkedCheckbox) => checkedCheckbox === student.id,
                    )
                      ? 'Present'
                      : 'Absent'}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className={styles.bottomLevel}>
        <button className={styles.bottomButton} onClick={handleAddModal}>
          Add
        </button>
        <button className={styles.bottomButton} onClick={handleRemoveModal}>
          Remove
        </button>
        <button className={styles.bottomButton} onClick={handleSelectAllChange}>
          Select All
        </button>
        <button className={styles.bottomButton} onClick={handleSave}>
          Save
        </button>
      </div>
      <RemoveAttendance
        open={openRemoveModal}
        onClose={() => {
          setOpenRemoveModal(!openRemoveModal);
        }}
        setOpenAlert={setOpenAlert}
        students={props.students}
        setStudents={props.setStudents}
        course={props.course}
        setCourse={props.setCourse}
        courseID={props.courseID !== undefined ? props.courseID : ''}
      />
      <AddAttendance
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(!openAddModal);
        }}
        setOpenAlert={setOpenAlert}
        students={props.students}
        setStudents={props.setStudents}
        course={props.course}
        setCourse={props.setCourse}
        courseID={props.courseID !== undefined ? props.courseID : ''}
      />
      <AddNote
        setOpenAlert={setOpenAlert}
        setSelectComponentValue={setSelectComponentValue}
        selectedDate={
          selectedDate !== '' ? selectedDate : 'No attendance currently exists'
        }
        setSelectedDate={setSelectedDate}
        selectedNote={selectedAttNote}
        setSelectedNote={setSelectedNote}
        open={openAddNoteModal}
        onClose={() => {
          setOpenAddNoteModal(!openAddNoteModal);
        }}
        students={props.students}
        setStudents={props.setStudents}
        course={props.course}
        courseID={props.courseID ?? ''}
        setCourse={props.setCourse}
      />
      <Snackbar
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ClassAttendance;
