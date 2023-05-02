import { useState, useEffect } from 'react';
import { getAllTeachers } from '../../../backend/FirestoreCalls';
import { type YKNOTUser, type Role, Teacher } from '../../../types/UserType';
import TeacherList from './TeacherList/TeacherList';
import NavigationBar from '../../../components/NavigationBar/NavigationBar';
import Loading from '../../../components/LoadingScreen/Loading';
import { useAuth } from '../../../auth/AuthProvider';
import styles from '../ClassTeachers/ClassTeachers.module.css';

interface PartialUser {
  auth_id: string;
  name: string;
  type: Role;
}

const AdminTeacherRosterPage = (): JSX.Element => {
  const [teachers, setTeachers] = useState<Array<Partial<YKNOTUser>>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const auth = useAuth();

  useEffect(() => {
    getAllTeachers()
      .then((allTeachers) => {
        const partialTeachers: Array<Partial<YKNOTUser>> = allTeachers.map(
          (currTeacher) => ({
            name: currTeacher.name,
            auth_id: currTeacher.auth_id,
            type: currTeacher.type,
            userInfo: currTeacher.userInfo,
          }),
        );
        setTeachers(partialTeachers);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  return (
    <div className={styles.parentContainer}>
      {auth.loading ? (
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : (
        <>
          <NavigationBar />
          <div className={styles.rightPane}>
            <TeacherList teachers={teachers} />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminTeacherRosterPage;
