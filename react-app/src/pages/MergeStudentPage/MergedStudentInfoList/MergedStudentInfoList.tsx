import styles from './MergedStudentInfoList.module.css';
import { BsX } from 'react-icons/bs';
import { StudentID } from '../../../types/StudentType';
import { useMergedStudentContext } from '../MergeStudentPage';

const MergedStudentInfoList = (props: {
  studentA: StudentID;
  studentB: StudentID;
}) => {
  //Subscribe to merged student information from context provider
  const MergedStudentContext = useMergedStudentContext();

  return (
    <div className={styles.inputs}>
      <div className={`${styles.box} ${styles.roundTop}`}>
        <p className={styles.boxTitle}>Name</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudent.name === 'Student A'
            ? `${props.studentA.firstName} ${
                props.studentA.middleName ? props.studentA.middleName + ' ' : ''
              }${props.studentA.lastName}`
            : MergedStudentContext.mergedStudent.name === 'Student B'
            ? `${props.studentB.firstName} ${
                props.studentB.middleName ? props.studentB.middleName + ' ' : ''
              }${props.studentB.lastName}`
            : ''}
        </p>
        {MergedStudentContext.mergedStudent.name === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudent({
                ...MergedStudentContext.mergedStudent,
                name: '',
              });
            }}
          >
            {MergedStudentContext.mergedStudent.name}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={styles.box}>
        <p className={styles.boxTitle}>Email</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudent.email === 'Student A'
            ? props.studentA.email
            : MergedStudentContext.mergedStudent.email === 'Student B'
            ? props.studentB.email
            : ''}
        </p>
        {MergedStudentContext.mergedStudent.email === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudent({
                ...MergedStudentContext.mergedStudent,
                email: '',
              });
            }}
          >
            {MergedStudentContext.mergedStudent.email}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={styles.box}>
        <p className={styles.boxTitle}>Phone</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudent.phone === 'Student A'
            ? props.studentA.phone
            : MergedStudentContext.mergedStudent.phone === 'Student B'
            ? props.studentB.phone
            : ''}
        </p>
        {MergedStudentContext.mergedStudent.phone === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudent({
                ...MergedStudentContext.mergedStudent,
                phone: '',
              });
            }}
          >
            {MergedStudentContext.mergedStudent.phone}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={styles.box}>
        <p className={styles.boxTitle}>Birthdate</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudent.birthDate === 'Student A'
            ? props.studentA.birthDate
            : MergedStudentContext.mergedStudent.birthDate === 'Student B'
            ? props.studentB.birthDate
            : ''}
        </p>
        {MergedStudentContext.mergedStudent.birthDate === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudent({
                ...MergedStudentContext.mergedStudent,
                birthDate: '',
              });
            }}
          >
            {MergedStudentContext.mergedStudent.birthDate}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={styles.box}>
        <p className={styles.boxTitle}>Grade</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudent.gradeLevel === 'Student A'
            ? props.studentA.gradeLevel
            : MergedStudentContext.mergedStudent.gradeLevel === 'Student B'
            ? props.studentB.gradeLevel
            : ''}
        </p>
        {MergedStudentContext.mergedStudent.gradeLevel === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudent({
                ...MergedStudentContext.mergedStudent,
                gradeLevel: '',
              });
            }}
          >
            {MergedStudentContext.mergedStudent.gradeLevel}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={styles.box}>
        <p className={styles.boxTitle}>School</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudent.schoolName === 'Student A'
            ? props.studentA.schoolName
            : MergedStudentContext.mergedStudent.schoolName === 'Student B'
            ? props.studentB.schoolName
            : ''}
        </p>
        {MergedStudentContext.mergedStudent.schoolName === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudent({
                ...MergedStudentContext.mergedStudent,
                schoolName: '',
              });
            }}
          >
            {MergedStudentContext.mergedStudent.schoolName}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={styles.box}>
        <p className={styles.boxTitle}>Address</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudent.addr === 'Student A'
            ? `${props.studentA.addrFirstLine} ${
                props.studentA.addrSecondLine
                  ? props.studentA.addrSecondLine + ' '
                  : ''
              }${props.studentA.city} ${props.studentA.state} ${
                props.studentA.zipCode
              }`
            : MergedStudentContext.mergedStudent.addr === 'Student B'
            ? `${props.studentB.addrFirstLine} ${
                props.studentB.addrSecondLine
                  ? props.studentB.addrSecondLine + ' '
                  : ''
              }${props.studentB.city} ${props.studentB.state} ${
                props.studentB.zipCode
              }`
            : ''}
        </p>
        {MergedStudentContext.mergedStudent.addr === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudent({
                ...MergedStudentContext.mergedStudent,
                addr: '',
              });
            }}
          >
            {MergedStudentContext.mergedStudent.addr}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={styles.box}>
        <p className={styles.boxTitle}>Guardian Name</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudent.guardianName === 'Student A'
            ? `${props.studentA.firstName} ${props.studentA.lastName}`
            : MergedStudentContext.mergedStudent.guardianName === 'Student B'
            ? `${props.studentB.firstName} ${props.studentB.lastName}`
            : ''}
        </p>
        {MergedStudentContext.mergedStudent.guardianName === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudent({
                ...MergedStudentContext.mergedStudent,
                guardianName: '',
              });
            }}
          >
            {MergedStudentContext.mergedStudent.guardianName}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={styles.box}>
        <p className={styles.boxTitle}>Guardian Email</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudent.guardianEmail === 'Student A'
            ? props.studentA.guardianEmail
            : MergedStudentContext.mergedStudent.guardianEmail === 'Student B'
            ? props.studentB.guardianEmail
            : ''}
        </p>
        {MergedStudentContext.mergedStudent.guardianEmail === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudent({
                ...MergedStudentContext.mergedStudent,
                guardianEmail: '',
              });
            }}
          >
            {MergedStudentContext.mergedStudent.guardianEmail}
            <BsX size={20} />
          </div>
        )}
      </div>

      <div className={`${styles.box} ${styles.roundBottom}`}>
        <p className={styles.boxTitle}>Guardian Phone</p>
        <p className={styles.boxContent}>
          {MergedStudentContext.mergedStudent.guardianPhone === 'Student A'
            ? props.studentA.guardianPhone
            : MergedStudentContext.mergedStudent.guardianPhone === 'Student B'
            ? props.studentB.guardianPhone
            : ''}
        </p>
        {MergedStudentContext.mergedStudent.guardianPhone === '' ? (
          <></>
        ) : (
          <div
            className={styles.selectedAttribute}
            onClick={() => {
              MergedStudentContext.setMergedStudent({
                ...MergedStudentContext.mergedStudent,
                guardianPhone: '',
              });
            }}
          >
            {MergedStudentContext.mergedStudent.guardianPhone}
            <BsX size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MergedStudentInfoList;
