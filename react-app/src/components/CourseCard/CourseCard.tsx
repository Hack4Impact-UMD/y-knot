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
          backgroundColor: color || '#e3853a',
          color: color ? '#ffffff' : '#000000',
        }}
      >
        <div className={styles.course}>{course}</div>
        <div className={styles.section}>{section}</div>
      </div>
      <div
        className={styles.description}
        style={{
          backgroundColor: color ? '' : '#D9D9D9',
        }}
      >
        {authContext?.token?.claims.role === 'admin' ? teacher : ''}
      </div>
    </div>
  );
};

export default CourseCard;
