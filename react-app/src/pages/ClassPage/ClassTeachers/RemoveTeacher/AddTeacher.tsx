import React, { useEffect, useState } from 'react';
import styles from './AddTeacher.module.css';
import Modal from '../../../../components/ModalWrapper/Modal';
import x from '../../../../assets/x.svg';
import { getAllTeachers } from '../../../../backend/FirestoreCalls';
import { type YKNOTUser } from '../../../../types/UserType';
import Select, { type OptionProps } from 'react-select';

interface modalType {
  open: boolean;
  onClose: any;
}

const InputOption: React.FC<OptionProps<any, true, any>> = ({
  isSelected,
  innerProps,
  children,
}) => {
  const { onMouseDown, onMouseUp, onMouseLeave, ...restInnerProps } = innerProps || {};

  const style = {
    alignItems: 'center',
    backgroundColor: isSelected ? 'var(--color-orange)' : 'transparent',
    color: isSelected ? 'var(--color-white)' : 'black',
    display: 'flex ',
    fontSize: 'large',
    paddingTop: '5px',
    paddingBottom: '5px',
    borderRadius: '5px',
    margin: '5px'
  };

  const checkboxStyle = {
    marginRight: '10px',
    marginLeft: '10px',
    fontSize: 'large',
    width: '20px',
    height: '20px',
    color: isSelected ? 'var(--color-orange)' : 'transparent',
    backgroundColor: 'var(--color-orange)',
    borderColor: 'var(--color-orange)',
    accentColor: 'var(--color-orange)',
    opacity: "50%",
  };

  return (
    <div
      {...restInnerProps}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      <input type="checkbox" checked={isSelected} style={checkboxStyle} />
      {children}
    </div>
  );
};

const AddTeacher = ({ open, onClose }: modalType): React.ReactElement => {
  const [teachers, setTeachers] = useState<Array<Partial<YKNOTUser>>>([]);
  const [teacherList, setTeacherList] = useState<Array<Partial<YKNOTUser>>>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectBoxStyle = {
    control: (provided: any, state: any) => ({
      ...provided,
      width: '225px',
      height: '50px',
      overflow: 'hidden',
      fontSize: 'large',
      marginBottom: 'auto',
      boxShadow: 'none',
      borderColor: state.isFocused
        ? 'var(--color-orange)'
        : 'var(--color-orange)',
      '&:hover': {
      },
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
      top: '15%',
      opacity: "100%"
    }),
  };

  useEffect(() => {
    getAllTeachers()
      .then((allTeachers) => {
        const partialTeachers: Array<Partial<YKNOTUser>> = allTeachers.map(
          (currTeacher) => ({
            name: currTeacher.name,
            auth_id: currTeacher.auth_id,
          }),
        );
        setTeachers(partialTeachers);
      })
      .catch((err) => {})
      .finally(() => {});
  });

  useEffect(() => {
    setTeacherList(teachers);
  }, [teachers]);

  const handleAddTeacher = () => {
    if (selectedTeacher === '') {
      setErrorMessage('*Please select a teacher');
    } else {
      // TODO: Confirmation popup(?) & add teacher
      handleOnClose();
    }
  };

  const handleOnClose = (): void => {
    onClose();
    setSelectedTeacher('');
    setErrorMessage('');
  };

  return (
    <Modal
      open={open}
      height={250}
      onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
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
              value: teacher.name,
              label: teacher.name,
            }))}
            components={{
              Option: InputOption,
              IndicatorSeparator: () => null,
              ClearIndicator: () => null,
            }}
            placeholder="Text Input"
            styles={selectBoxStyle}
          />
          <button
            className={styles.button}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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

export default AddTeacher;
