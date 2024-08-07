import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TrashIcon from '../../../assets/trash.svg';
import EyeIcon from '../../../assets/view.svg';
import { useAuth } from '../../../auth/AuthProvider';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import { TeacherID } from '../../../types/UserType';
import styles from '../ClassTeachers/ClassTeachers.module.css';
import AddTeacherClass from './AddTeacherClass/AddTeacherClass';
import DeleteTeacherClassConfirmation from './DeleteTeacherClassConfirmation/DeleteTeacherClassConfirmation';

const ClassTeachers = (props: {
  teachers: Array<TeacherID>;
  setTeachers: Function;
  courseID: string;
  courseName: string;
}): JSX.Element => {
  const [teachers, setTeachers] = useState<any[]>(props.teachers);
  const [teacherList, setTeacherList] = useState<any[]>([]);
  const [openAddTeacherModal, setOpenAddTeacherModal] =
    useState<boolean>(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupName, setPopupName] = useState<string>();
  const [popupEmail, setPopupEmail] = useState<string>();
  const [removeTeacherId, setRemoveTeacherId] = useState<string>();
  const [reloadList, setReloadList] = useState<boolean>(false);
  const [removeSuccess, setRemoveSuccess] = useState<boolean>(false);
  const [addSuccess, setAddSuccess] = useState<boolean>(false);

  const authContext = useAuth();

  const handleAddTeacherModal = () => {
    setOpenAddTeacherModal(!openAddTeacherModal);
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

  const removePopupClose = () => {
    setRemoveSuccess(false);
  };

  const addPopupClose = () => {
    setAddSuccess(false);
  };

  const handleClick = () => {
    setShowPopup(true);
  };

  return (
    <div>
      {props.teachers.length === 0 ? (
        <h4 className={styles.message}>No Teachers Currently in Roster</h4>
      ) : (
        <div className={styles.teachersContainer}>{teacherList}</div>
      )}
      <div className={styles.bottomLevel}>
        <button className={styles.addButton} onClick={handleAddTeacherModal}>
          Add Teacher
        </button>
      </div>
      <AddTeacherClass
        courseId={props.courseID}
        open={openAddTeacherModal}
        onClose={() => {
          setOpenAddTeacherModal(!openAddTeacherModal);
        }}
        setReloadList={setReloadList}
        displayTeachers={teachers}
        setDisplayTeachers={setTeachers}
        setClassTeachers={props.setTeachers}
        setAddSuccess={setAddSuccess}
        currentTeachers={teacherList}
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
