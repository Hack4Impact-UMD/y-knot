import { Student } from '../../../types/StudentType';
import { ReactComponent as EyeIcon } from '../../../assets/view.svg';
import { ReactComponent as TrashIcon } from '../../../assets/trash.svg';
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
        <EyeIcon />
        <TrashIcon />
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
