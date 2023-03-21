import React, { useState } from 'react';
import styles from './TeacherSettingsPage.module.css';
import { MdEdit } from 'react-icons/md';

const TeacherSettingsPage = (): JSX.Element => {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState('Eric Johnson');
  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState('eric.johnson@gmail.com');

  return (
    <div className={styles.settings}>
      <div className={styles.inputs}>
        <div className={styles.box} id="Name">
          <a className={styles.boxTitle}>Name</a>
          <a className={styles.boxData}>
            {editName ? (
              <input
                onChange={(event) => {
                  setName(event.target.value);
                }}
              ></input>
            ) : (
              name
            )}
          </a>
          <button
            className={styles.editKey}
            onClick={() => {
              setEditName(!editName);
            }}
          >
            {editName ? 'save' : <MdEdit />}
          </button>
        </div>
        <div className={styles.box} id="Email">
          <a className={styles.boxTitle}>Email</a>
          <a className={styles.boxData}>
            {editEmail ? (
              <input
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              ></input>
            ) : (
              email
            )}
          </a>
          <button
            className={styles.editKey}
            onClick={() => {
              setEditEmail(!editEmail);
            }}
          >
            {editEmail ? 'save' : <MdEdit />}
          </button>
        </div>
        <div className={styles.box} id="Password">
          <a className={styles.boxTitle}>Password</a>
          <a className={styles.boxData}>******************</a>
          <button className={styles.editButton}>Change Password</button>
        </div>
        <div className={styles.box} id="Password">
          <a className={styles.boxTitle}>Teacher</a>
          <a className={styles.boxData}></a>
          <button className={styles.editButton}>Add Teacher</button>
        </div>
        <div className={styles.box}>
          <a className={styles.boxTitle}></a>
          <a className={styles.boxData}></a>
        </div>
        <div className={styles.bottomBox}>
          <a className={styles.boxTitle}></a>
          <a className={styles.boxData}></a>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettingsPage;
