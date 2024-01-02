import { useState, useRef } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import styles from './ClassSettings.module.css';
import { DateTime } from 'luxon';
import Select from 'react-select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import someIcon from '../../../assets/edit.svg';

const ClassPage = (): JSX.Element => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState<string>('');
  const dropdownOptions = ['Program', 'Academy', 'Club'];
  return (
    <div className={styles.mainContainer}>
      <div className={styles.topContainer}>
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
          <div className={styles.calendar}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label=""
                slotProps={{ textField: { size: 'small' } }}
                sx={{
                  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid black',
                  }, // at page load
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                    { border: '2px solid black' }, // at focused state
                }}
              />{' '}
            </LocalizationProvider>
          </div>
        </div>

        <div className={styles.row}>
          <p className={styles.headerText}> End Date </p>
          <div className={styles.calendar}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label=""
                slotProps={{ textField: { size: 'small' } }}
                sx={{
                  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid gray',
                  }, // at page load
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                    { border: '1px solid gray' }, // at focused state
                }}
              />{' '}
            </LocalizationProvider>
          </div>
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
      <div className={styles.bottomButton}>
        <img className={styles.someIcon} src={someIcon}></img>
      </div>
    </div>
  );
};

export default ClassPage;
