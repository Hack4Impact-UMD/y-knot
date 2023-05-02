import { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import styles from './SettingsPage.module.css';
import ResetEmail from './ResetEmail/ResetEmail';
import ResetPassword from './ResetPassword/ResetPassword';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import editIcon from '../../assets/gray-pencil.svg';
import saveIcon from '../../assets/save.svg';

const SettingsPage = (): JSX.Element => {
  const [editName, setEditName] = useState<boolean>(false);
  const [name, setName] = useState<string>('Eric Johnson');
  const [updatedName, setUpdatedName] = useState<string>('');
  const [email, setEmail] = useState<string>('eric.johnson@gmail.com');
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);

  const authContext = useAuth();

  return (
    <>
      <NavigationBar />
      {authContext?.loading ? (
        /* This loading container is used because the animation used in the Loading component creates a new
          stacking context which interferes element stacking. In order to make sure popups are at the front,
          the loadingContainer has a z-index of -1.
        */
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.settings}>
          <h1 className={styles.title}>Settings</h1>
          <div className={styles.inputs}>
            {authContext?.token?.claims.role !== 'admin' ? (
              // Display name if the user is not an admin
              <div className={styles.box} id="Name">
                <a className={styles.boxTitle}>Name</a>
                <a className={styles.boxData}>
                  {editName ? (
                    <input
                      type="text"
                      className={styles.nameInput}
                      onChange={(event) => {
                        setUpdatedName(event.target.value);
                      }}
                      value={updatedName}
                    ></input>
                  ) : (
                    name
                  )}
                </a>
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setEditName(!editName);
                    if (updatedName !== '' && updatedName !== name) {
                      setName(updatedName);
                      // TODO: Update name in backend
                    } else {
                      setUpdatedName(name);
                    }
                  }}
                >
                  {editName ? (
                    <img
                      src={saveIcon}
                      alt="Save"
                      className={styles.editIcon}
                    />
                  ) : (
                    <img
                      src={editIcon}
                      alt="Edit"
                      className={styles.editIcon}
                    />
                  )}
                </button>
              </div>
            ) : (
              <></>
            )}

            <div className={styles.box} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>{authContext.user?.email}</a>
              <button
                className={styles.editButton}
                onClick={() => {
                  setOpenEmailModal(!openEmailModal);
                }}
              >
                <img src={editIcon} alt="Edit" className={styles.editIcon} />
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
                <img src={editIcon} alt="Edit" className={styles.editIcon} />
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
