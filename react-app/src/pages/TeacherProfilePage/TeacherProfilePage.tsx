import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import {
  updateUser,
  getTeacher,
  getCourse,
} from '../../backend/FirestoreCalls';
import { type Teacher } from '../../types/UserType';
import type { CourseID } from '../../types/CourseType';
import { DateTime } from 'luxon';
import { ToolTip } from '../../components/ToolTip/ToolTip';
import styles from './TeacherProfilePage.module.css';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import CourseCard from '../../components/CourseCard/CourseCard';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import editImage from '../../assets/edit.svg';
import saveImage from '../../assets/save.svg';

const colors = [
  'var(--color-green)',
  'var(--color-orange)',
  'var(--color-blue)',
  'var(--color-red)',
];

const blankTeacher: Teacher = {
  name: '',
  auth_id: '',
  email: '',
  type: 'TEACHER',
  courses: [],
};

const compareLuxonDates = (course1: CourseID, course2: CourseID): number => {
  return (
    DateTime.fromISO(course1.startDate).toMillis() -
    DateTime.fromISO(course2.startDate).toMillis()
  );
};

const TeacherProfilePage = (): JSX.Element => {
  const [courses, setCourses] = useState<CourseID[]>([]);
  const [pageError, setPageError] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<Teacher>(blankTeacher);
  const [loading, setLoading] = useState<boolean>(true);
  const authContext = useAuth();
  const teacherID = useParams().id;

  useEffect(() => {
    if (teacherID) {
      getTeacher(teacherID)
        .then(async (data) => {
          setLoading(false);
          setTeacher(data || blankTeacher);
          if (data.courses) {
            const dataCourses = await Promise.all(
              data.courses.map(async (course) => {
                let courseResp = await getCourse(course);
                return { ...courseResp, id: course };
              }),
            ).catch(() => {
              setPageError(true);
            });
            setCourses(dataCourses!);
          }
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setPageError(true);
        });
    }
  }, []);

  const displayCourseCards = () => {
    let inSession: CourseID[] = [];
    let notInSession: CourseID[] = [];
    courses.forEach((course) => {
      const now = DateTime.now();
      let isInSession = true;
      if (
        DateTime.fromISO(course.startDate) > now ||
        DateTime.fromISO(course.endDate) < now.minus({ days: 1 })
      ) {
        isInSession = false;
      }
      if (isInSession) {
        inSession.push(course);
      } else {
        notInSession.push(course);
      }
    });

    inSession.sort(compareLuxonDates);
    notInSession.sort(compareLuxonDates);
    return inSession.concat(notInSession).map((course, i) => {
      let color = colors[i % colors.length];
      const now = DateTime.now();
      if (
        DateTime.fromISO(course.startDate) > now ||
        DateTime.fromISO(course.endDate) < now.minus({ days: 1 })
      ) {
        color = 'gray';
      }
      return (
        <Link to={`/courses/${course.id}`} key={i} className={styles.card}>
          <CourseCard
            teacher={course.teachers}
            course={course.name}
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
      ) : (
        <div className={styles.rightPane}>
          <div className={styles.header}>
            <h1 className={styles.title}>Teacher Profile</h1>

            {authContext?.token?.claims.role === 'ADMIN' ? (
              <div className={styles.topButtons}>
                <ToolTip title={editing ? 'Save' : 'Edit'} placement="top">
                  <button
                    className={styles.button}
                    onClick={() => {
                      if (editing) {
                        if (teacher.name == '') {
                          setInvalidName(true);
                        } else {
                          updateUser(teacher, teacherID!)
                            .catch(() => {
                              window.location.reload();
                            })
                            .finally(() => {
                              setEditing(!editing);
                            });
                        }
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
                </ToolTip>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className={styles.inputs}>
            <div className={styles.box} id="Name">
              <a className={styles.boxTitle}>Name</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.group}>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setTeacher({ ...teacher, name: event.target.value });
                      }}
                      value={teacher.name}
                    ></input>
                    {invalidName ? (
                      <div className={styles.errorMessage}>*Required</div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  teacher.name
                )}
              </a>
            </div>
            <div className={styles.bottomBox} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>{teacher.email}</a>
            </div>
          </div>

          <h1 className={styles.coursesTitle}>Courses</h1>
          <div className={styles.courseList}>{displayCourseCards()}</div>
        </div>
      )}
    </>
  );
};

export default TeacherProfilePage;
