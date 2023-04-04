import { useEffect, useState } from 'react';
import { getAllStudents } from '../../../backend/FirestoreCalls';
import { FaTrash } from 'react-icons/fa';
import { Student } from '../../../types/StudentType';
import { ReactComponent as EyeIcon } from '../../../assets/eye.svg';
import styles from './StudentList.module.css';
import { authenticateUser } from '../../../backend/FirebaseCalls';

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    authenticateUser('sgaba@umd.edu', '123abc')
      .then(() =>
        getAllStudents()
          .then((data) =>
            setStudents(data)
          )
          .catch((err) =>
            console.error(err)
          )
      ).catch((err) => {
        console.error(err);
      });

    console.log(students);
  }, []);

  return (
    <div>
      {students.map((student) => (
        <div key={student.firstName} className={styles.studentBox}>
          <p className={styles.name}>
            {student.firstName} {student.lastName}
          </p>
          <span className={styles.icons}>
            <EyeIcon />
            <FaTrash />
          </span>
          <hr className={styles.line} />
        </div>
      ))}
    </div>
  );
};

export default StudentList;