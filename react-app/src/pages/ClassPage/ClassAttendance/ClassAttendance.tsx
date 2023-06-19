import { useState } from 'react';
import styles from './ClassAttendance.module.css';
import noteIcon from '../../../assets/note.svg';
import CheckboxWithLabel from '../CheckboxWithLabel/CheckboxWithLabel';

const ClassAttendance = (): JSX.Element => {
  const students: string[] = [
    'Fiona Love',
    'Alicia Jacobs',
    'Emily Lee',
    'Brian Bailey',
    'Ariana Apple',
  ];

  const dates = ['1/1/2023', '1/8/2023', '1/16/2023'];
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);

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
            Date:
          </option>
          {dates.map(function (date, i) {
            return <option value={date}>{date}</option>;
          })}
        </select>
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
                  checkedText="Present"
                  uncheckedText="Absent"
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
      </div>
    </div>
  );
};

export default ClassAttendance;
