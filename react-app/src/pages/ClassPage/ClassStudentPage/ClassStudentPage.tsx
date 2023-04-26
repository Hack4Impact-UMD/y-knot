import { useState } from 'react';
import styles from './ClassStudentPage.module.css';
import { useAuth } from '../../../auth/AuthProvider';
import Loading from '../../../components/LoadingScreen/Loading';
import CertificateIcon from '../../../assets/certificate.svg';
import EyeIcon from '../../../assets/view.svg';
import TrashIcon from '../../../assets/trash.svg';

interface StudentInfo {
  name: string;
  email: string;
}

const ClassStudentPage = (): JSX.Element => {
  const [students, setStudents] = useState<StudentInfo[]>([
    { name: 'Fiona Love', email: 'f.love@gmail.com' },
    { name: 'Alicia Jacobs', email: 'a.jacobs@gmail.com' },
    { name: 'Emily Lee', email: 'e.lee@gmail.com' },
    { name: 'Brian Bailey', email: 'b.bailey@gmail.com' },
    { name: 'Ariana Apple', email: 'a.apple@gmail.com' },
    { name: 'Chloe Martinez', email: 'c.martinez@gmail.com' },
  ]);

  const authContext = useAuth();

  return (
    <>
      {authContext?.loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : students.length === 0 ? (
        <h4 className={styles.noStudent}>No Students Currently in Roster</h4>
      ) : (
        // student roster
        <div className={styles.studentsContainer}>
          {students.map((student, i) => {
            let roundTop = i === 0 ? styles.roundTop : '';
            let roundBottom =
              i === students.length - 1 ? styles.roundBottom : '';

            return (
              <div
                key={i}
                className={`${styles.box} ${roundTop} ${roundBottom}`}
              >
                <div className={styles.studentName}>
                  <p>{student.name}</p>
                </div>
                <div className={styles.studentEmail}>
                  <p>{student.email}</p>
                </div>
                <div className={styles.icons}>
                  <img src={CertificateIcon} />
                  {authContext?.token?.claims.role === 'admin' && (
                    <img src={EyeIcon} /> // show student profile icon if admin
                  )}
                  <img src={TrashIcon} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ClassStudentPage;
