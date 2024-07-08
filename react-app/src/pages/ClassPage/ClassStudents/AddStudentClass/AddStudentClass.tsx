import React, { useEffect, useState } from 'react';
import {
  getAllStudents,
  addStudentCourseFromList,
} from '../../../../backend/FirestoreCalls';
import { StudentID } from '../../../../types/StudentType';
import Select, { type OptionProps } from 'react-select';
import styles from './AddStudentClass.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';

interface modalType {
  courseId: string;
  open: boolean;
  onClose: any;
  setReloadList: Function;
  displayStudents: Array<Partial<StudentID>>;
  setDisplayStudents: Function;
  setClassStudents: Function;
  setAddSuccess: Function;
}

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
    paddingTop: '5px',
    paddingBottom: '5px',
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
      <input type="checkbox" checked={isSelected} style={checkboxStyle} />
      {children}
    </div>
  );
};

const AddStudentClass = ({
  courseId,
  open,
  onClose,
  setReloadList,
  displayStudents,
  setDisplayStudents,
  setClassStudents,
  setAddSuccess,
}: modalType): React.ReactElement => {
  const [students, setStudents] = useState<Array<Partial<StudentID>>>([]);
  const [studentList, setStudentList] = useState<Array<Partial<StudentID>>>([]);
  const [selectedStudents, setSelectedStudents] = useState<Array<string>>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectBoxStyle = {
    control: (provided: any, state: any) => ({
      ...provided,
      width: '300px',
      height: 'fit-content',
      overflow: 'hidden',
      fontSize: 'large',
      marginBottom: 'auto',
      boxShadow: 'none',
      borderColor: state.isFocused
        ? 'var(--color-orange)'
        : 'var(--color-orange)',
      '&:hover': {},
      borderWidth: '2px',
    }),
    menu: (provided: any) => ({
      ...provided,
      marginTop: 0,
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      position: 'absolute',
      right: '8px',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'var(--color-orange)',
    }),
  };

  useEffect(() => {
    getAllStudents()
      .then((allStudnets) => {
        const partialStudents: Array<Partial<StudentID>> = allStudnets.map(
          (currStudent) => ({
            firstName: currStudent.firstName,
            lastName: currStudent.lastName,
            id: currStudent.id,
            email: currStudent.email,
          }),
        );
        setStudents(partialStudents);
      })
      .catch(() => {})
      .finally(() => {});
  });

  useEffect(() => {
    setStudentList(students);
  }, [students]);

  const handleAddStudent = () => {
    if (selectedStudents.length == 0) {
      setErrorMessage('*Please select a student');
    } else {
      addStudentCourseFromList(selectedStudents, courseId)
        .then(() => {
          selectedStudents.forEach((studentId) => {
            const existingTeacher = displayStudents.find(
              (student) => student.id === studentId,
            );
            if (!existingTeacher) {
              const foundTeacher = students.find(
                (student) => student.id === studentId,
              );
              if (foundTeacher) {
                displayStudents.push(foundTeacher);
              }
            }
          });
          setDisplayStudents(displayStudents);
          setClassStudents(displayStudents);
          handleOnClose();
          setReloadList(true);
          setAddSuccess(true);
        })
        .catch((err) => {
          setErrorMessage('*Student(s) could not be added.');
        });
    }
  };

  const handleOnClose = (): void => {
    onClose();
    setSelectedStudents([]);
    setErrorMessage('');
  };

  return (
    <Modal
      open={open}
      height={250}
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
          <h1 className={styles.heading}>Add Student</h1>
          <p className={styles.error}>{errorMessage}</p>
          <Select
            defaultValue={null}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            onChange={(selectedOptions: any) => {
              setSelectedStudents(selectedOptions.map((opt: any) => opt.value));
            }}
            options={studentList.map((student) => ({
              value: student.id,
              label: student.firstName + ' ' + student.lastName,
            }))}
            components={{
              Option: InputOption,
              /* Remove the separator and clear indicators from the main selection box */
              IndicatorSeparator: () => null,
              ClearIndicator: () => null,
            }}
            placeholder="Add Student"
            styles={selectBoxStyle}
          />
          <button
            className={styles.button}
            onClick={() => {
              handleAddStudent();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddStudentClass;
