import { useEffect, useState, useLayoutEffect } from 'react';
import { useAuth } from '../../../auth/AuthProvider';
import { Link } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import type { StudentID } from '../../../types/StudentType';
import styles from './ClassStudents.module.css';
import Loading from '../../../components/LoadingScreen/Loading';
import DeleteStudentClassConfirmation from './DeleteStudentClassConfirmation/DeleteStudentClassConfirmation';
import CertificateIcon from '../../../assets/certificate.svg';
import EyeIcon from '../../../assets/view.svg';
import TrashIcon from '../../../assets/trash.svg';

const ClassStudents = (props: {
  students: Array<StudentID>;
  setStudents: Function;
  courseID: string;
  courseName: string;
}): JSX.Element => {
  const authContext = useAuth();
  const [students, setStudents] = useState<any[]>(props.students);
  const [studentList, setStudentList] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupName, setPopupName] = useState<string>();
  const [popupEmail, setPopupEmail] = useState<string>();
  const [removeStudentId, setRemoveStudentId] = useState<string>();
  const [reloadList, setReloadList] = useState<Boolean>(false);
  const [removeSuccess, setRemoveSuccess] = useState<boolean>(false);
  const windowWidth = useWindowSize();

  function useWindowSize() {
    const [size, setSize] = useState(window.innerWidth);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  useEffect(() => {
    setReloadList(false);

    const list = students.reduce((result: any[], student, i) => {
      const roundTop = i === 0 ? styles.roundTop : '';
      const roundBottom = i === students.length - 1 ? styles.roundBottom : '';
      result.push(
        <div key={i} className={`${styles.box} ${roundTop} ${roundBottom}`}>
          {windowWidth < 600 ? (
            <span className={styles.nameEmail}>
              <div className={styles.studentName}>
                <p>{`${student.firstName} ${student.lastName}`}</p>
              </div>
              <div className={styles.studentEmail}>
                <p>{student.email}</p>
              </div>
            </span>
          ) : (
            <>
              <div className={styles.studentName}>
                <p>{`${student.firstName} ${student.lastName}`}</p>
              </div>
              <div className={styles.studentEmail}>
                <p>{student.email}</p>
              </div>{' '}
            </>
          )}
          <div className={styles.icons}>
            <ToolTip title="Send Certificate" placement="top">
              <button className={styles.button} onClick={sendCertificate}>
                <img src={CertificateIcon} className={styles.certificateIcon} />
              </button>
            </ToolTip>
            {authContext?.token?.claims.role === 'ADMIN' && (
              // See student profile only if admin
              <Link to={`/students/${student.id}`}>
                <ToolTip title="View Profile" placement="top">
                  <button className={styles.button}>
                    <img src={EyeIcon} className={styles.profileIcon} />
                  </button>
                </ToolTip>
              </Link>
            )}
            <ToolTip title="Remove" placement="top">
              <button
                className={styles.button}
                onClick={() => {
                  setPopupEmail(student.email);
                  setPopupName(`${student.firstName} ${student.lastName}`);
                  setRemoveStudentId(student.id);
                  handleClick();
                }}
              >
                <img src={TrashIcon} className={styles.trashIcon} />
              </button>
            </ToolTip>
          </div>
        </div>,
      );
      return result;
    }, []);
    setStudentList(list);
  }, [reloadList, windowWidth]);

  const removePopupClose = (event: any, reason: any) => {
    setRemoveSuccess(false);
  };

  const handleClick = () => {
    setShowPopup(true);
  };

  const sendCertificate = () => {
    // TODO: Populate and send certificate with student and course name
  };

  return (
    <>
      {authContext?.loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : props.students.length === 0 ? (
        <h4 className={styles.noStudent}>No Students Currently in Roster</h4>
      ) : (
        // student roster
        <div className={styles.studentsContainer}>{studentList}</div>
      )}
      {showPopup && (
        <DeleteStudentClassConfirmation
          open={showPopup}
          onClose={() => {
            setShowPopup(!showPopup);
          }}
          popupName={popupName ? popupName : 'undefined'}
          popupEmail={popupEmail ? popupEmail : 'undefined'}
          removeStudentId={removeStudentId ? removeStudentId : 'undefined'}
          courseId={props.courseID}
          courseName={props.courseName}
          setReloadList={setReloadList}
          students={students}
          setStudents={setStudents}
          setClassStudents={props.setStudents}
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
          Student was Successfully Removed
        </Alert>
      </Snackbar>
    </>
  );
};

export default ClassStudents;
