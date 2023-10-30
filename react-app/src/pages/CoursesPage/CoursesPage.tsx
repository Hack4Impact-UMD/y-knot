import { useAuth } from '../../../src/auth/AuthProvider';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Course } from '../../types/CourseType';
import { getAllCourses } from '../../../src/backend/FirestoreCalls';
import { DateTime } from 'luxon';
import styles from './CoursesPage.module.css';
import CourseCard from '../../components/CourseCard/CourseCard';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';

const CoursesPage = (): JSX.Element => {
  const authContext = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [currentCourses, setCurrentCourses] = useState<Course[]>([]);
  const [pastCourses, setPastCourses] = useState<Course[]>([]);
  const [upcomingCourses, setUpcomingCourses] = useState<Course[]>([]);
  const colors = [
    'var(--color-green)',
    'var(--color-orange)',
    'var(--color-blue)',
    'var(--color-red)',
  ];

  useEffect(() => {
    getAllCourses()
      .then((courses) => {
        const now = DateTime.now();
        const upcomingCourses = courses.filter(
          (course) => DateTime.fromISO(course.startDate) > now,
        );
        const currentCourses = courses.filter(
          (course) =>
            DateTime.fromISO(course.startDate) <= now &&
            DateTime.fromISO(course.endDate) >= now,
        );
        const pastCourses = courses.filter(
          (course) => DateTime.fromISO(course.endDate) < now,
        );

        setCurrentCourses(currentCourses);
        setPastCourses(pastCourses);
        setUpcomingCourses(upcomingCourses);
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const displayCourseCards = (courses: Course[]) => {
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

  return (
    <>
      {authContext.loading ? (
        // Used to center the loading spinner
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : (
        <>
          <NavigationBar />
          <div className={styles.rightPane}>
            {loading ? (
              <div className={styles.message}>
                <Loading />
              </div>
            ) : error ? (
              <h4 className={styles.message}>
                Error retrieving courses. Please try again later.
              </h4>
            ) : (
              <>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search Courses"
                    onChange={(event) => {
                      // TODO: Connect backend
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        // TODO: Connect backend
                      }
                    }}
                    className={styles.searchBar}
                  />
                </div>

                <div className={styles.courseHeader}>
                  <h1 className={styles.courseStatus}>Active Courses</h1>

                  {authContext?.token?.claims.role === 'ADMIN' ? (
                    <button className={styles.addCourse}>Add Course</button>
                  ) : (
                    <></>
                  )}
                </div>

                <div className={styles.cardLayout}>
                  {displayCourseCards(currentCourses)}
                </div>

                {authContext?.token?.claims.role != 'TEACHER' ? (
                  <>
                    <h1 className={styles.courseStatus}>Past Courses</h1>
                    <div className={styles.cardLayout}>
                      {displayCourseCards(pastCourses)}
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <h1 className={styles.courseStatus}>Upcoming Courses</h1>
                <div className={styles.cardLayout}>
                  {displayCourseCards(upcomingCourses)}
                </div>
              </>
            )}
          </div>
        </>
      )}
      ;
    </>
  );
};

export default CoursesPage;
