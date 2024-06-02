import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Snackbar, Alert } from '@mui/material';
import Select, { type OptionProps } from 'react-select';
import { getAllStudents } from '../../../backend/FirestoreCalls';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import { StudentID } from '../../../types/StudentType';
import styles from './ManualStudentMerge.module.css';
import styled from '@emotion/styled';
import eyeIcon from '../../../assets/view.svg';
import Loading from '../../../components/LoadingScreen/Loading';

/* Styling for dropdown options */
const InputOption: React.FC<OptionProps<any, true, any>> = ({
  isSelected,
  innerProps,
  children,
}) => {
  const { onMouseDown, onMouseUp, onMouseLeave, ...restInnerProps } =
    innerProps || {};

  const selectionStyle = {
    alignItems: 'center',
    backgroundColor: isSelected ? 'var(--color-orange)' : 'transparent',
    color: isSelected ? 'white' : 'black',
    display: 'flex ',
    fontSize: 'large',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderRadius: '5px',
    margin: '5px',
  };

  const checkboxStyle = {
    marginRight: '10px',
    marginLeft: '10px',
    fontSize: 'large',
    width: '20px',
    height: '20px',
    color: isSelected ? 'white' : 'transparent',
    backgroundColor: 'var(--color-orange)',
    accentColor: 'var(--color-orange)',
    opacity: '50%',
  };

  return (
    <div
      {...restInnerProps}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={selectionStyle}
    >
      <input
        type="checkbox"
        checked={isSelected}
        style={checkboxStyle}
        onChange={() => {}}
      />
      {children}
    </div>
  );
};

