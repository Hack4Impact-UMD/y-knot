import styled from '@emotion/styled';
import { Checkbox, Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select, { type OptionProps } from 'react-select';
import { getStudent, getAllStudents } from '../../../backend/FirestoreCalls';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import { StudentID } from '../../../types/StudentType';
import styles from './ManualStudentMerge.module.css';
import eyeIcon from '../../../assets/view.svg';

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

const BpIcon = styled('span')(({ theme }) => ({
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
  const [open, setOpen] = useState<boolean>(false);
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

  /* Styling for the checkboxes in dropdown-select. This only applies to the dropdown under Student A */
  const selectBoxStyleDependentA = {
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
      width: '90%',
      fontSize: '1.2rem',
      fontWeight: selectedStudentA ? 'bolder' : '',
      borderRadius: '15px',
      backgroundColor: selectedStudentA ? 'var(--color-grey)' : '',
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

  /* Styling for the checkboxes in dropdown-select. This only applies to the dropdown under Student B */
  const selectBoxStyleDependentB = {
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
      width: '90%',
      fontSize: '1.2rem',
      fontWeight: selectedStudentB ? 'bolder' : '',
      borderRadius: '15px',
      backgroundColor: selectedStudentB ? 'var(--color-grey)' : '',
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
      width: '90%',
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

  /* List of students to display in the dropdown-select */
  const selectOptions = students.map((student) => ({
    value: student.id,
    label: `${student.firstName} ${student.lastName}`,
  }));

  /* Handle selecting a student A, If the student exists, then get the student and update Student A's name and info.
  Call handleCheck and pass in Student A's id to add it to the set of selected students. */
  const handleStudentADropdownChange = async (selectedOption: any) => {
    if (selectedOption) {
      const studentId = selectedOption.value;
      const student = await getStudent(studentId);
      const studentName = `${student.firstName} ${student.lastName}`;

      if (!student.addrFirstLine) {
        setStudentAAddress('Missing Address');
      } else {
        setStudentAAddress(student.addrFirstLine);
      }

      if (!student.email) {
        setStudentAEmail('Missing Email');
      } else {
        setStudentAEmail(student.email);
      }

      setSelectedStudentADropdown({
        value: studentId,
        label: studentName,
      });
      handleCheck(studentId);
    } else {
      setSelectedStudentADropdown(null);

      // Remove the deselected student from selectedStudents
      if (selectedStudentAId) {
        handleCheck(selectedStudentAId);
      }
    }
  };

  /* Same as handleStudentADropdownChange but only applicable for student B. */
  const handleStudentBDropdownChange = async (selectedOption: any) => {
    if (selectedOption) {
      const studentId = selectedOption.value;
      const student = await getStudent(studentId);
      const studentName = `${student.firstName} ${student.lastName}`;

      setSelectedStudentBDropdown({
        value: studentId,
        label: studentName,
      });

      if (!student.addrFirstLine) {
        setStudentBAddress('N/A');
      } else {
        setStudentBAddress(student.addrFirstLine);
      }

      if (!student.email) {
        setStudentBEmail('N/A');
      } else {
        setStudentBEmail(student.email);
      }

      handleCheck(studentId);
    } else {
      setSelectedStudentBDropdown(null);

      // Remove the deselected student from selectedStudents
      if (selectedStudentBId) {
        handleCheck(selectedStudentBId);
      }
    }
  };

  let timer: NodeJS.Timeout | null = null;

  /* Allows the snackbar that notifies the user only 2 students can be selected to close */
  const snackbarClose = () => {
    setOpen(false);
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
                onClick={() => handleCheck(id)}
              />
            </div>
          </div>,
        );
      }
      return result;
    }, []);
    setStudentList(list);
  }, [search, students, selectedStudents]);

  /* If there are at least 2 students selected (via checking the selectedStudents set), then open the SnackBar to notify the user that
  no more than 2 students can be selected. */
  useEffect(() => {
    if (selectedStudents.length > 2) {
      setOpen(true);
    }
  }, [selectedStudents]);

  /* A ridiculously long handle function to hanle the following: If the student selected is the first student selected, then it is student A. Otherwise, it is student B. 
  If we select a student from StudentB, then that student becomes as such and vice versa for Student A. If we select a student that already exists, we are 
  essentially deselecting it (based on being A or B). */
  const handleCheck = async (studentId: any) => {
    let newSelectedStudents = [...selectedStudents];
    let student = await getStudent(studentId);
    let studentName =
      (await getStudent(studentId)).firstName +
      ' ' +
      (await getStudent(studentId)).lastName;

    if (newSelectedStudents.includes(studentId)) {
      newSelectedStudents = newSelectedStudents.filter(
        (id) => id !== studentId,
      );
      if (selectedStudentAId === studentId) {
        setSelectedStudentA(null);
        setSelectedStudentAId(undefined);
        setSelectedStudentADropdown(null);
      } else if (selectedStudentBId === studentId) {
        setSelectedStudentB(null);
        setSelectedStudentBId(undefined);
        setSelectedStudentBDropdown(null);
      }
    } else {
      if (
        newSelectedStudents.length < 2 &&
        !selectedStudents.includes(studentId)
      ) {
        if (
          newSelectedStudents.length ==0 &&
          !selectedStudentBDropdown == null
        ) {
          setSelectedStudentB(studentName);
          setSelectedStudentBId(studentId);
          setSelectedStudentBDropdown({
            value: studentId,
            label: studentName,
          });
          if (!student.addrFirstLine) {
            setStudentBAddress('N/A');
          } else {
            setStudentBAddress(student.addrFirstLine);
          }

          if (!student.email) {
            setStudentBEmail('N/A');
          } else {
            setStudentBEmail(student.email);
          }
        } else {
          if (newSelectedStudents.length === 0) {
            setSelectedStudentA(studentName);
            setSelectedStudentAId(studentId);
            setSelectedStudentADropdown({
              value: studentId,
              label: studentName,
            });
            if (!student.addrFirstLine) {
              setStudentAAddress('N/A');
            } else {
              setStudentAAddress(student.addrFirstLine);
            }

            if (!student.email) {
              setStudentAEmail('N/A');
            } else {
              setStudentAEmail(student.email);
            }
          } else if (newSelectedStudents.length === 1) {
            setSelectedStudentB(studentName);
            setSelectedStudentBId(studentId);
            setSelectedStudentBDropdown({
              value: studentId,
              label: studentName,
            });
            if (!student.addrFirstLine) {
              setStudentBAddress('N/A');
            } else {
              setStudentBAddress(student.addrFirstLine);
            }

            if (!student.email) {
              setStudentBEmail('N/A');
            } else {
              setStudentBEmail(student.email);
            }
          }
          newSelectedStudents.push(studentId);
        }
      } else {
        /* Open snackbar if there are =2 students selected and the user tried to select 1 more student */
        setOpen(true);
      }
    }
    setSelectedStudents(newSelectedStudents);
  };

  /* Unchecks/deselects all students selected in roster and dropdown-select. Triggered when "Clear All" button is clicked */
  const handleUncheck = () => {
    setSelectedStudents([]);
    setSelectedStudentADropdown(null);
    setSelectedStudentBDropdown(null);
    setSelectedStudentA(null);
    setSelectedStudentB(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainMerge}>
        <div className={styles.mergeContainer}>
          <div className={styles.studentAContainer}>
            <h1>Student A</h1>
          </div>
          <div className={styles.studentBContainer}>
            <h1>Student B</h1>
          </div>
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
                selectedStudentA ? selectBoxStyleDependentA : selectBoxStyle
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
                selectedStudentB ? selectBoxStyleDependentB : selectBoxStyle
              }
            />
          </div>
          <div className={styles.mergeBtnContainer}>
            <button className={styles.mergeBtn}>Merge</button>
          </div>
        </div>
        <div className={styles.studentInfoContainers}>
          {selectedStudents.includes(selectedStudentAId || '') && (
            <div className={styles.extendBackground1}>
              <p className={styles.studentInfoHeader}>Student Information</p>
              <p>{studentAaddress}</p>
              <p>{studentAEmail}</p>
            </div>
          )}

          {selectedStudents.includes(selectedStudentBId || '') && (
            <div className={styles.extendBackground2}>
              <p className={styles.studentInfoHeader}>Student Information</p>
              <p>{studentBaddress}</p>
              <p>{studentBEmail}</p>
            </div>
          )}
        </div>
      </div>

      {/* Display student roster checkbox */}
      <h1 className={styles.title}>Student Roster</h1>
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
        open={open}
        autoHideDuration={3000}
        onClose={snackbarClose}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Only 2 students can be selected at a time
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ManualStudentMerge;
