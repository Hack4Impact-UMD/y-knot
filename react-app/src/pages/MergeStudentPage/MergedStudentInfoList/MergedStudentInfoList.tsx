import styles from './MergedStudentInfoList.module.css';
import { BsX } from 'react-icons/bs';
import { useMergedStudentContext } from '../MergeStudentPage';
import { EmptyMergedPropType } from '../MergeStudentPage';

const MergedStudentInfoList = () => {
  //Subscribe to merged student information from context provider
  const MergedStudentContext = useMergedStudentContext();

  return (
    <div className={styles.inputs}>
      <div className={`${styles.box} ${styles.roundTop}`}>
        <p className={styles.boxTitle}>Name</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudentName.value}
        </p>
        {MergedStudentContext.mergedStudentName.student === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudentName(EmptyMergedPropType);
            }}
          >
            {MergedStudentContext.mergedStudentName.student}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={styles.box}>
        <p className={styles.boxTitle}>Email</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudentEmail.value}
        </p>
        {MergedStudentContext.mergedStudentEmail.student === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudentEmail(EmptyMergedPropType);
            }}
          >
            {MergedStudentContext.mergedStudentEmail.student}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={styles.box}>
        <p className={styles.boxTitle}>Grade</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudentGrade.value ?? 'No Given Grade'}
        </p>
        {MergedStudentContext.mergedStudentGrade.student === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudentGrade(EmptyMergedPropType);
            }}
          >
            {MergedStudentContext.mergedStudentGrade.student}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={`${styles.box} ${styles.roundBottom}`}>
        <p className={styles.boxTitle}>School</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudentSchool.value ?? 'No Given School'}
        </p>
        {MergedStudentContext.mergedStudentSchool.student === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudentSchool(EmptyMergedPropType);
            }}
          >
            {MergedStudentContext.mergedStudentSchool.student}
            <BsX size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MergedStudentInfoList;
