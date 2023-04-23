import React, { useState } from 'react';
import styles from './HomeworkPage.module.css';
import trashIcon from '../../../assets/trash.svg';
import eyeIcon from '../../../assets/view.svg';
import noteIcon from '../../../assets/note.svg';
import CheckboxWithLabel from '../CheckboxWithLabel/CheckboxWithLabel';

const HomeworkPage = (): JSX.Element => {
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
        <img className={styles.noteIcon} src={noteIcon}></img>
        <select defaultValue="" className={styles.dateSelection}>
          <option value="" disabled hidden>
            Assignment
          </option>
          {dates.map(function (date, i) {
            return <option value={date}>{date}</option>;
          })}
        </select>
      </div>
      <div className={styles.inputs}>
        {students.map(function (name, i) {
          return (
            <div
              className={
                i === students.length - 1 ? styles.bottomBox : styles.box
              }
              key={name}
            >
              <a className={styles.boxTitle}>{name}</a>
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
        <button className={styles.save}>Save</button>

        <button className={styles.selectAll} onClick={handleSelectAllChange}>
          Select All
        </button>

        <button className={styles.remove}>Remove</button>
        <button className={styles.add}>Add</button>
      </div>
      <br></br>
      <br></br>
    </div>
  );
};

export default HomeworkPage;
