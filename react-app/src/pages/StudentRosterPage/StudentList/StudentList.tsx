import { useEffect, useState } from 'react';
import { type StudentID } from '../../../types/StudentType';
import { Link } from 'react-router-dom';
import styles from './StudentList.module.css';
import eyeIcon from '../../../assets/view.svg';
import trashIcon from '../../../assets/trash.svg';

const StudentList = (props: {
  search: string;
  students: Array<Partial<StudentID>>;
}) => {
  const [studentList, setStudentList] = useState<any[]>([]);
  useEffect(() => {
    const list = props.students.reduce((result: any[], student, i) => {
      const firstName = student.firstName ? student.firstName + ' ' : '';
      const middleName = student.middleName ? student.middleName + ' ' : '';
      const lastName = student.lastName ? student.lastName + ' ' : '';
      const fullName = firstName + middleName + lastName;
      if (fullName.toLowerCase().includes(props.search.toLowerCase())) {
        result.push(
          <div
            key={i}
            className={
              result.length === 0 ? styles.studentBoxTop : styles.studentBox
            }
          >
            <p className={styles.name}>{fullName}</p>
            <div className={styles.icons}>
              <Link to={`/student/${student.id}`}>
                <button className={`${styles.button} ${styles.profileIcon}`}>
                  <img src={eyeIcon} alt="View Profile" />
                </button>
              </Link>
              <button className={`${styles.button} ${styles.trashIcon}`}>
                <img src={trashIcon} alt="Delete Student" />
              </button>
            </div>
          </div>,
        );
      }

      return result;
    }, []);
    setStudentList(list);
  }, [props.search]);

  return (
    <>
      {props.students.length === 0 ? (
        <h4 className={styles.noStudent}>No Students Currently in Roster</h4>
      ) : studentList.length === 0 ? (
        <h4 className={styles.noStudent}>
          No Student Found Matching "{props.search}"
        </h4>
      ) : (
        <div className={styles.listBox}>{studentList}</div>
      )}
    </>
  );
};

export default StudentList;
