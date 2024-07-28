import { Alert, Snackbar } from '@mui/material';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CertificateIcon from '../../../assets/certificate.svg';
import TranscriptIcon from '../../../assets/transcript.svg';

import TrashIcon from '../../../assets/trash.svg';
import EyeIcon from '../../../assets/view.svg';
import { useAuth } from '../../../auth/AuthProvider';
import { sendCertificateEmail } from '../../../backend/CloudFunctionsCalls';
import Loading from '../../../components/LoadingScreen/Loading';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import type { StudentID } from '../../../types/StudentType';
import AddStudentClass from './AddStudentClass/AddStudentClass';
import styles from './ClassStudents.module.css';
import DeleteStudentClassConfirmation from './DeleteStudentClassConfirmation/DeleteStudentClassConfirmation';
import StudentPerformance from './StudentPerformance/StudentPerformance';

const ClassStudents = (props: {
  students: Array<StudentID>;
  setStudents: Function;
  courseID: string;
  courseName: string;
}): JSX.Element => {
  const authContext = useAuth();
  const [students, setStudents] = useState<any[]>(props.students);
  const [studentList, setStudentList] = useState<any[]>([]);
  const [openAddStudentModal, setOpenAddStudentModal] =
    useState<boolean>(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupName, setPopupName] = useState<string>();
  const [popupEmail, setPopupEmail] = useState<string>();
  const [removeStudentId, setRemoveStudentId] = useState<string>();
  const [reloadList, setReloadList] = useState<Boolean>(false);
  const [removeSuccess, setRemoveSuccess] = useState<boolean>(false);
  const [addSuccess, setAddSuccess] = useState<boolean>(false);
  const [certEmailSuccess, setCertEmailSuccess] = useState<boolean>(false);
  const [showStudentPerf, setShowStudentPerf] = useState<StudentID | undefined>(
    undefined,
  );

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
                <p>{`${student.firstName} ${
                  student?.middleName ? student.middleName[0] + '.' : ''
                } ${student.lastName}`}</p>
              </div>
              <div className={styles.studentEmail}>
                <p>{student.email}</p>
              </div>
            </span>
          ) : (
            <>
              <div className={styles.studentName}>
                <p>{`${student.firstName} ${
                  student?.middleName ? student.middleName[0] + '.' : ''
                } ${student.lastName}`}</p>
              </div>
              <div className={styles.studentEmail}>
                <p>{student.email}</p>
              </div>{' '}
            </>
          )}
          <div className={styles.icons}>
            <ToolTip title="See Class Progress" placement="top">
              <button
                className={styles.button}
                onClick={() => {
                  setShowStudentPerf(student);
                }}
              >
                <img src={TranscriptIcon} className={styles.transcriptIcon} />
              </button>
            </ToolTip>
            <ToolTip title="Send Certificate" placement="top">
              <button
                className={styles.button}
                onClick={() =>
                  sendCertificate(
                    student.email,
                    `${student.firstName} ${
                      student?.middleName ? student.middleName[0] + '.' : ''
                    } ${student.lastName}`,
                  )
                }
              >
                <img src={CertificateIcon} className={styles.certificateIcon} />
              </button>
            </ToolTip>
            {authContext?.token?.claims.role === 'ADMIN' && (
              <>
                <Link to={`/students/${student.id}`}>
                  <ToolTip title="View Profile" placement="top">
                    <button className={styles.button}>
                      <img src={EyeIcon} className={styles.profileIcon} />
                    </button>
                  </ToolTip>
                </Link>
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
              </>
            )}
          </div>
        </div>,
      );
      return result;
    }, []);
    setStudentList(list);
  }, [reloadList, windowWidth]);

  const removePopupClose = () => {
    setRemoveSuccess(false);
  };

  const addPopupClose = () => {
    setAddSuccess(false);
  };

  const handleClick = () => {
    setShowPopup(true);
  };

  const sendCertificate = async (email: string, name: string) => {
    try {
      if (email == '') {
        alert('The student does not have a valid email.');
        return;
      }

      await sendCertificateEmail(email, name, props.courseName);
      setCertEmailSuccess(true);
    } catch (e) {
      console.log(e);
    }
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
      {authContext?.token?.claims.role.toUpperCase() === 'ADMIN' && (
        <div className={styles.bottomLevel}>
          <button
            className={styles.addButton}
            onClick={() => setOpenAddStudentModal(!openAddStudentModal)}
          >
            Add Student
          </button>
        </div>
      )}

      <AddStudentClass
        courseId={props.courseID}
        open={openAddStudentModal}
        onClose={() => {
          setOpenAddStudentModal(!openAddStudentModal);
        }}
        setReloadList={setReloadList}
        displayStudents={students}
        setDisplayStudents={setStudents}
        setClassStudents={props.setStudents}
        setAddSuccess={setAddSuccess}
      />
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
      {showStudentPerf && (
        <StudentPerformance
          open={showStudentPerf}
          onClose={() => {
            if (showStudentPerf) {
              setShowStudentPerf(undefined);
            }
          }}
          classId={props.courseID}
          student={showStudentPerf}
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
          Student was Successfully Added
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
          Student was Successfully Added
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        open={certEmailSuccess}
        autoHideDuration={3000}
        onClose={() => setCertEmailSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Certificate was Successfully Sent
        </Alert>
      </Snackbar>
    </>
  );
};

export default ClassStudents;
