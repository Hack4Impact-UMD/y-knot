import { useState } from 'react';
import Select from 'react-select';
import styles from './ClassHomework.module.css';
import noteIcon from '../../../assets/note.svg';
import CheckboxWithLabel from '../CheckboxWithLabel/CheckboxWithLabel';
import AddHomework from './AddHomework/AddHomework';
import RemoveHomework from './RemoveHomework/RemoveHomework';

const ClassHomework = (): JSX.Element => {
  const students: string[] = [
    'Fiona Love',
    'Alicia Jacobs',
    'Emily Lee',
    'Brian Bailey',
    'Ariana Apple',
  ];

  const assignments = ['Homework 2', 'Exam 1', 'Exam 2'];
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [openAddHwModal, setOpenAddHwModal] = useState<boolean>(false);
  const [openRemoveHwModal, setOpenRemoveHwModal] = useState<boolean>(false);

  const handleSelectAllChange = () => {
    setSelectAllChecked(true);
  };

  const handleAddModal = () => {
    setOpenAddHwModal(!openAddHwModal);
  };

  const handleRemoveModal = () => {
    setOpenRemoveHwModal(!openRemoveHwModal);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topLevel}>
        <button className={styles.noteButton}>
          <img className={styles.noteIcon} src={noteIcon}></img>
        </button>
        <Select
          placeholder="Assignment"
          className={styles.selection}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              borderColor: 'black',
            }),
          }}
          options={assignments.map((assignment) => {
            return { value: assignment, label: assignment };
          })}
        />
      </div>
      {students.length === 0 ? (
        <h4 className={styles.noStudent}>No Students Currently in Roster</h4>
      ) : (
        <div className={styles.inputs}>
          {students.map(function (name, i) {
            const roundTop = i === 0 ? styles.roundTop : '';
            const roundBottom =
              i === students.length - 1 ? styles.roundBottom : '';
            return (
              <div
                className={`${styles.box} ${roundTop} ${roundBottom}`}
                key={name}
              >
                <p className={styles.boxTitle}>{name}</p>
                <CheckboxWithLabel
                  key={name}
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
        <button className={styles.bottomButton}>Save</button>
        <button className={styles.bottomButton} onClick={handleSelectAllChange}>
          Select All
        </button>
        <button className={styles.bottomButton} onClick={handleRemoveModal}>
          Remove
        </button>
        <button className={styles.bottomButton} onClick={handleAddModal}>
          Add
        </button>
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
      />
    </div>
  );
};

export default ClassHomework;
