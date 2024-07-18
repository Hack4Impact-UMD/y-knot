import React, { useEffect, useState } from 'react';
import Select, { type OptionProps } from 'react-select';
import x from '../../../../assets/x.svg';
import {
  addTeacherCourseFromList,
  getAllTeachers,
} from '../../../../backend/FirestoreCalls';
import Modal from '../../../../components/ModalWrapper/Modal';
import { type TeacherID } from '../../../../types/UserType';
import styles from './AddTeacherClass.module.css';

interface modalType {
  courseId: string;
  open: boolean;
  onClose: any;
  setReloadList: Function;
  displayTeachers: Array<Partial<TeacherID>>;
  setDisplayTeachers: Function;
  setClassTeachers: Function;
  setAddSuccess: Function;
  currentTeachers: any;
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

const AddTeacherClass = ({
  courseId,
  open,
  onClose,
  setReloadList,
  displayTeachers,
  setDisplayTeachers,
  setClassTeachers,
  setAddSuccess,
  currentTeachers,
}: modalType): React.ReactElement => {
  const [teachers, setTeachers] = useState<Array<Partial<TeacherID>>>([]);
  const [teacherList, setTeacherList] = useState<Array<Partial<TeacherID>>>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Array<string>>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectBoxStyle = {
    control: (provided: any, state: any) => ({
      ...provided,
      width: '300px',
      maxHeight: '75px',
      height: 'fit-content',
      overflowY: 'auto',
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
    getAllTeachers()
      .then((allTeachers) => {
        const partialTeachers: Array<Partial<TeacherID>> = allTeachers.map(
          (currTeacher) => ({
            name: currTeacher.name,
            id: currTeacher.id,
          }),
        );
        setTeachers(partialTeachers);
      })
      .catch(() => {})
      .finally(() => {});
  }, []);

  useEffect(() => {
    setTeacherList(teachers);
  }, [teachers]);

  const handleAddTeacher = () => {
    if (selectedTeacher.length == 0) {
      setErrorMessage('*Please select a teacher');
    } else {
      addTeacherCourseFromList(selectedTeacher, courseId)
        .then(() => {
          selectedTeacher.forEach((teacherId) => {
            const existingTeacher = displayTeachers.find(
              (teacher) => teacher.id === teacherId,
            );
            if (!existingTeacher) {
              const foundTeacher = teachers.find(
                (teacher) => teacher.id === teacherId,
              );
              if (foundTeacher) {
                displayTeachers.push(foundTeacher);
              }
            }
          });
          setDisplayTeachers(displayTeachers);
          setClassTeachers(displayTeachers);
          handleOnClose();
          setReloadList(true);
          setAddSuccess(true);
        })
        .catch((err) => {
          setErrorMessage('*Teacher(s) could not be added.');
        });
    }
  };

  const handleOnClose = (): void => {
    onClose();
    setSelectedTeacher([]);
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
          <h1 className={styles.heading}>Add Teacher</h1>
          <p className={styles.error}>{errorMessage}</p>
          <Select
            defaultValue={null}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            onChange={(selectedOptions: any) => {
              setSelectedTeacher(selectedOptions.map((opt: any) => opt.value));
            }}
            options={teacherList.map((teacher) => ({
              value: teacher.id,
              label: teacher.name,
            }))}
            components={{
              Option: InputOption,
              /* Remove the separator and clear indicators from the main selection box */
              IndicatorSeparator: () => null,
              ClearIndicator: () => null,
            }}
            placeholder="Add Teacher"
            styles={selectBoxStyle}
          />
          <button
            className={styles.button}
            onClick={() => {
              handleAddTeacher();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTeacherClass;
