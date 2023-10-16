import { useAuth } from '../../../src/auth/AuthProvider';
import styles from './CourseCard.module.css';

interface courseDetails {
  teacher: string[];
  course: string;
  section: string;
  color?: string;
  startDate: string;
  endDate: string;
}

const CourseCard = ({
  teacher,
  course,
  section,
  color,
}: courseDetails): JSX.Element => {
  const authContext = useAuth();

  return (
    <div className={styles.container}>
      <div
        className={styles.background}
        style={{
          backgroundColor: color || 'var(--color-orange)',
        }}
      >
        <div className={styles.course}>{course}</div>
        <div className={styles.section}>{section}</div>
      </div>
      <div className={styles.description}>
        {authContext?.token?.claims.role === 'ADMIN' ? teacher : ''}
      </div>
    </div>
  );
};

export default CourseCard;
