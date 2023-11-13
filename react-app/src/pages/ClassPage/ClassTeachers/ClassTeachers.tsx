import { useState, useEffect } from 'react';
import { getAllTeachers, getTeacher } from '../../../backend/FirestoreCalls';
import { useAuth } from '../../../auth/AuthProvider';
import { TeacherID, type YKNOTUser } from '../../../types/UserType';
import styles from '../ClassTeachers/ClassTeachers.module.css';
import Loading from '../../../components/LoadingScreen/Loading';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import { Link } from 'react-router-dom';
import EyeIcon from '../../../assets/view.svg';
import TrashIcon from '../../../assets/trash.svg';
import DeleteTeacherConfirmation from '../../TeacherRosterPage/TeacherList/DeleteTeacherConfirmation/DeleteTeacherConfirmation';
import { Snackbar, Alert } from '@mui/material';

const ClassTeachers = (): JSX.Element => {
  const [teachers, setTeachers] = useState<Array<Partial<TeacherID>>>([]);
  const [teacherList, setTeacherList] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);


  const [showPopup, setShowPopup] = useState(false);
  const [popupName, setPopupName] = useState<String>();
  const [popupEmail, setPopupEmail] = useState<String>();
  const [removeTeacherId, setRemoveTeacherId] = useState<String>();
  const [reloadList, setReloadList] = useState<Boolean>(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openFailure, setOpenFailure] = useState<boolean>(false);

  const authContext = useAuth();

  const handleToClose = (event: any, reason: any) => {
    setOpenSuccess(false);
    setOpenFailure(false);
  };

  const handleClick = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    getAllTeachers()
      .then((allTeachers) => {
        const partialTeachers: Array<Partial<TeacherID>> = allTeachers.map(
          (currTeacher) => ({
            name: currTeacher.name,
            auth_id: currTeacher.auth_id,
            id: currTeacher.id,
            email: currTeacher.email,
          }),
        );
        setTeachers(partialTeachers);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  useEffect(() => {
    const list = teachers.map((teacher, i) => {
      const roundTop = i === 0 ? styles.roundTop : '';
      const roundBottom = i === teachers.length - 1 ? styles.roundBottom : '';

      return (
        <div key={i} className={`${styles.box} ${roundTop} ${roundBottom}`}>
          <p className={styles.name}>{teacher.name}</p>
          <div className={styles.icons}>
            {authContext?.token?.claims.role === 'ADMIN' && (
            <Link to={`/teachers/${teacher.id}`}>
              <ToolTip title="View Profile" placement="top">
                <button className={styles.button}>
                  <img src={EyeIcon} className={styles.profileIcon} />
                </button>
              </ToolTip>
            </Link>
            )}
            <ToolTip title="Remove" placement="top">
              <button className={styles.button}>
                <img src={TrashIcon} className={styles.trashIcon}
                 onClick={() => {
                  setPopupEmail(teacher.email);
                  setPopupName(teacher.name);
                  setRemoveTeacherId(teacher.auth_id);
                  handleClick();
                }}
                />
              </button>
            </ToolTip>
          </div>
        </div>
      );
    });
    setTeacherList(list);
  }, [teachers]);

  return (
    <>
      {authContext?.loading || loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div>
          {teachers.length === 0 ? (
            <h4 className={styles.message}>No Teachers Currently in Roster</h4>
          ) : error ? (
            <h4 className={styles.message}>
              Error retrieving teachers. Please try again later.
            </h4>
          ) : (
            <>
              <div className={styles.teachersContainer}>{teacherList}</div>
              <div className={styles.bottomLevel}>
                <button className={styles.addButton}>Add Teacher</button>
              </div>
            </>
          )}
          {showPopup && (
            <DeleteTeacherConfirmation
              open={showPopup}
              onClose={() => {
                setShowPopup(!showPopup);
              }}
              popupName={popupName ? popupName : 'undefined'}
              popupEmail={popupEmail ? popupEmail : 'undefined'}
              removeTeacherId={removeTeacherId ? removeTeacherId : 'undefined'}
              setReloadList={setReloadList}
              reloadList={reloadList}
              teachers={teachers}
              setTeachers={setTeachers}
              setOpenSuccess={setOpenSuccess}
              setOpenFailure={setOpenFailure}
            />
          )}
          <Snackbar
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
            open={openSuccess}
            autoHideDuration={3000}
            onClose={handleToClose}
          >
            <Alert severity="success" sx={{ width: '100%' }}>
              Teacher was Successfully Removed
            </Alert>
          </Snackbar>
        </div>
      )}
    </>
  );
};

export default ClassTeachers;
