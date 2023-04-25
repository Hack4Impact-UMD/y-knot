import { useEffect, useState } from 'react';
import styles from './StudentProfilePage.module.css';
import { MdEdit } from 'react-icons/md';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import edit from '../../assets/edit.svg';
import transcript from '../../assets/transcript.svg';
import CourseCard from '../../components/CourseCard/CourseCard';
import UpdateStudent from './UpdateStudent/UpdateStudent';
import { useParams } from 'react-router-dom';
import { getStudent } from '../../backend/FirestoreCalls';
import { authenticateUser } from '../../backend/FirebaseCalls';
import { Student } from '../../types/StudentType';

const StudentProfilePage = (): JSX.Element => {
  const [student, setStudent] = useState<Student>();
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState('Fiona Love');
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const authContext = useAuth();

  const studentID = useParams().id;

  useEffect(() => {
    if (studentID) {
      authenticateUser('sgaba@umd.edu', '123abc')
        .then(() =>
          getStudent(studentID)
            .then((data) => {
              setStudent(data);
              setLoading(false);
            })
            .catch((err) => {
              console.error(err);
              setLoading(false);
            }),
        )
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  return (
    <>
      <NavigationBar />
      {authContext?.loading ? (
        <div className={styles.container}>
          <Loading />
        </div>
      ) : loading ? (
        <Loading />
      ) : (
        <div className={styles.settings}>
          <h1 className={styles.title}>Student Profile</h1>

          <div className={styles.topButtons}>
            <button className={styles.editButton}
                    onClick={() => {
                      setOpenEmailModal(!openEmailModal);
                    }}>
              <img src={edit} />
            </button>
            <UpdateStudent             
                open={openEmailModal}
                onClose={() => {
                  setOpenEmailModal(!openEmailModal);
                }}
              />
            <button className={styles.transcriptButton}>
              <img src={transcript} />
            </button>

          </div>

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

            <div className={styles.box} id="Name">
              <a className={styles.boxTitle}>Name</a>
              <a
                className={styles.boxData}
              >{`${student?.firstName} ${student?.lastName}`}</a>
            </div>
            <div className={styles.box} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>{student?.email}</a>
            </div>

            <div className={styles.box} id="Grade">
              <a className={styles.boxTitle}>Grade</a>
              <a className={styles.boxData}>{student?.gradeLevel}</a>
            </div>
            <div className={styles.bottomBox} id="Password">
              <a className={styles.boxTitle}>School</a>
              <a className={styles.boxData}>{student?.schoolName}</a>
            </div>
          </div>
          <h1 className={styles.coursesTitle}>Courses</h1>
          <div className={styles.courseList}>
            <CourseCard teacher="bob" course="1" section="1" />
            <CourseCard teacher="bob" course="1" section="1" />
            <CourseCard teacher="bob" course="1" section="1" />
            <CourseCard teacher="bob" course="1" section="1" />
          </div>
        </div>
      )}
    </>
  );
};

export default StudentProfilePage;
