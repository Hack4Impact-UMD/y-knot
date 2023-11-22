import { useState } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import Select from 'react-select';
import styles from './ClassAttendance.module.css';
import noteIcon from '../../../assets/note.svg';
import CheckboxWithLabel from '../CheckboxWithLabel/CheckboxWithLabel';
import AddNote from '../AddNote/AddNote';
import RemoveAttendance from './RemoveAttendance/RemoveAttendance';
import AddAttendance from './AddAttendance/AddAttendance';

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
  const [selectedDate, setDate] = useState<string>('');
  const [openAddHwModal, setOpenAddHwModal] = useState<boolean>(false);
  const [openRemoveHwModal, setOpenRemoveHwModal] = useState<boolean>(false);
  const [openAddNoteModal, setOpenAddNoteModal] = useState<boolean>(false);

  const handleSelectAllChange = () => {
    setSelectAllChecked(true);
  };

  const handleAddModal = () => {
    setOpenAddHwModal(!openAddHwModal);
  };

  const handleRemoveModal = () => {
    setOpenRemoveHwModal(!openRemoveHwModal);
  };

  const handleAddNoteModal = () => {
    setOpenAddNoteModal(!openAddNoteModal);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topLevel}>
        <ToolTip title="Attendance Note" placement="top">
          <button className={styles.noteButton} onClick={handleAddNoteModal}>
            <img className={styles.noteIcon} src={noteIcon}></img>
          </button>
        </ToolTip>
        <Select
          onChange={(date) => {
            setDate(date!.value);
          }}
          placeholder="Date"
          className={styles.dateSelection}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              borderColor: 'black',
            }),
          }}
          options={dates.map((date) => {
            return { value: date, label: date };
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
        <button className={styles.bottomButton} onClick={handleAddModal}>
          Add
        </button>
        <button className={styles.bottomButton} onClick={handleRemoveModal}>
          Remove
        </button>
        <button className={styles.bottomButton} onClick={handleSelectAllChange}>
          Select All
        </button>
        <button className={styles.bottomButton}>Save</button>
      </div>
      <RemoveAttendance
        open={openRemoveHwModal}
        onClose={() => {
          setOpenRemoveHwModal(!openRemoveHwModal);
        }}
      />
      <AddAttendance
        open={openAddHwModal}
        onClose={() => {
          setOpenAddHwModal(!openAddHwModal);
        }}
      />
      <AddNote
        title="Attendance"
        currNote="existing note here"
        selected={selectedDate || ''}
        open={openAddNoteModal}
        onClose={() => {
          setOpenAddNoteModal(!openAddNoteModal);
        }}
      />
    </div>
  );
};

export default ClassAttendance;
