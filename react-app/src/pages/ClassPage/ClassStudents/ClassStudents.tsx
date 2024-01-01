import { useState } from 'react';
import { useAuth } from '../../../auth/AuthProvider';
import { Link } from 'react-router-dom';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import type { StudentID } from '../../../types/StudentType';
import styles from './ClassStudents.module.css';
import Loading from '../../../components/LoadingScreen/Loading';
import CertificateIcon from '../../../assets/certificate.svg';
import EyeIcon from '../../../assets/view.svg';
import TrashIcon from '../../../assets/trash.svg';

const ClassStudents = (props: { students: Array<StudentID> }): JSX.Element => {
  const authContext = useAuth();

  return (
    <>
      {authContext?.loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : props.students.length === 0 ? (
        <h4 className={styles.noStudent}>No Students Currently in Roster</h4>
      ) : (
        // student roster
        <div className={styles.studentsContainer}>
          {props.students.map((student, i) => {
            const roundTop = i === 0 ? styles.roundTop : '';
            const roundBottom =
              i === props.students.length - 1 ? styles.roundBottom : '';

            return (
              <div
                key={i}
                className={`${styles.box} ${roundTop} ${roundBottom}`}
              >
                <div className={styles.studentName}>
                  <p>{`${student.firstName} ${student.lastName}`}</p>
                </div>
                <div className={styles.studentEmail}>
                  <p>{student.email}</p>
                </div>
                <div className={styles.icons}>
                  <ToolTip title="Send Certificate" placement="top">
                    <button className={styles.button}>
                      <img
                        src={CertificateIcon}
                        className={styles.certificateIcon}
                      />
                    </button>
                  </ToolTip>
                  {authContext?.token?.claims.role === 'ADMIN' && (
                    // See student profile only if admin
                    <Link to={`/students/${student.id}`}>
                      <ToolTip title="View Profile" placement="top">
                        <button className={styles.button}>
                          <img src={EyeIcon} className={styles.profileIcon} />
                        </button>
                      </ToolTip>
                    </Link>
                  )}
                  <ToolTip title="Remove" placement="top">
                    <button className={styles.button}>
                      <img src={TrashIcon} className={styles.trashIcon} />
                    </button>
                  </ToolTip>
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
