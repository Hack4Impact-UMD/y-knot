import React, { useEffect, useState } from 'react';
import x from '../../../../assets/x.svg';
import Modal from '../../../../components/ModalWrapper/Modal';
import { StudentID } from '../../../../types/StudentType';
import styles from './StudentPerformance.module.css';

const StudentPerformance = ({
  open,
  onClose,
  student,
  classId,
}: any): React.ReactElement => {
  const [currStudent, setCurrStudent] = useState<StudentID | undefined>(
    undefined,
  );
  useEffect(() => {
    setCurrStudent(student);
  }, [student]);

  const handleOnClose = (): void => {
    onClose();
  };

  return (
    <Modal
      open={open}
      height={450}
      onClose={() => {
        handleOnClose();
      }}
    >
      <div>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.close}
            onClick={() => {
              handleOnClose();
            }}
          >
            <img src={x} alt="Close popup" />
          </button>
        </div>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            {currStudent?.firstName +
              ' ' +
              currStudent?.middleName +
              ' ' +
              currStudent?.lastName}
          </h1>
          <h3 className={styles.subHeader}>Attendance</h3>
          {}
          {currStudent?.courseInformation
            .find((course) => course.id === classId)
            ?.attendance.map((attend) => {
              console.log(attend);
              return (
                <div className={styles.subText}>
                  {attend.date +
                    ': ' +
                    (attend.attended ? 'Attended' : 'Did Not Attend')}{' '}
                </div>
              );
            })}
          <h3 className={styles.subHeader}>Homework</h3>
          {currStudent?.courseInformation
            .find((course) => course.id === classId)
            ?.homeworks.map((homework) => {
              return (
                <div className={styles.subText}>
                  {homework.name +
                    ': ' +
                    (homework.completed
                      ? 'Completed'
                      : 'Did Not Complete')}{' '}
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
};

export default StudentPerformance;
