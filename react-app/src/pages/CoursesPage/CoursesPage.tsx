import CourseCard from '../../components/CourseCard/CourseCard';
import styles from './CoursesPage.module.css';

const CoursesPage = (): JSX.Element => {
  return (
    <div className={styles.rightPane}>
      <h1 className={styles.courseStatus}>Active Courses</h1>
      <div className={styles.cardLayout}>
        <CourseCard teacher="bob" course="1" section="1" />
        <CourseCard teacher="bob" course="1" section="1" />
        <CourseCard teacher="bob" course="1" section="1" />
      </div>
      <div className={styles.cardLayout}>
        <CourseCard teacher="bob" course="1" section="1" />
        <CourseCard teacher="bob" course="1" section="1" />
      </div>

      <h1 className={styles.courseStatus}>Past Courses</h1>
      <div className={styles.cardLayout}>
        <CourseCard teacher="bob" course="1" section="1" />
        <CourseCard teacher="bob" course="1" section="1" />
        <CourseCard teacher="bob" course="1" section="1" />
      </div>
      <div className={styles.cardLayout}>
        <CourseCard teacher="bob" course="1" section="1" />
        <CourseCard teacher="bob" course="1" section="1" />
      </div>

      <h1 className={styles.courseStatus}>Upcoming Courses</h1>
      <div className={styles.cardLayout}>
        <CourseCard teacher="bob" course="1" section="1" />
        <CourseCard teacher="bob" course="1" section="1" />
      </div>
    </div>
  );
};

export default CoursesPage;
