import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import {
  getStudent,
  updateStudent,
  getCourse,
} from '../../backend/FirestoreCalls';
import { type Student } from '../../types/StudentType';
import styles from './StudentProfilePage.module.css';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import editImage from '../../assets/edit.svg';
import saveImage from '../../assets/save.svg';
import transcriptIcon from '../../assets/transcript.svg';
import CourseCard from '../../components/CourseCard/CourseCard';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import CoursesPage from '../CoursesPage/CoursesPage';
import { Course } from '../../types/CourseType';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

const StudentProfilePage = (): JSX.Element => {
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [pageError, setPageError] = useState<boolean>(false);
  const blankStudent: Student = {
    firstName: '',
    middleName: '',
    lastName: '',
    addrFirstLine: '',
    city: '',
    state: '',
    zipCode: 0,
    email: '',
    phone: 0,
    guardianFirstName: '',
    guardianLastName: '',
    birthDate: '',
    gradeLevel: '',
    schoolName: '',
    courseInformation: [],
  };
  const [student, setStudent] = useState<Student>(blankStudent);
  const authContext = useAuth();
  const studentID = useParams().id;
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const colors = [
    'var(--color-green)',
    'var(--color-orange)',
    'var(--color-blue)',
    'var(--color-red)',
  ];

  useEffect(() => {
    if (studentID) {
      getStudent(studentID)
        .then(async (data) => {
          setStudent(data || blankStudent);
          if (data.courseInformation) {
            let dataCourses = await Promise.all(
              data.courseInformation.map(async (course) => {
                let courseResp = await getCourse(course.id);
                return courseResp;
              }),
            ).catch(() => {
              setError(true);
              setPageError(true);
            });
            setCourses(dataCourses!);
          }
        })
        .catch(() => {
          setError(true);
          setPageError(true);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const displayCourseCards = () => {
    return courses.map((course, i) => {
      let color = colors[i % colors.length];
      const now = DateTime.now();
      if (
        DateTime.fromISO(course.startDate) > now ||
        DateTime.fromISO(course.endDate) < now
      ) {
        color = 'gray';
      }
      return (
        <Link to="/courses/class" key={i} className={styles.card}>
          <CourseCard
            teacher={course.teachers}
            course={course.name}
            section={course.meetingTime}
            startDate={course.startDate}
            endDate={course.endDate}
            color={color}
          />
        </Link>
      );
    });
  };

  if (pageError) {
    return <NotFoundPage />;
  }

  return (
    <>
      <NavigationBar />
      {authContext?.loading || loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : error ? (
        <div className={styles.loadingContainer}>
          <h4 className={styles.errorMessage}>
            Error obtaining student's profile. Please try again later.
          </h4>
        </div>
      ) : (
        <div className={styles.rightPane}>
          <div className={styles.header}>
            <h1 className={styles.title}>Student Profile</h1>

            <div className={styles.topButtons}>
              <button
                className={styles.button}
                onClick={() => {
                  navigate('/transcript');
                }}
              >
                <img className={styles.icon} src={transcriptIcon} />
              </button>
              <button
                className={styles.button}
                onClick={() => {
                  if (editing) {
                    updateStudent(student, studentID!)
                      .catch(() => {
                        window.location.reload();
                      })
                      .finally(() => {
                        setEditing(!editing);
                      });
                  } else {
                    setEditing(!editing);
                  }
                }}
              >
                <img
                  className={styles.icon}
                  src={editing ? saveImage : editImage}
                />
              </button>
            </div>
          </div>

          <div className={styles.inputs}>
            <div className={styles.box} id="Name">
              <a className={styles.boxTitle}>Name</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.nameInputs}>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setStudent({
                          ...student,
                          firstName: event.target.value,
                        });
                      }}
                      placeholder="First"
                      value={student.firstName}
                    ></input>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setStudent({
                          ...student,
                          middleName: event.target.value,
                        });
                      }}
                      placeholder="Middle"
                      value={student.middleName}
                    ></input>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setStudent({
                          ...student,
                          lastName: event.target.value,
                        });
                      }}
                      placeholder="Last"
                      value={student.lastName}
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
                {editing ? (
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setStudent({ ...student, email: event.target.value });
                    }}
                    value={student.email}
                  ></input>
                ) : (
                  student?.email
                )}
              </a>
            </div>

            <div className={styles.box} id="Grade">
              <a className={styles.boxTitle}>Grade</a>
              <a className={styles.boxData}>
                {editing ? (
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setStudent({
                        ...student,
                        gradeLevel: event.target.value,
                      });
                    }}
                    value={student.gradeLevel}
                  ></input>
                ) : (
                  student?.gradeLevel
                )}
              </a>
            </div>

            <div className={styles.bottomBox} id="School">
              <a className={styles.boxTitle}>School</a>
              <a className={styles.boxData}>
                {editing ? (
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setStudent({
                        ...student,
                        schoolName: event.target.value,
                      });
                    }}
                    value={student.schoolName}
                  ></input>
                ) : (
                  student?.schoolName
                )}
              </a>
            </div>
          </div>

          <h1 className={styles.coursesTitle}>Courses</h1>
          <div className={styles.courseList}>{displayCourseCards()}</div>
        </div>
      )}
    </>
  );
};

export default StudentProfilePage;