/* Styling for roster checkboxes */
const BpIcon = styled('span')(() => ({
  borderRadius: 3,
  height: '30px',
  width: '30px',
  borderStyle: 'solid',
  borderColor: 'var(--color-grey)',
  backgroundColor: 'var(--color-grey)',
  marginLeft: '20px',
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: 'var(--color-orange)',
  borderColor: 'var(--color-orange)',
  '&::before': {
    display: 'block',
    height: '30px',
    width: '30px',
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  '&::after': {
    borderColor: 'var(--color-orange)',
  },
});

const ManualStudentMerge = (): JSX.Element => {
  const [students, setStudents] = useState<Array<Partial<StudentID>>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [studentList, setStudentList] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedStudentA, setSelectedStudentA] = useState<string | null>(null);
  const [selectedStudentAId, setSelectedStudentAId] = useState<any>();
  const [selectedStudentB, setSelectedStudentB] = useState<string | null>(null);
  const [selectedStudentBId, setSelectedStudentBId] = useState<any>();
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>('');
  const [selectedStudentADropdown, setSelectedStudentADropdown] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedStudentBDropdown, setSelectedStudentBDropdown] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [studentAaddress, setStudentAAddress] = useState<string>('');
  const [studentAEmail, setStudentAEmail] = useState<string>('');
  const [studentBaddress, setStudentBAddress] = useState<string>('');
  const [studentBEmail, setStudentBEmail] = useState<string>('');
  const navigate = useNavigate();

  /* Styling for dropdown-select main input container */
  const selectBoxStyle = {
    control: (provided: any, state: any) => ({
      ...provided,
      height: '60px',
      overflow: 'hidden',
      marginBottom: 'auto',
      boxShadow: 'none',
      borderColor: state.isFocused ? 'black' : 'black',
      '&:hover': {},
      borderWidth: '1px',
      width: '100%',
      fontSize: '1.2rem',
      borderRadius: '15px',
      backgroundColor: 'var(--color-white)',
    }),
    menu: (provided: any) => ({
      ...provided,
      marginTop: 0,
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      backgroundColor: 'var(--color-white)',
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: 'black',
    }),
  };

  /* Styling for the checkboxes in dropdown-select when student is selected. */
  const selectBoxStyleDark = {
    control: (provided: any, state: any) => ({
      ...provided,
      height: '60px',
      overflow: 'hidden',
      marginBottom: 'auto',
      marginTop: '0',
      boxShadow: 'none',
      borderColor: state.isFocused ? 'black' : 'black',
      '&:hover': {},
      borderWidth: '1px',
      width: '100%',
      fontSize: '1.2rem',
      fontWeight: 'bolder',
      borderRadius: '15px',
      backgroundColor: 'var(--color-grey)',
    }),
    menu: (provided: any) => ({
      ...provided,
      marginTop: 0,
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      backgroundColor: 'var(--color-white)',
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: 'black',
    }),
  };

  /* Get list of students */
  useEffect(() => {
    setLoading(true);

    getAllStudents()
      .then((allStudents) => {
        const partialStudents: Array<Partial<StudentID>> = [];
        allStudents.forEach((currStudent) => {
          const newStudent: Partial<StudentID> = {
            id: currStudent.id,
            firstName: currStudent.firstName,
            middleName: currStudent.middleName,
            lastName: currStudent.lastName,
            email: currStudent.email,
            addrFirstLine: currStudent.addrFirstLine,
          };
          partialStudents.push(newStudent);
        });
        setStudents(partialStudents);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* Using the list of students, display their name and checkboxes. This is essentially for the student roster containing the checkboxes. */
  useEffect(() => {
    const list = students.reduce((result: any[], student, i) => {
      const firstName = student.firstName ? student.firstName + ' ' : '';
      const middleName = student.middleName ? student.middleName + ' ' : '';
      const lastName = student.lastName ? student.lastName + ' ' : '';
      const fullName = firstName + middleName + lastName;
      const id = student.id?.toString();
      if (fullName.toLowerCase().includes(search.toLowerCase())) {
        result.push(
          <div
            key={i}
            className={
              result.length === 0 ? styles.studentBoxTop : styles.studentBox
            }
          >
            <p className={styles.name}>{fullName}</p>
            <div className={styles.icons}>
              <ToolTip title="View Profile" placement="top">
                <button className={`${styles.button} ${styles.profileIcon}`}>
                  <img
                    src={eyeIcon}
                    alt="View Profile"
                    onClick={() => {
                      navigate(`/students/${id}`);
                    }}
                  />
                </button>
              </ToolTip>

              <Checkbox
                sx={{
                  '&:hover': { bgcolor: 'transparent' },
                }}
                disableRipple
                color="default"
                checked={selectedStudents.includes(id || '')}
                checkedIcon={<BpCheckedIcon />}
                icon={<BpIcon />}
                onChange={() => handleCheck(student)}
              />
            </div>
          </div>,
        );
      }
      return result;
    }, []);
    setStudentList(list);
  }, [search, students, selectedStudents]);

  const resetStudentA = () => {
    setSelectedStudentADropdown(null);
    setSelectedStudentA(null);
    setSelectedStudentAId(undefined);
    setStudentAAddress('');
    setStudentAEmail('');
  };

  const resetStudentB = () => {
    setSelectedStudentBDropdown(null);
    setSelectedStudentB(null);
    setSelectedStudentBId(undefined);
    setStudentBAddress('');
    setStudentBEmail('');
  };

  /* List of students to display in the dropdown-select */
  const selectOptions = students.map((student) => ({
    value: JSON.stringify(student),
    label: `${student.firstName} ${student.lastName}`,
  }));

  /* Handle selecting a student A.
  If the student exists, then update Student A's name and info and add id to the set of selected students.
  If the student is already selected, throw a Snackbar alert. */
  const handleStudentADropdownChange = async (selectedOption: any) => {
    let newSelectedStudents = [...selectedStudents];
    if (selectedOption) {
      const student = JSON.parse(selectedOption.value);
      const studentId = student.id;
      const studentName = selectedOption.label;

      if (newSelectedStudents.includes(studentId)) {
        setAlertMsg('Student is already selected');
        setAlertOpen(true);
      } else {
        // Remove pre-existing student A
        if (selectedStudentADropdown) {
          newSelectedStudents = newSelectedStudents.filter(
            (id) => id !== selectedStudentAId,
          );
        }

        // Set new student A
        setSelectedStudentADropdown({
          value: selectedOption.value,
          label: studentName,
        });

        setSelectedStudentA(studentName);
        setSelectedStudentAId(studentId);
        student.addrFirstLine
          ? setStudentAAddress(student.addrFirstLine)
          : setStudentAAddress('N/A');
        student.email
          ? setStudentAEmail(student.email)
          : setStudentAEmail('N/A');

        newSelectedStudents.push(studentId);
      }
    } else {
      newSelectedStudents = newSelectedStudents.filter(
        (id) => id !== selectedStudentAId,
      );
      resetStudentA();
    }
    setSelectedStudents(newSelectedStudents);
  };

  /* Handle selecting a student B.
  If the student exists, then update Student B's name and info and add id to the set of selected students.
  If the student is already selected, throw a Snackbar alert. */
  const handleStudentBDropdownChange = async (selectedOption: any) => {
    let newSelectedStudents = [...selectedStudents];
    if (selectedOption) {
      const student = JSON.parse(selectedOption.value);
      const studentId = student.id;
      const studentName = selectedOption.label;

      if (newSelectedStudents.includes(studentId)) {
        setAlertMsg('Student is already selected');
        setAlertOpen(true);
      } else {
        // Remove pre-existing student B
        if (selectedStudentBDropdown) {
          newSelectedStudents = newSelectedStudents.filter(
            (id) => id !== selectedStudentBId,
          );
        }

        // Set new student B
        setSelectedStudentBDropdown({
          value: selectedOption.value,
          label: studentName,
        });

        setSelectedStudentB(studentName);
        setSelectedStudentBId(studentId);
        student.addrFirstLine
          ? setStudentBAddress(student.addrFirstLine)
          : setStudentBAddress('N/A');
        student.email
          ? setStudentBEmail(student.email)
          : setStudentBEmail('N/A');

        newSelectedStudents.push(studentId);
      }
    } else {
      newSelectedStudents = newSelectedStudents.filter(
        (id) => id !== selectedStudentBId,
      );
      resetStudentB();
    }
    setSelectedStudents(newSelectedStudents);
  };

  /* If there are at least 2 students selected (via checking the selectedStudents set), then open the SnackBar to notify the user that
  no more than 2 students can be selected. */
  useEffect(() => {
    if (selectedStudents.length > 2) {
      setAlertMsg('Only 2 students can be selected at a time');
      setAlertOpen(true);
    }
  }, [selectedStudents]);

  /* If the student selected is the first student selected, then it is student A. Otherwise, it is student B, unless student B is already filled. 
     If we select a student that already exists, we are essentially deselecting it (based on being A or B). */
  const handleCheck = async (student: any) => {
    let newSelectedStudents = [...selectedStudents];
    let studentId = student.id;
    let studentName = student.firstName + ' ' + student.lastName;

    if (newSelectedStudents.includes(studentId)) {
      newSelectedStudents = newSelectedStudents.filter(
        (id) => id !== studentId,
      );
      if (selectedStudentAId === studentId) {
        resetStudentA();
      } else if (selectedStudentBId === studentId) {
        resetStudentB();
      }
    } else if (
      newSelectedStudents.length < 2 &&
      !selectedStudents.includes(studentId)
    ) {
      if (!selectedStudentADropdown) {
        setSelectedStudentA(studentName);
        setSelectedStudentAId(studentId);
        setSelectedStudentADropdown({
          value: studentId,
          label: studentName,
        });
        student.addrFirstLine
          ? setStudentAAddress(student.addrFirstLine)
          : setStudentAAddress('N/A');
        student.email
          ? setStudentAEmail(student.email)
          : setStudentAEmail('N/A');
      } else if (!selectedStudentBDropdown) {
        setSelectedStudentB(studentName);
        setSelectedStudentBId(studentId);
        setSelectedStudentBDropdown({
          value: JSON.stringify(student),
          label: studentName,
        });
        student.addrFirstLine
          ? setStudentBAddress(student.addrFirstLine)
          : setStudentBAddress('N/A');
        student.email
          ? setStudentBEmail(student.email)
          : setStudentBEmail('N/A');
      }
      newSelectedStudents.push(studentId);
    } else if (newSelectedStudents.length >= 2) {
      /* Open snackbar if there are =2 students selected and the user tried to select 1 more student */
      setAlertMsg('Only 2 students can be selected at a time');
      setAlertOpen(true);
    }

    setSelectedStudents(newSelectedStudents);
  };

  /* Unchecks/deselects all students selected in roster and dropdown-select. Triggered when "Clear All" button is clicked */
  const handleUncheck = () => {
    setSelectedStudents([]);
    resetStudentA();
    resetStudentB();
  };

  const handleMerge = () => {
    if (selectedStudents.length !== 2) {
      setAlertMsg('Please select 2 students to merge');
      setAlertOpen(true);
    } else {
      // Navigate to final merge page
      const studentA = selectedStudentADropdown
        ? JSON.parse(selectedStudentADropdown.value)
        : undefined;
      const studentB = selectedStudentBDropdown
        ? JSON.parse(selectedStudentBDropdown.value)
        : undefined;
      navigate('/students/mergestudent', {
        state: {
          studentA: studentA,
          studentB: studentB,
        },
      });
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        // Used to center the loading spinner
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : (
        <>
          <div className={styles.mainMerge}>
            <div className={styles.mergeContainer}>
              <h2 className={styles.studentAContainer}>Student A</h2>
              <h2 className={styles.studentBContainer}>Student B</h2>
              <div className={styles.actionInputA}>
                <Select
                  value={selectedStudentADropdown}
                  isClearable
                  onChange={handleStudentADropdownChange}
                  options={selectOptions}
                  components={{
                    Option: InputOption,
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  placeholder="Begin typing..."
                  styles={
                    selectedStudentA ? selectBoxStyleDark : selectBoxStyle
                  }
                />
              </div>
              <div className={styles.actionInputB}>
                <Select
                  value={selectedStudentBDropdown}
                  isClearable
                  onChange={handleStudentBDropdownChange}
                  options={selectOptions}
                  components={{
                    Option: InputOption,
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  placeholder="Begin typing..."
                  styles={
                    selectedStudentB ? selectBoxStyleDark : selectBoxStyle
                  }
                />
              </div>
              <div className={styles.mergeBtnContainer}>
                <button className={styles.mergeBtn} onClick={handleMerge}>
                  Merge
                </button>
              </div>
            </div>
            <div className={styles.studentInfoContainers}>
              {selectedStudents.includes(selectedStudentAId || '') && (
                <div className={styles.extendBackground1}>
                  <p className={styles.studentInfoHeader}>
                    Student Information
                  </p>
                  <p>{studentAEmail}</p>
                  <p>{studentAaddress}</p>
                </div>
              )}

              {selectedStudents.includes(selectedStudentBId || '') && (
                <div className={styles.extendBackground2}>
                  <p className={styles.studentInfoHeader}>
                    Student Information
                  </p>
                  <p>{studentBEmail}</p>
                  <p>{studentBaddress}</p>
                </div>
              )}
            </div>
          </div>

          {/* Display student roster checkbox */}
          <h2 className={styles.title}>Student Roster</h2>
          <div className={styles.listContainer}>
            <div className={styles.listBox}>{studentList}</div>
          </div>
          <div className={styles.bottomButtonContainer}>
            <button onClick={handleUncheck} className={styles.bottomButton}>
              Uncheck All
            </button>
          </div>
          <Snackbar
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
            open={alertOpen}
            autoHideDuration={3000}
            onClose={() => setAlertOpen(false)}
          >
            <Alert severity="error" sx={{ width: '100%' }}>
              {alertMsg}
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
};

export default ManualStudentMerge;
