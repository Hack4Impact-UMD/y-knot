import styles from './CoursesPage.module.css';
import CourseCard from '../../components/CourseCard/CourseCard';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { useAuth } from '../../../src/auth/AuthProvider';
import { Link } from 'react-router-dom';
import { type Course } from '../../types/CourseType';
import { useState, useEffect } from 'react';
import { getAllCourses } from '../../../src/backend/FirestoreCalls';
import { DateTime } from 'luxon';

const CoursesPage = (): JSX.Element => {
  const authContext = useAuth();
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
          (c) => DateTime.fromISO(c.startDate) > now,
        );
        const currentCourses = courses.filter(
          (c) =>
            DateTime.fromISO(c.startDate) <= now &&
            DateTime.fromISO(c.endDate) >= now,
        );
        const pastCourses = courses.filter(
          (c) => DateTime.fromISO(c.endDate) < now,
        );

        setCurrentCourses(currentCourses);
        setPastCourses(pastCourses);
        setUpcomingCourses(upcomingCourses);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const displayCourseCards = (courses: Course[]) => {
    return courses.map((c, i) => {
      let color = colors[i % colors.length];
      const now = DateTime.now();
      if (
        DateTime.fromISO(c.startDate) > now ||
        DateTime.fromISO(c.endDate) < now
      ) {
        color = 'gray';
      }
      return (
        <Link to="/courses/class" key={i} style={{ textDecoration: 'none' }}>
          <CourseCard
            teacher={c.teachers}
            course={c.name}
            section="[Section]"
            startDate={c.startDate}
            endDate={c.endDate}
            color={color}
          />
        </Link>
      );
    });
  };

  return (
    <>
      <NavigationBar />
      <div className={styles.rightPane}>
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
            <>
              <button className={styles.addCourse}>Add Course</button>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className={styles.cardLayout}>
          {displayCourseCards(currentCourses)}
        </div>

        <h1 className={styles.courseStatus}>Past Courses</h1>
        <div className={styles.cardLayout}>
          {displayCourseCards(pastCourses)}
        </div>

        <h1 className={styles.courseStatus}>Upcoming Courses</h1>
        <div className={styles.cardLayout}>
          {displayCourseCards(upcomingCourses)}
        </div>
      </div>
    </>
  );
};

export default CoursesPage;
