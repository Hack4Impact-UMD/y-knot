import { TfiTrash } from 'react-icons/tfi';
import { Student } from '../../../types/StudentType';
import { FiEye } from 'react-icons/fi';
import styles from './StudentList.module.css';

const StudentList = (props: { students: Student[] }) => {
  const { students } = props;

  return (
    <div>
      {students.map((student) => (
        <div key={student.firstName} className={styles.studentBox}>
          <p className={styles.name}>
            {student.firstName} {student.lastName}
          </p>
          <span className={styles.icons}>
            <FiEye size={28} />
            <TfiTrash size={28} />
          </span>
          <hr className={styles.line} />
        </div>
      ))}
    </div>
  );
};

export default StudentList;
