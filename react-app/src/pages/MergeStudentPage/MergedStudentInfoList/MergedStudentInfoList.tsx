import React from 'react';
import styles from './MergedStudentInfoList.module.css';
import { Student } from '../../../types/StudentType';
import { BsX } from 'react-icons/bs';

const MergedStudentInfoList = (props: { mergedStudent: Student }) => {
  return (
    <div className={styles.inputs}>
      <div className={`${styles.box} ${styles.roundTop}`}>
        <p className={styles.boxTitle}>Name</p>
        <p className={styles.boxContent}>
          {`${props.mergedStudent.firstName} ${props.mergedStudent.lastName}`}
        </p>
        <div className={styles.selectedAttribute}>
          Student A
          <BsX size={20} />
        </div>
      </div>
      <div className={styles.box}>
        <p className={styles.boxTitle}>Email</p>
        <p className={styles.boxContent}>{props.mergedStudent.email}</p>
        <div className={styles.selectedAttribute}>
          Student A
          <BsX size={20} />
        </div>
      </div>
      <div className={styles.box}>
        <p className={styles.boxTitle}>Grade</p>
        <p className={styles.boxContent}>
          {props.mergedStudent.gradeLevel ?? 'No Given Grade'}
        </p>
        <div className={styles.selectedAttribute}>
          Student A
          <BsX size={20} />
        </div>
      </div>
      <div className={`${styles.box} ${styles.roundBottom}`}>
        <p className={styles.boxTitle}>School</p>
        <p className={styles.boxContent}>
          {props.mergedStudent.schoolName ?? 'No Given School'}
        </p>
        <div className={styles.selectedAttribute}>
          Student A
          <BsX size={20} />
        </div>
      </div>
    </div>
  );
};

export default MergedStudentInfoList;
