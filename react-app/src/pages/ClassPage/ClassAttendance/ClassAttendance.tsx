import { useState, useEffect } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import Select from 'react-select';
import styles from './ClassAttendance.module.css';
import noteIcon from '../../../assets/note.svg';
import CheckboxWithLabel from '../CheckboxWithLabel/CheckboxWithLabel';
import AddNote from './AddNote/AddNote';
import RemoveAttendance from './RemoveAttendance/RemoveAttendance';
import AddAttendance from './AddAttendance/AddAttendance';
import type { StudentID } from '../../../types/StudentType';
import type { Course } from '../../../types/CourseType';

interface attendanceObj {
  date: String;
  notes: String;
}

const ClassAttendance = (props: {
  attendance: Array<attendanceObj>;
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string | undefined;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): JSX.Element => {
  const [selectComponentValue, setSelectComponentValue] = useState<any>({
    value: props.attendance.slice(-1)[0].date.toString() ?? '',
    label: props.attendance.slice(-1)[0].date.toString() ?? 'Date',
  });
  const [selectedAttDate, setSelectedDate] = useState<string>(
    props.attendance !== undefined && props.attendance.length > 0
      ? props.attendance.slice(-1)[0].date.toString()
      : '',
  );
  const [selectedAttNote, setSelectedNote] = useState<string>(
    props.attendance !== undefined && props.attendance.length > 0
      ? props.attendance.slice(-1)[0].notes.toString()
      : '',
  );
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [openAddHwModal, setOpenAddHwModal] = useState<boolean>(false);
  const [openRemoveHwModal, setOpenRemoveHwModal] = useState<boolean>(false);
  const [openAddNoteModal, setOpenAddNoteModal] = useState<boolean>(false);

  const handleSelectAllChange = () => {
    setSelectAllChecked(true);
  };

  const handleAddModal = () => {
    setOpenAddHwModal(!openAddHwModal);
  };

  const handleRemoveModal = () => {
    setOpenRemoveHwModal(!openRemoveHwModal);
  };

  const handleAddNoteModal = () => {
    setOpenAddNoteModal(!openAddNoteModal);
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
              borderColor: 'black',
            }),
          }}
          options={props.attendance.map((attendance) => {
            return { value: attendance.date, label: attendance.date };
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
                <CheckboxWithLabel
                  key={student.firstName}
                  checkedText="Present"
                  uncheckedText="Absent"
                  isChecked={selectAllChecked}
                  setIsChecked={setSelectAllChecked}
                />
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
        <button className={styles.bottomButton}>Save</button>
      </div>
      <RemoveAttendance
        open={openRemoveHwModal}
        onClose={() => {
          setOpenRemoveHwModal(!openRemoveHwModal);
        }}
      />
      <AddAttendance
        open={openAddHwModal}
        onClose={() => {
          setOpenAddHwModal(!openAddHwModal);
        }}
        students={props.students}
        setStudents={props.setStudents}
        course={props.course}
        setCourse={props.setCourse}
        courseID={props.courseID !== undefined ? props.courseID : ''}
      />
      <AddNote
        setSelectComponentValue={setSelectComponentValue}
        selectedDate={
          selectedAttDate !== ''
            ? selectedAttDate
            : 'No attendance currently exists'
        }
        setSelectedDate={setSelectedDate}
        selectedNote={
          selectedAttNote !== '' ? selectedAttNote : 'No date selected'
        }
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
    </div>
  );
};

export default ClassAttendance;
