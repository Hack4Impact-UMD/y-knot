import styles from './AdminSettingsPage.module.css';
import React, { useState } from 'react';
import ResetEmail from '../../components/ResetEmail/ResetEmail';
import ResetPassword from '../../components/ResetPassword/ResetPassword';
import { MdEdit } from 'react-icons/md';

const AdminSettingsPage = (): JSX.Element => {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState('Eric Johnson');
  const [email, setEmail] = useState('eric.johnson@gmail.com');
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);

  return (
    <div className={styles.settings}>
      <h1 className={styles.title}>Settings</h1>
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
          <a className={styles.boxData}>{email}</a>
          <button
            className={styles.editKey}
            onClick={() => setOpenEmailModal(!openEmailModal)}
          >
            <MdEdit />
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
            className={styles.editButton}
            onClick={() => setOpenPasswordModal(!openPasswordModal)}
          >
            Change Password
          </button>
          <ResetPassword
            open={openPasswordModal}
            onClose={() => setOpenPasswordModal(!openPasswordModal)}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.buttonLeft}>Add Teacher</button>
        <button className={styles.buttonRight}>Delete Teacher</button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
