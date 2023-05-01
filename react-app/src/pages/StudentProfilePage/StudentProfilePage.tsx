import { useEffect, useState } from 'react';
import styles from './StudentProfilePage.module.css';
import { MdEdit } from 'react-icons/md';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import editImage from '../../assets/edit.svg';
import saveImage from '../../assets/save.svg';
import transcript from '../../assets/transcript.svg';
import CourseCard from '../../components/CourseCard/CourseCard';
import UpdateStudent from './UpdateStudent/UpdateStudent';
import { useParams } from 'react-router-dom';
import { getStudent, updateStudent } from '../../backend/FirestoreCalls';
import { authenticateUser } from '../../backend/FirebaseCalls';
import { type Student } from '../../types/StudentType';

const StudentProfilePage = (): JSX.Element => {
  const [edit, setEdit] = useState(true);
  const [student, setStudent] = useState<Student>();
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(student?.firstName);
  const [email, setEmail] = useState(student?.email);
  const [grade, setGrade] = useState(student?.gradeLevel);
  const [school, setSchool] = useState(student?.schoolName);
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
            <button
              className={styles.editButton}
              onClick={() => {
                if (!edit) {
                  setStudent({
                    firstName: name || 'undefined',
                    middleName: student?.middleName,
                    lastName: student != null ? student.lastName : 'undefined',
                    addrFirstLine:
                      student != null ? student.addrFirstLine : 'undefined',
                    addrSecondLine: student?.addrSecondLine,
                    city: student != null ? student.city : 'undefined',
                    state: student != null ? student.state : 'undefined',
                    zipCode: student != null ? student.zipCode : 0,
                    email: email || 'undefined',
                    birthDate:
                      student != null ? student.birthDate : 'undefined',
                    minor: student != null ? student.minor : false,
                    gradeLevel: grade,
                    schoolName: school,
                    courseInformation:
                      student != null ? student.courseInformation : [],
                  });
                  if (student != null && studentID) {
                    updateStudent(student, studentID);
                  }
                }
                setEdit(!edit);
              }}
            >
              <img src={edit ? editImage : saveImage} />
            </button>
            <button className={styles.transcriptButton}>
              <img src={transcript} />
            </button>
          </div>

          <div className={styles.inputs}>
            <div className={styles.box} id="Name">
              <a className={styles.boxTitle}>Name</a>
              <a className={styles.boxData}>
                {!edit ? (
                  <input
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  ></input>
                ) : (
                  `${student?.firstName} ${student?.lastName}`
                )}
              </a>
            </div>
            <div className={styles.box} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>
                {!edit ? (
                  <input
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  ></input>
                ) : (
                  student?.email
                )}
              </a>
            </div>

            <div className={styles.box} id="Grade">
              <a className={styles.boxTitle}>Grade</a>
              <a className={styles.boxData}>
                {!edit ? (
                  <input
                    onChange={(event) => {
                      setGrade(event.target.value);
                    }}
                  ></input>
                ) : (
                  student?.gradeLevel
                )}
              </a>
            </div>
            <div className={styles.bottomBox} id="Password">
              <a className={styles.boxTitle}>School</a>
              <a className={styles.boxData}>
                {!edit ? (
                  <input
                    onChange={(event) => {
                      setSchool(event.target.value);
                    }}
                  ></input>
                ) : (
                  student?.schoolName
                )}
              </a>
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