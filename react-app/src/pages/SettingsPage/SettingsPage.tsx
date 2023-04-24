import { useState } from 'react';
import styles from './SettingsPage.module.css';
import editImage from '../../assets/edit.svg';
import ResetEmail from './ResetEmail/ResetEmail';
import ResetPassword from './ResetPassword/ResetPassword';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

const SettingsPage = (): JSX.Element => {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState('Eric Johnson');
  const [email, setEmail] = useState('eric.johnson@gmail.com');
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);

  const authContext = useAuth();

  return (
    <>
      <NavigationBar />
      {authContext?.loading ? (
        /* This loading container is used because the animation used in the Loading component creates a new
          stacking context which interferes element stacking. In order to make sure popups are at the front,
          the loadaingContainer has a z-index of -1.
        */
        <div className={styles.loadingContainer}>
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
                  {editName ? 'save' : ''}
                </button>
              </div>
            ) : (
              <></>
            )}

            <div className={styles.box} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>{authContext.user?.email}</a>
              <button
                className={styles.editKey}
                onClick={() => {
                  setOpenEmailModal(!openEmailModal);
                }}
              >
                <img src={editImage} alt="Edit" className={styles.editImage} />
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
    </>
  );
};

export default SettingsPage;
