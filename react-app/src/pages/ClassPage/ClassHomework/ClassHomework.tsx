import { useState } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import type { StudentID } from '../../../types/StudentType';
import type { Course, Homework } from '../../../types/CourseType';
import Select from 'react-select';
import styles from './ClassHomework.module.css';
import noteIcon from '../../../assets/note.svg';
import CheckboxWithLabel from '../CheckboxWithLabel/CheckboxWithLabel';
import AddHomework from './AddHomework/AddHomework';
import RemoveHomework from './RemoveHomework/RemoveHomework';
import AddNote from './AddNote/AddNote';

const ClassHomework = (props: {
  homeworks: Array<Homework>;
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string | undefined;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): JSX.Element => {
  const [selectComponentValue, setSelectComponentValue] = useState<any>({
    value: props.homeworks.slice(-1)[0].name.toString() ?? '',
    label: props.homeworks.slice(-1)[0].name.toString() ?? 'Assignment',
  });
  const [selectedHomeworkName, setHomeworkName] = useState<string>(
    props.homeworks !== undefined && props.homeworks.length > 0
      ? props.homeworks.slice(-1)[0].name.toString()
      : '',
  );
  const [selectedHomeworkNote, setHomeworkNote] = useState<string>(
    props.homeworks !== undefined && props.homeworks.length > 0
      ? props.homeworks.slice(-1)[0].notes.toString()
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
      props.homeworks.forEach((hw) => {
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
          value={selectComponentValue}
          className={styles.selection}
          onChange={(option) => {
            setSelectComponentValue(option);
            parseHomework(option?.label.toString() ?? '');
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
          options={props.homeworks.map((assignment) => {
            return { value: assignment.name, label: assignment.name };
          })}
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
        courseID={props.courseID !== undefined ? props.courseID : ''}
        setCourse={props.setCourse}
      />
      <AddNote
        setSelectComponentValue={setSelectComponentValue}
        selectedName={
          selectedHomeworkName !== ''
            ? selectedHomeworkName
            : 'No homework currently exists'
        }
        setSelectedName={setHomeworkName}
        selectedNote={
          selectedHomeworkNote !== ''
            ? selectedHomeworkNote
            : 'No assignment selected'
        }
        setSelectedNote={setHomeworkNote}
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

export default ClassHomework;
