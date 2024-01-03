import { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthProvider';
import { TeacherID } from '../../../types/UserType';
import styles from '../ClassTeachers/ClassTeachers.module.css';
import AddTeacherClass from './AddTeacherClass/AddTeacherClass';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import { Link } from 'react-router-dom';
import EyeIcon from '../../../assets/view.svg';
import TrashIcon from '../../../assets/trash.svg';
import DeleteTeacherClassConfirmation from './DeleteTeacherClassConfirmation/DeleteTeacherClassConfirmation';
import { Snackbar, Alert } from '@mui/material';

const ClassTeachers = (props: {
  teachers: Array<TeacherID>;
  setTeachers: Function;
  courseID: string;
  courseName: string;
}): JSX.Element => {
  const [teachers, setTeachers] = useState<any[]>(props.teachers);
  const [teacherList, setTeacherList] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [openRemoveTeacherModal, setOpenRemoveTeacherModal] =
    useState<boolean>(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupName, setPopupName] = useState<string>();
  const [popupEmail, setPopupEmail] = useState<string>();
  const [removeTeacherId, setRemoveTeacherId] = useState<string>();
  const [reloadList, setReloadList] = useState<Boolean>(false);
  const [removeSuccess, setRemoveSuccess] = useState<boolean>(false);
  const [addSuccess, setAddSuccess] = useState<boolean>(false);

  const authContext = useAuth();

  const handleRemoveTeacherModal = () => {
    setOpenRemoveTeacherModal(!openRemoveTeacherModal);
  };

  useEffect(() => {
    setReloadList(false);

    const list = teachers.reduce((result: any[], teacher, i) => {
      const roundTop = i === 0 ? styles.roundTop : '';
      const roundBottom = i === teachers.length - 1 ? styles.roundBottom : '';
      result.push(
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
        </div>,
      );
      return result;
    }, []);
    setTeacherList(list);
  }, [reloadList]);

  const removePopupClose = (event: any, reason: any) => {
    setRemoveSuccess(false);
  };

  const addPopupClose = (event: any, reason: any) => {
    setAddSuccess(false);
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
          <div className={styles.teachersContainer}>{teacherList}</div>
          <div className={styles.bottomLevel}>
            <button
              className={styles.addButton}
              onClick={handleRemoveTeacherModal}
            >
              Add Teacher
            </button>
          </div>
        </>
      )}
      <AddTeacherClass
        courseId={props.courseID}
        open={openRemoveTeacherModal}
        onClose={() => {
          setOpenRemoveTeacherModal(!openRemoveTeacherModal);
        }}
        setReloadList={setReloadList}
        displayTeachers={teachers}
        setDisplayTeachers={setTeachers}
        setClassTeachers={props.setTeachers}
        setAddSuccess={setAddSuccess}
      />
      {showPopup && (
        <DeleteTeacherClassConfirmation
          open={showPopup}
          onClose={() => {
            setShowPopup(!showPopup);
          }}
          popupName={popupName ? popupName : 'undefined'}
          popupEmail={popupEmail ? popupEmail : 'undefined'}
          removeTeacherId={removeTeacherId ? removeTeacherId : 'undefined'}
          courseId={props.courseID}
          courseName={props.courseName}
          setReloadList={setReloadList}
          teachers={teachers}
          setTeachers={setTeachers}
          setClassTeachers={props.setTeachers}
          setRemoveSuccess={setRemoveSuccess}
        />
      )}
      <Snackbar
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        open={removeSuccess}
        autoHideDuration={3000}
        onClose={removePopupClose}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Teacher was Successfully Removed
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        open={addSuccess}
        autoHideDuration={3000}
        onClose={addPopupClose}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Teacher was Successfully Added
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ClassTeachers;
