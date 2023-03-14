import styles from './AdminSettingsPage.module.css';
import React, { useState } from 'react';

const AdminSettingsPage = (): JSX.Element => {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState('Eric Johnson');

  return (
    <div className={styles.settings}>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.inputs}>
        <div className={styles.box} id="Name">
          <a className={styles.boxTitle}>Name</a>
          <a className={styles.boxData}>
            {edit ? (
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
              setEdit(!edit);
            }}
          >
            {edit ? 'save' : 'edit'}
          </button>
        </div>
        <div className={styles.box} id="Email">
          <a className={styles.boxTitle}>Email</a>
          <a className={styles.boxData}>eric.johnson@gmail.com</a>
          <button className={styles.editKey}>edit</button>
        </div>
        <div className={styles.bottomBox} id="Password">
          <a className={styles.boxTitle}>Password</a>
          <a className={styles.boxData}>******************</a>
          <button className={styles.editKey}>edit</button>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.button}>Add Teacher</button>
        <button className={styles.button}>Delete Teacher</button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
