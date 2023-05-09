import { useEffect, useState } from 'react';
import { type StudentID } from '../../../types/StudentType';
import { Link } from 'react-router-dom';
import styles from './TeacherList.module.css';
import eyeIcon from '../../../assets/view.svg';
import trashIcon from '../../../assets/trash.svg';
import { TeacherID } from '../../../types/UserType';
import { deleteUser } from '../../../backend/CloudFunctionsCalls';

const TeacherList = (props: {
  search: string;
  teachers: Array<Partial<TeacherID>>;
}) => {
  const [studentList, setStudentList] = useState<any[]>([]);
  useEffect(() => {
    const list = props.teachers.reduce((result: any[], teacher, i) => {
      const fullName = teacher.name!;
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
              <Link to={`/teacher/${teacher.id}`}>
                <button className={`${styles.button} ${styles.profileIcon}`}>
                  <img src={eyeIcon} alt="View Profile" />
                </button>
              </Link>
              <button
                className={`${styles.button} ${styles.trashIcon}`}
                onClick={() =>
                  deleteUser(teacher?.auth_id!).then(() => {
                    window.location.reload();
                  })
                }
              >
                <img src={trashIcon} alt="Delete Teacher" />
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
      {props.teachers.length === 0 ? (
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

export default TeacherList;
