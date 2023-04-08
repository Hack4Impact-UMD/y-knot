import { useState } from 'react';
import styles from './SettingsPage.module.css';
import { MdEdit } from 'react-icons/md';
import ResetEmail from '../../components/ResetEmail/ResetEmail';
import ResetPassword from '../../components/ResetPassword/ResetPassword';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

const TeacherSettingsPage = (): JSX.Element => {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState('Eric Johnson');
  const [email, setEmail] = useState('eric.johnson@gmail.com');
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);

  const authContext = useAuth();

  return (
    <div className={styles.gridContainer}>
      <NavigationBar />
      {authContext?.loading ? (
        <div className={styles.container}>
          <Loading />
        </div>
      ) : (
        <div className={styles.settings}>
          <h1 className={styles.title}>Settings</h1>
          <div className={styles.inputs}>
            {authContext?.token?.claims.role !== 'admin' ? (
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
            ) : (
              <></>
            )}

            <div className={styles.box} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>{email}</a>
              <button
                className={styles.editKey}
                onClick={() => {
                  setOpenEmailModal(!openEmailModal);
                }}
              >
                <MdEdit />
              </button>
              <ResetEmail
                open={openEmailModal}
                onClose={() => {
                  setOpenEmailModal(!openEmailModal);
                }}
              />
            </div>
            <div className={styles.bottomBox} id="Password">
              <a className={styles.boxTitle}>Password</a>
              <a className={styles.boxData}>******************</a>
              <button
                className={styles.editButton}
                onClick={() => {
                  setOpenPasswordModal(!openPasswordModal);
                }}
              >
                Change Password
              </button>
              <ResetPassword
                open={openPasswordModal}
                onClose={() => {
                  setOpenPasswordModal(!openPasswordModal);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSettingsPage;
