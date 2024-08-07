import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import noteIcon from '../../../assets/note.svg';
import { updateStudentHomeworks } from '../../../backend/FirestoreCalls';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import type { Course, Homework } from '../../../types/CourseType';
import type { StudentID } from '../../../types/StudentType';
import AddHomework from './AddHomework/AddHomework';
import AddNote from './AddNote/AddNote';
import styles from './ClassHomework.module.css';
import RemoveHomework from './RemoveHomework/RemoveHomework';

const ClassHomework = (props: {
  homeworks: Array<Homework>;
  students: Array<StudentID>;
  setStudents: React.Dispatch<React.SetStateAction<Array<StudentID>>>;
  course: Course;
  courseID: string;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): JSX.Element => {
  const [selectComponentValue, setSelectComponentValue] = useState<any>({
    value: props.homeworks.slice(-1)[0]?.name.toString() ?? '',
    label: props.homeworks.slice(-1)[0]?.name.toString() ?? 'Select Homework',
  });
  const [selectedHomeworkName, setHomeworkName] = useState<string>(
    props.homeworks.slice(-1)[0]?.name.toString() ?? '',
  );
  const [selectedHomeworkNote, setHomeworkNote] = useState<string>(
    props.homeworks.slice(-1)[0]?.notes.toString() ?? '',
  );
  const [openAddHwModal, setOpenAddHwModal] = useState<boolean>(false);
  const [openRemoveHwModal, setOpenRemoveHwModal] = useState<boolean>(false);
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
    setOpenAddHwModal(!openAddHwModal);
    setAlertMessage('Homework successfully added');
  };

  const handleRemoveModal = () => {
    setOpenRemoveHwModal(!openRemoveHwModal);
    setAlertMessage('Homework successfully removed');
  };

  const handleAddNoteModal = () => {
    setOpenAddNoteModal(!openAddNoteModal);
    setAlertMessage('Homework successfully updated');
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

  const handleSave = () => {
    let studentIdList = props.students.map((student) => student.id);
    updateStudentHomeworks(
      props.courseID,
      studentIdList,
      checkedCheckboxes,
      selectedHomeworkName,
    ).then((students) => {
      props.setStudents(students);
      setOpenAlert(true);
    });
    setAlertMessage('Homework successfully saved');
  };

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

  useEffect(() => {
    let options = props.homeworks.map((assignment) => {
      return { value: assignment.name, label: assignment.name };
    });
    setDropdownOptions(options || []);
    setSelectComponentValue({
      value: props.homeworks.slice(-1)[0]?.name.toString() ?? '',
      label: props.homeworks.slice(-1)[0]?.name.toString() ?? 'Select Homework',
    });
    setHomeworkName(props.homeworks.slice(-1)[0]?.name.toString() ?? '');
    setHomeworkNote(props.homeworks.slice(-1)[0]?.notes.toString() ?? '');
  }, [props.homeworks]);

  useEffect(() => {
    let list: string[] = [];
    props.students.forEach((student) => {
      const studentCourseInfo = student.courseInformation.find(
        (c) => c.id === props.courseID,
      );
      if (studentCourseInfo) {
        const studentHomework = studentCourseInfo.homeworks.find(
          (hw) => hw.name === selectedHomeworkName,
        ); // Add student id to list if student attendance for date is true
        if (studentHomework && studentHomework.completed) {
          list.push(student.id);
        }
      }
    });
    setCheckedCheckboxes(list);
  }, [selectedHomeworkName]);

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
          placeholder="Select Homework"
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
      ) : dropdownOptions?.length == 0 ? (
        <h4 className={styles.noStudent}>No Homeworks Created</h4>
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
                <p className={styles.boxTitle}>{`${student.firstName} ${
                  student?.middleName ? student.middleName[0] + '.' : ''
                } ${student.lastName}`}</p>
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
                      ? 'Complete'
                      : 'Incomplete'}
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
      <RemoveHomework
        open={openRemoveHwModal}
        onClose={() => {
          setOpenRemoveHwModal(!openRemoveHwModal);
        }}
        setOpenAlert={setOpenAlert}
        students={props.students}
        setStudents={props.setStudents}
        course={props.course}
        setCourse={props.setCourse}
        courseID={props.courseID !== undefined ? props.courseID : ''}
      />
      <AddHomework
        open={openAddHwModal}
        onClose={() => {
          setOpenAddHwModal(!openAddHwModal);
        }}
        setOpenAlert={setOpenAlert}
        students={props.students}
        setStudents={props.setStudents}
        course={props.course}
        courseID={props.courseID !== undefined ? props.courseID : ''}
        setCourse={props.setCourse}
      />
      <AddNote
        setSelectComponentValue={setSelectComponentValue}
        setOpenAlert={setOpenAlert}
        selectedName={
          selectedHomeworkName !== ''
            ? selectedHomeworkName
            : 'No homework currently exists'
        }
        setSelectedName={setHomeworkName}
        selectedNote={selectedHomeworkNote}
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

export default ClassHomework;
