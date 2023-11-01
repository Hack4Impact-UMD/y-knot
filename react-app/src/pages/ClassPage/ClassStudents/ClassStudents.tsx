import { useState } from 'react';
import { useAuth } from '../../../auth/AuthProvider';
import { Link } from 'react-router-dom';
import styles from './ClassStudents.module.css';
import Loading from '../../../components/LoadingScreen/Loading';
import CertificateIcon from '../../../assets/certificate.svg';
import EyeIcon from '../../../assets/view.svg';
import TrashIcon from '../../../assets/trash.svg';

interface StudentInfo {
  name: string;
  email: string;
  id: string;
}

const ClassStudents = (): JSX.Element => {
  const [students, setStudents] = useState<StudentInfo[]>([
    { name: 'Fiona Love', email: 'f.love@gmail.com', id: 'test' },
    { name: 'Alicia Jacobs', email: 'a.jacobs@gmail.com', id: 'test' },
    { name: 'Emily Lee', email: 'e.lee@gmail.com', id: 'test' },
    { name: 'Brian Bailey', email: 'b.bailey@gmail.com', id: 'test' },
    { name: 'Ariana Apple', email: 'a.apple@gmail.com', id: 'test' },
    { name: 'Chloe Martinez', email: 'c.martinez@gmail.com', id: 'test' },
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
            const roundTop = i === 0 ? styles.roundTop : '';
            const roundBottom =
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
                  <button className={styles.button}>
                    <img
                      src={CertificateIcon}
                      className={styles.certificateIcon}
                    />
                  </button>
                  {authContext?.token?.claims.role === 'ADMIN' && (
                    // See student profile only if admin
                    <Link to={`/students/${student.id}`}>
                      <button className={styles.button}>
                        <img src={EyeIcon} className={styles.profileIcon} />
                      </button>
                    </Link>
                  )}
                  <button className={styles.button}>
                    <img src={TrashIcon} className={styles.trashIcon} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ClassStudents;
