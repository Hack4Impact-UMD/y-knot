import { useState } from 'react';
import styles from './ClassHomework.module.css';
import noteIcon from '../../../assets/note.svg';
import CheckboxWithLabel from '../CheckboxWithLabel/CheckboxWithLabel';

const ClassHomework = (): JSX.Element => {
  const students = [
    'Fiona Love',
    'Alicia Jacobs',
    'Emily Lee',
    'Brian Bailey',
    'Ariana Apple',
  ];

  const dates = ['Homework 2', 'Exam 1', 'Exam 2'];
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAllChange = () => {
    setSelectAllChecked(true);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topLevel}>
        <button className={styles.noteButton}>
          <img className={styles.noteIcon} src={noteIcon}></img>
        </button>
        <select defaultValue="" className={styles.dateSelection}>
          <option value="" disabled hidden>
            Assignment:
          </option>
          {dates.map(function (date, i) {
            return <option value={date}>{date}</option>;
          })}
        </select>
      </div>
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
      <div className={styles.bottomLevel}>
        <button className={styles.bottomButton}>Save</button>
        <button className={styles.bottomButton} onClick={handleSelectAllChange}>
          Select All
        </button>
        <button className={styles.bottomButton}>Remove</button>
        <button className={styles.bottomButton}>Add</button>
      </div>
      <br></br>
      <br></br>
    </div>
  );
};

export default ClassHomework;
