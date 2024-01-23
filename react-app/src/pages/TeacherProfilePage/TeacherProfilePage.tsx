import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { getTeacher } from '../../backend/FirestoreCalls';
import { type Teacher } from '../../types/UserType';
import { getCourse } from '../../backend/FirestoreCalls';
import type { CourseID } from '../../types/CourseType';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import styles from './TeacherProfilePage.module.css';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import CourseCard from '../../components/CourseCard/CourseCard';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

const colors = [
  'var(--color-green)',
  'var(--color-orange)',
  'var(--color-blue)',
  'var(--color-red)',
];

const compareLuxonDates = (course1: CourseID, course2: CourseID): number => {
  return (
    DateTime.fromISO(course1.startDate).toMillis() -
    DateTime.fromISO(course2.startDate).toMillis()
  );
};

const TeacherProfilePage = (): JSX.Element => {
  const [teacher, setTeacher] = useState<Teacher>();
  const [courses, setCourses] = useState<CourseID[]>([]);
  const [editName, setEditName] = useState<boolean>(false);
  const [pageError, setPageError] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const authContext = useAuth();
  const teacherID = useParams().id;

  useEffect(() => {
    if (teacherID) {
      getTeacher(teacherID)
        .then(async (data) => {
          setTeacher(data);
          setLoading(false);
          setName(data.name!);
          setEmail(data.email!);
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
        DateTime.fromISO(course.endDate) < now
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
        DateTime.fromISO(course.endDate) < now
      ) {
        color = 'gray';
      }
      return (
        <Link
          to={`/courses/class/${course.id}`}
          key={i}
          className={styles.card}
        >
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
        <div className={styles.container}>
          <Loading />
        </div>
      ) : loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.rightPane}>
          <h1 className={styles.title}>Teacher Profile</h1>

          <div className={styles.inputs}>
            <div className={styles.box} id="Name">
              <a className={styles.boxTitle}>Name</a>
              <a className={styles.boxData}>{name}</a>
            </div>
            <div className={styles.bottomBox} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>{email}</a>
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
