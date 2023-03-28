import styles from './AdminSettingsPage.module.css';
import React, { useState } from 'react';
import ResetEmail from '../../components/ResetEmail/ResetEmail';
import ResetPassword from '../../components/ResetPassword/ResetPassword';

const AdminSettingsPage = (): JSX.Element => {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState('Eric Johnson');
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);

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
          <button
            className={styles.editKey}
            onClick={() => setOpenEmailModal(!openEmailModal)}
          >
            edit
          </button>
          <ResetEmail
            open={openEmailModal}
            onClose={() => setOpenEmailModal(!openEmailModal)}
          />
        </div>
        <div className={styles.bottomBox} id="Password">
          <a className={styles.boxTitle}>Password</a>
          <a className={styles.boxData}>******************</a>
          <button
            className={styles.editKey}
            onClick={() => setOpenPasswordModal(!openPasswordModal)}
          >
            edit
          </button>
          <ResetPassword
            open={openPasswordModal}
            onClose={() => setOpenPasswordModal(!openPasswordModal)}
          />
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
