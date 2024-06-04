import { useState, useEffect } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import type { StudentID } from '../../../types/StudentType';
import type { Course } from '../../../types/CourseType';
import { Snackbar, Alert } from '@mui/material';
import Select from 'react-select';
import styles from './ClassAttendance.module.css';
import noteIcon from '../../../assets/note.svg';
import CheckboxWithLabel from '../CheckboxWithLabel/CheckboxWithLabel';
import AddNote from './AddNote/AddNote';
import RemoveAttendance from './RemoveAttendance/RemoveAttendance';
import AddAttendance from './AddAttendance/AddAttendance';

const ClassAttendance = (props: {
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string | undefined;
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
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openRemoveModal, setOpenRemoveModal] = useState<boolean>(false);
  const [openAddNoteModal, setOpenAddNoteModal] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [dropdownOptions, setDropdownOptions] = useState<any>();
  const [studentList, setStudentList] = useState<any[]>([]);

  const handleSelectAllChange = () => {
    setSelectAllChecked(true);
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
    let list = props.students.map(function (student, i) {
      const roundTop = i === 0 ? styles.roundTop : '';
      const roundBottom =
        i === props.students.length - 1 ? styles.roundBottom : '';
      const studentAttendance = student.courseInformation
        .find((c) => c.id === props.courseID)
        ?.attendance.find((att) => att.date === selectedDate);
      console.log(studentAttendance?.attended);

      return (
        <div
          className={`${styles.box} ${roundTop} ${roundBottom}`}
          key={student.firstName}
        >
          <p
            className={styles.boxTitle}
          >{`${student.firstName} ${student.lastName}`}</p>
          <CheckboxWithLabel
            key={student.firstName}
            checkedText="Present"
            uncheckedText="Absent"
            isChecked={
              selectAllChecked ||
              (studentAttendance ? studentAttendance!.attended : false)
            }
            setIsChecked={setSelectAllChecked}
          />
        </div>
      );
    });
    setStudentList(list);
  }, [selectedDate]);

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
          {studentList}
          {/* {props.students.map(function (student, i) {
            const roundTop = i === 0 ? styles.roundTop : '';
            const roundBottom =
              i === props.students.length - 1 ? styles.roundBottom : '';
            const studentAttendance = 
            student.courseInformation
              .find((c) => c.id === props.courseID)
              ?.attendance.find((att) => att.date === selectedDate);

            return (
              <div
                className={`${styles.box} ${roundTop} ${roundBottom}`}
                key={student.firstName}
              >
                <p
                  className={styles.boxTitle}
                >{`${student.firstName} ${student.lastName}`}</p>
                <CheckboxWithLabel
                  key={student.firstName}
                  checkedText="Present"
                  uncheckedText="Absent"
                  isChecked={
                    selectAllChecked ||
                    (studentAttendance ? studentAttendance!.attended : false)
                  }
                  setIsChecked={setSelectAllChecked}
                />
              </div>
            );
          })} */}
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
        <button className={styles.bottomButton}>Save</button>
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
