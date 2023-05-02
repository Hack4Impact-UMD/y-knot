import { Teacher, type YKNOTUser } from '../../../../types/UserType';
import styles from './TeacherList.module.css';
import { useEffect, useState } from 'react';

interface TeacherListProps {
  teachers: Array<Partial<YKNOTUser>>;
}

const TeacherList = (props: TeacherListProps) => {
  const [teacherList, setTeacherList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const list = props.teachers.map((teacher, i) => {
      const fullName = teacher.name;
      return (
        <div
          key={i}
          className={
            props.teachers.length === 0
              ? styles.teacherBoxTop
              : styles.teacherBox
          }
        >
          <p className={styles.name}>{fullName}</p>
        </div>
      );
    });

    setTeacherList(list);
  }, [props.teachers]);

  return (
    <div>
      {props.teachers.length === 0 ? (
        <h4 className={styles.noTeacher}>No Students currently in Roster</h4>
      ) : teacherList.length === 0 ? (
        <h4 className={styles.noTeacher}>No Teachers</h4>
      ) : (
        <div className={styles.parentContainer}>
          <div className={styles.listBox}>{teacherList}</div>
          <button className={styles.addButton}>Add</button>
        </div>
      )}
    </div>
  );
};

export default TeacherList;
