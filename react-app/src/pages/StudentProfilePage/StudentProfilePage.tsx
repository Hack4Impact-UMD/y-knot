import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { getStudent, updateStudent } from '../../backend/FirestoreCalls';
import { authenticateUser } from '../../backend/FirebaseCalls';
import { type Student } from '../../types/StudentType';
import styles from './StudentProfilePage.module.css';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import editImage from '../../assets/edit.svg';
import saveImage from '../../assets/save.svg';
import transcriptIcon from '../../assets/transcript.svg';
import CourseCard from '../../components/CourseCard/CourseCard';
import UpdateStudent from './UpdateStudent/UpdateStudent';

const StudentProfilePage = (): JSX.Element => {
  const [edit, setEdit] = useState<boolean>(true);
  const [hasEdited, setHasEdited] = useState<boolean>(false);
  const [student, setStudent] = useState<Student>();
  const [firstName, setFirstName] = useState<string | undefined>(
    student?.firstName,
  );
  const [middleName, setMiddleName] = useState<string | undefined>(
    student?.middleName,
  );
  const [lastName, setLastName] = useState<string | undefined>(
    student?.lastName,
  );
  const [email, setEmail] = useState<string | undefined>(student?.email);
  const [grade, setGrade] = useState<string | undefined>(student?.gradeLevel);
  const [school, setSchool] = useState<string | undefined>(student?.schoolName);
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
              setFirstName(data.firstName);
              setMiddleName(data.middleName);
              setLastName(data.lastName);
              setEmail(data.email);
              setGrade(data.gradeLevel);
              setSchool(data.schoolName);
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

  useEffect(() => {
    if (hasEdited && student != null && studentID) {
      updateStudent(student, studentID);
      setHasEdited(false);
    }
  }, [student]);

  return (
    <>
      <NavigationBar />
      {authContext?.loading || loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.rightPane}>
          <div className={styles.header}>
            <h1 className={styles.title}>Student Profile</h1>

            <div className={styles.topButtons}>
              <button className={styles.button}>
                <img className={styles.icon} src={transcriptIcon} />
              </button>
              <button
                className={styles.button}
                onClick={() => {
                  if (!edit) {
                    setStudent({
                      firstName: firstName || 'undefined',
                      middleName: middleName || '',
                      lastName: lastName || 'undefined',
                      addrFirstLine: student
                        ? student.addrFirstLine
                        : 'undefined',
                      addrSecondLine: student?.addrSecondLine,
                      city: student ? student.city : 'undefined',
                      state: student ? student.state : 'undefined',
                      zipCode: student ? student.zipCode : 0,
                      email: email || 'undefined',
                      birthDate: student ? student.birthDate : 'undefined',
                      minor: student ? student.minor : false,
                      gradeLevel: grade,
                      schoolName: school,
                      courseInformation: student
                        ? student.courseInformation
                        : [],
                    });
                  } else {
                    setHasEdited(true);
                  }
                  setEdit(!edit);
                }}
              >
                <img
                  className={styles.icon}
                  src={edit ? editImage : saveImage}
                />
              </button>
            </div>
          </div>

          <div className={styles.inputs}>
            <div className={styles.box} id="Name">
              <a className={styles.boxTitle}>Name</a>
              <a className={styles.boxData}>
                {!edit ? (
                  <div className={styles.nameInputs}>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setFirstName(event.target.value);
                      }}
                      placeholder="First"
                      value={firstName}
                    ></input>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setMiddleName(event.target.value);
                      }}
                      placeholder="Middle"
                      value={middleName}
                    ></input>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setLastName(event.target.value);
                      }}
                      placeholder="Last"
                      value={lastName}
                    ></input>
                  </div>
                ) : (
                  `${student?.firstName} ${student?.middleName} ${student?.lastName}`
                )}
              </a>
            </div>

            <div className={styles.box} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>
                {!edit ? (
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    value={email}
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
                    className={styles.inputBox}
                    onChange={(event) => {
                      setGrade(event.target.value);
                    }}
                    value={grade}
                  ></input>
                ) : (
                  student?.gradeLevel
                )}
              </a>
            </div>

            <div className={styles.bottomBox} id="School">
              <a className={styles.boxTitle}>School</a>
              <a className={styles.boxData}>
                {!edit ? (
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setSchool(event.target.value);
                    }}
                    value={school}
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
