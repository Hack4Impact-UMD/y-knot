import { useState, useRef } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import styles from './ClassSettings.module.css';
import { DateTime } from 'luxon';
import Select from 'react-select';

const ClassPage = (): JSX.Element => {
  const [name, setName] = useState<string>('');
  const dropdownOptions = ['Program', 'Academy', 'Club'];
  return (
    <div className={styles.mainContainer}>
      <div className={styles.row}>
        <p className={styles.headerText}> Course Name </p>
        <input
          type="text"
          placeholder="Enter Name"
          className={styles.courseInput}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className={styles.row}>
        <p className={styles.headerText}> Start Date </p>
        <div className={styles.calendar}></div>
      </div>

      <div className={styles.row}>
        <p className={styles.headerText}> End Date </p>
        <div className={styles.calendar}></div>
      </div>

      <div className={styles.row}>
        <p className={styles.headerText}> Course Type </p>
        <Select
          placeholder="Select Program"
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              borderColor: 'black',
              width: '250px',
              height: '50px',
            }),
          }}
          options={dropdownOptions.map((option) => {
            return { value: option, label: option };
          })}
        />
      </div>

      <div className={styles.row}>
        <p className={styles.headerText}> Leadership Application </p>
        <div className={styles.buttonContainer}>
          <input
            className={styles.button}
            id="Yes"
            type="radio"
            name="radioGroup"
            value="yes"
            checked
          />
          <label className={styles.yesLabel} htmlFor="Yes">
            Yes
          </label>
          <input
            className={styles.button}
            id="No"
            type="radio"
            name="radioGroup"
            value="no"
          />
          <label className={styles.noLabel} htmlFor="No">
            No
          </label>
        </div>
      </div>

      <div className={styles.lastRow}>
        <p className={styles.headerText}> Form ID </p>
        <input
          type="text"
          placeholder="Enter ID"
          className={styles.formIDInput}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
    </div>
  );
};

export default ClassPage;
