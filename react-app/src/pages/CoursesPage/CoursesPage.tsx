import styles from './CoursesPage.module.css';
import CourseCard from './CourseCard/CourseCard';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { useAuth } from '../../../src/auth/AuthProvider';
import { Link } from 'react-router-dom';

const CoursesPage = (): JSX.Element => {
  const authContext = useAuth();

  const colors = ['#5a9447', '#e3853a', '#2613b6', '#d00110'];
  const courses = [
    { teacher: '[Teacher Name]', course: 'Math II', section: '[Section]' },
    { teacher: '[Teacher Name]', course: 'Math II', section: '[Section]' },
    { teacher: '[Teacher Name]', course: 'Math II', section: '[Section]' },
    { teacher: '[Teacher Name]', course: 'Math II', section: '[Section]' },
    { teacher: '[Teacher Name]', course: 'Math II', section: '[Section]' },
    { teacher: '[Teacher Name]', course: 'Math II', section: '[Section]' },
  ];
  let i = -1;
  const currentCards = courses.map((c) => {
    i++;
    return (
      <Link to="/courses/class" style={{ textDecoration: 'none' }}>
        <CourseCard
          key={i}
          teacher={c.teacher}
          course={c.course}
          section={c.section}
          color={colors[i % colors.length]}
        />
      </Link>
    );
  });
  i = -1;
  const pastCards = courses.map((c) => {
    i++;
    return (
      <Link to="/courses/class" style={{ textDecoration: 'none' }}>
        <CourseCard
          key={i}
          teacher={c.teacher}
          course={c.course}
          section={c.section}
        />
      </Link>
    );
  });

  i = -1;
  const upcomingCards = courses.map((c) => {
    i++;
    return (
      <Link to="/courses/class" style={{ textDecoration: 'none' }}>
        <CourseCard
          key={i}
          teacher={c.teacher}
          course={c.course}
          section={c.section}
        />
      </Link>
    );
  });

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

          {authContext?.token?.claims.role === 'admin' ? (
            <>
              <button className={styles.addCourse}>Add Course</button>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className={styles.cardLayout}>{currentCards}</div>

        <h1 className={styles.courseStatus}>Past Courses</h1>
        <div className={styles.cardLayout}>{pastCards}</div>

        <h1 className={styles.courseStatus}>Upcoming Courses</h1>
        <div className={styles.cardLayout}>{upcomingCards}</div>
      </div>
    </>
  );
};

export default CoursesPage;
