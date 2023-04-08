import CourseCard from './CourseCard/CourseCard';
import styles from './CoursesPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

const CoursesPage = (): JSX.Element => {
  return (
    <div className={styles.gridContainer}>
      <NavigationBar />
      <div className={styles.rightPane}>
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
    </div>
  );
};

export default CoursesPage;
