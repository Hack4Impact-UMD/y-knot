import { useState } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import type { StudentID } from '../../../types/StudentType';
import type { Course } from '../../../types/CourseType';
import Select from 'react-select';
import styles from './ClassHomework.module.css';
import noteIcon from '../../../assets/note.svg';
import CheckboxWithLabel from '../CheckboxWithLabel/CheckboxWithLabel';
import AddHomework from './AddHomework/AddHomework';
import RemoveHomework from './RemoveHomework/RemoveHomework';
import AddNote from './AddNote/AddNote';

interface homeworkObj {
  name: String;
  notes: String;
}

const ClassHomework = (props: {
  homework: Array<homeworkObj>;
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string | undefined;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): JSX.Element => {
  const [selectedHomeworkName, setHomeworkName] = useState<string>(
    props.homework !== undefined && props.homework.length > 0
      ? props.homework.slice(-1)[0].name.toString()
      : '',
  );
  const [selectedHomeworkNote, setHomeworkNote] = useState<string>(
    props.homework !== undefined && props.homework.length > 0
      ? props.homework.slice(-1)[0].notes.toString()
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

  const parseHomework = (name: string): void => {
    if (name.length > 0) {
      props.course.homeworks.forEach((hw) => {
        if (hw.name == name) {
          setHomeworkName(name);
          setHomeworkNote(hw.notes);
        }
      });
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topLevel}>
        <ToolTip title="Homework Note" placement="top">
          <button className={styles.noteButton} onClick={handleAddNoteModal}>
            <img className={styles.noteIcon} src={noteIcon}></img>
          </button>
        </ToolTip>
        <Select
          placeholder={
            selectedHomeworkName !== '' ? selectedHomeworkName : 'Assignement'
          }
          className={styles.selection}
          onChange={(option) => {
            parseHomework(option?.label.toString() ?? '');
          }}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              borderColor: 'black',
            }),
          }}
          options={props.homework.map((assignment) => {
            return { value: assignment.name, label: assignment.name };
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
                key={student.id}
              >
                <p
                  className={styles.boxTitle}
                >{`${student.firstName} ${student.lastName}`}</p>
                <CheckboxWithLabel
                  key={`${student.firstName} ${student.lastName}`}
                  checkedText="Complete"
                  uncheckedText="Incomplete"
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
      <RemoveHomework
        open={openRemoveHwModal}
        onClose={() => {
          setOpenRemoveHwModal(!openRemoveHwModal);
        }}
      />
      <AddHomework
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
        title="Homework"
        selectedHomework={
          selectedHomeworkName !== ''
            ? selectedHomeworkName
            : 'No homework currently exists'
        }
        currNote={
          selectedHomeworkNote !== ''
            ? selectedHomeworkNote
            : 'No assignment selected'
        }
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

export default ClassHomework;
