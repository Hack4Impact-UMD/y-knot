import styles from './CoursesPage.module.css';
import CourseCard from './CourseCard/CourseCard';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

const CoursesPage = (): JSX.Element => {
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

        <h1 className={styles.courseStatus}>Active Courses</h1>
        <div className={styles.cardLayout}>
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
        </div>

        <h1 className={styles.courseStatus}>Past Courses</h1>
        <div className={styles.cardLayout}>
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
        </div>

        <h1 className={styles.courseStatus}>Upcoming Courses</h1>
        <div className={styles.cardLayout}>
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
          <CourseCard teacher="bob" course="1" section="1" />
        </div>
      </div>
    </>
  );
};

export default CoursesPage;
