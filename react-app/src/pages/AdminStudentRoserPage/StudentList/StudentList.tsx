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

  const list = students.map(
    (student, i) => (
      <div
        key={student.firstName}
        className={
          i === rosterSize - 1 ? styles.studentBoxBottom : styles.studentBox
        }
      >
        <p className={styles.name}>
          {student.firstName} {student.lastName}
        </p>
        <div className={styles.icons}>
          <EyeIcon />
          <TrashIcon />
        </div>
      </div>
    ),
    // { i === rosterSize ? (
    //   <div key={student.firstName} className={styles.studentBoxBottom}>
    //     <p className={styles.name}>
    //       {student.firstName} {student.lastName}
    //     </p>
    //     <div className={styles.icons}>
    //       <EyeIcon />
    //       <TrashIcon />
    //     </div>
    //   </div>
    // ) : (
    //   <div key={student.firstName}>
    //     <p className={styles.name}>
    //       {student.firstName} {student.lastName}
    //     </p>
    //     <div className={styles.icons}>
    //       <EyeIcon />
    //       <TrashIcon />
    //     </div>
    //   </div>
    // );}
  );

  return (
    <div>
      {rosterSize === 0 ? (
        <h4 className={styles.noStudent}>No Students currently in Roster</h4>
      ) : students.length === 0 ? (
        <h4 className={styles.noStudent}>No Student Found Matching "{name}"</h4>
      ) : (
        <div className={styles.listBox}>{list}</div>
      )}
    </div>
  );
};

export default StudentList;
