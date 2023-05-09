import React, { FormEvent, useState } from 'react';
import styles from './HomeworkPage.module.css';
import trashIcon from '../../../assets/trash.svg';
import eyeIcon from '../../../assets/view.svg';
import noteIcon from '../../../assets/note.svg';
import CheckboxWithLabel from '../CheckboxWithLabel/CheckboxWithLabel';
import Modal from '../../../components/ModalWrapper/Modal';
import x from '../../../assets/x.svg';
import { Typography, TextField, Grid} from '@mui/material';

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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalInputObj, setAddModalInputObj] = useState({
    name: '',
    notes: ''
  });
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [removeModalInputObj, setRemoveModalInputObj] = useState(['Introduction', 'Exam 1', 'Exam 2', 'Homework 1']);
  const [selectedHwks, setSelectedHwks] = useState<string[]>([])

  const handleAddModalInputChange = (field: any, event: any) => {
    setAddModalInputObj({
      ...addModalInputObj,
      [field]: event.target.value
    });
  };

  const handleAddModal = () => {
    setAddModalOpen(!addModalOpen);
  }

  const handleAddModalSubmit = () => {
    // submit addModalInputObj to wherever
    handleAddModal();
  }

  const handleRemoveModal = () => {
    setRemoveModalOpen(!removeModalOpen)
  }

  const handleCheckboxChange = (title: string) => {
    if (selectedHwks.includes(title)) {
      setSelectedHwks(selectedHwks.filter((hwk) => hwk !== title));
    } else {
      setSelectedHwks([...selectedHwks, title]);
    }
  };

  const handleRemoveModalSubmit = () => {
    const checkedHwks = removeModalInputObj.filter((title) => selectedHwks.includes(title));
    console.log('Selected homeworks:', checkedHwks);
    // make API call or update state with checked homeworks
    handleRemoveModal();
  };

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

        <button className={styles.remove} onClick={handleRemoveModal}>Remove</button>
        <button className={styles.add} onClick={handleAddModal}>Add</button>
      </div>
      <Modal open={addModalOpen} height={600} width={600} onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
        handleAddModal();
      }} >
        <div>
          <div className={styles.header}>
            <button
              type="button"
              className={styles.close}
              onClick={() => {
                handleAddModal();
              }}
            >
              <img src={x} alt="Close popup" />
            </button>
          </div>
          <div className={styles.content}>

            <h1 className={styles.heading}>Add Homework</h1>
            <input
                type="text"
                placeholder="Name:"
                className={styles.nameInput}
                onChange={(event) => handleAddModalInputChange('name', event)}
            />
            <textarea
                placeholder="Create note here:"
                className={styles.noteInput}
                onChange={(event) => handleAddModalInputChange('notes', event)}
            />
            <button className={styles.button} onClick={handleAddModalSubmit}>
                Submit
            </button>
          </div>
        </div>
      </Modal>
      <Modal open={removeModalOpen} height={600} width={600} onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
        handleRemoveModal();
      }} >
        <div>
          <div className={styles.header}>
            <button
              type="button"
              className={styles.close}
              onClick={() => {
                handleRemoveModal();
              }}
            >
              <img src={x} alt="Close popup" />
            </button>
          </div>
          <div className={styles.content}>

            <h1 className={styles.heading}>Remove Homework</h1>
            <div className={styles.removeCheckList}>
              {removeModalInputObj.map((hwk) => (
                <div key={hwk}>
                  <label>
                    <input className={styles.hwkListObj}
                      type="checkbox"
                      value={hwk}
                      checked={selectedHwks.includes(hwk)}
                      onChange={() => handleCheckboxChange(hwk)}
                    />
                    {hwk}
                  </label>
                </div>
              ))}
              <button onClick={handleRemoveModalSubmit} className={styles.button}>Submit</button>
            </div>
          </div>
        </div>
      </Modal>
      <br></br>
      <br></br>
    </div>
  );
};

export default HomeworkPage;
