import { useState } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import Select from 'react-select';
import styles from './ClassAttendance.module.css';
import noteIcon from '../../../assets/note.svg';
import CheckboxWithLabel from '../CheckboxWithLabel/CheckboxWithLabel';
import AddNote from '../AddNote/AddNote';
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
  const [selectedAttDate, setDate] = useState<string>(
    'Please select an attendance date',
  );
  const [selectedAttNote, setNote] = useState<string>('');
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
          setDate(date);
          setNote(att.notes);
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
          placeholder="Date"
          className={styles.dateSelection}
          onChange={(option) => {
            parseAttendance(option?.label.toString() ?? '');
          }}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              borderColor: 'black',
              width: '150px',
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
        title="Attendance"
        currNote={selectedAttNote}
        selected={selectedAttDate}
        open={openAddNoteModal}
        onClose={() => {
          setOpenAddNoteModal(!openAddNoteModal);
        }}
        course={props.course}
        courseID={props.courseID ?? ''}
        setCourse={props.setCourse}
      />
    </div>
  );
};

export default ClassAttendance;
