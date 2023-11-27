import { useState, useEffect } from 'react';
import { getAllTeachers } from '../../../backend/FirestoreCalls';
import { useAuth } from '../../../auth/AuthProvider';
import { TeacherID } from '../../../types/UserType';
import styles from '../ClassTeachers/ClassTeachers.module.css';
import Loading from '../../../components/LoadingScreen/Loading';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import { Link } from 'react-router-dom';
import EyeIcon from '../../../assets/view.svg';
import TrashIcon from '../../../assets/trash.svg';
import DeleteTeacherClassConfirmation from './DeleteTeacherClassConfirmation/DeleteTeacherClassConfirmation';
import { Snackbar, Alert } from '@mui/material';

const ClassTeachers = (props: { teachers: Array<TeacherID> }): JSX.Element => {
  const [teachers, setTeachers] = useState<Array<Partial<TeacherID>>>([]);
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

  return (
    <div>
      {props.teachers.length === 0 ? (
        <h4 className={styles.message}>No Teachers Currently in Roster</h4>
      ) : error ? (
        <h4 className={styles.message}>
          Error retrieving teachers. Please try again later.
        </h4>
      ) : (
        <>
          <div className={styles.teachersContainer}>
            {props.teachers.map((teacher, i) => {
              const roundTop = i === 0 ? styles.roundTop : '';
              const roundBottom =
                i === props.teachers.length - 1 ? styles.roundBottom : '';
              return (
                <div
                  key={i}
                  className={`${styles.box} ${roundTop} ${roundBottom}`}
                >
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
                        <img
                          src={TrashIcon}
                          className={styles.trashIcon}
                          onClick={() => {
                            setPopupEmail(teacher.email);
                            setPopupName(teacher.name);
                            setRemoveTeacherId(teacher.id);
                            handleClick();
                          }}
                        />
                      </button>
                    </ToolTip>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.bottomLevel}>
            <button className={styles.addButton}>Add Teacher</button>
          </div>
        </>
      )}
      {showPopup && (
        <DeleteTeacherClassConfirmation
          open={showPopup}
          onClose={() => {
            setShowPopup(!showPopup);
          }}
          popupName={popupName ? popupName : 'undefined'}
          popupEmail={popupEmail ? popupEmail : 'undefined'}
          removeTeacherId={removeTeacherId ? removeTeacherId : 'undefined'}
          setReloadList={setReloadList}
          reloadList={reloadList}
          teachers={props.teachers}
          // setTeachers={setTeachers}
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
  );
};

export default ClassTeachers;
