import { TfiTrash } from 'react-icons/tfi';
import { Student } from '../../../types/StudentType';
import { FiEye } from 'react-icons/fi';
import styles from './StudentList.module.css';

const StudentList = (props: {
  name: string;
  rosterSize: number;
  students: Student[];
}) => {
  const { rosterSize, students, name } = props;

  const list = students.map((student) => (
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
  ));

  return (
    <div>
      {rosterSize === 0 ? (
        <h4 className={styles.noStudent}>No Students currently in Roster</h4>
      ) : students.length === 0 ? (
        <h4 className={styles.noStudent}>No Student Found Matching "{name}"</h4>
      ) : (
        list
      )}
    </div>
  );
};

export default StudentList;
