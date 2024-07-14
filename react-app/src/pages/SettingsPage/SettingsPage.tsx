import { useEffect, useState } from 'react';
import editIcon from '../../assets/gray-pencil.svg';
import { useAuth } from '../../auth/AuthProvider';
import { getTeacherWithAuth } from '../../backend/FirestoreCalls';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { ToolTip } from '../../components/ToolTip/ToolTip';
import { type TeacherID } from '../../types/UserType';
import ResetEmail from './ResetEmail/ResetEmail';
import ResetPassword from './ResetPassword/ResetPassword';
import styles from './SettingsPage.module.css';

const SettingsPage = (): JSX.Element => {
  const [editName, setEditName] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [teacher, setTeacher] = useState<TeacherID>();
  const [name, setName] = useState<string>('');
  const [updatedName, setUpdatedName] = useState<string>('');
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);

  const authContext = useAuth();
  useEffect(() => {
    if (!authContext.loading && authContext?.token?.claims.role !== 'ADMIN') {
      getTeacherWithAuth(authContext.user.uid)
        .then((teacher) => {
          setName(teacher.name);
          setTeacher(teacher);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [authContext.loading]);
  return (
    <>
      <NavigationBar />
      {authContext?.loading ||
      (loading && authContext?.token?.claims.role !== 'ADMIN') ? (
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
            {authContext?.token?.claims.role !== 'ADMIN' ? (
              // Display name if the user is not an admin
              <div className={styles.box} id="Name">
                <a className={styles.boxTitle}>Name</a>
                <a className={styles.boxData}>{name}</a>
              </div>
            ) : (
              <></>
            )}

            <div className={styles.box} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>{authContext.user?.email}</a>
              <ToolTip title="Edit" placement="top">
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setOpenEmailModal(!openEmailModal);
                  }}
                >
                  <img src={editIcon} alt="Edit" className={styles.editIcon} />
                </button>
              </ToolTip>
              <ResetEmail
                open={openEmailModal}
                onClose={() => {
                  setOpenEmailModal(!openEmailModal);
                }}
              />
            </div>

            <div className={styles.bottomBox} id="Password">
              <a className={styles.boxTitle}>Password</a>
              <a className={styles.boxData}>********</a>
              <ToolTip title="Edit" placement="top">
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setOpenPasswordModal(!openPasswordModal);
                  }}
                >
                  <img src={editIcon} alt="Edit" className={styles.editIcon} />
                </button>
              </ToolTip>
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
