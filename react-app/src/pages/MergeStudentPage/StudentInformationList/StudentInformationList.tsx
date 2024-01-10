import { Student } from '../../../types/StudentType';
import styles from './StudentInformationList.module.css';
import { CheckBox } from '@mui/icons-material';

const checkBoxStyle = {
  color: '#e3853a',
  '&.Mui-checked': {
    color: '#e3853a',
  },
};

const StudentInformationList = (props: { student: Student }) => {
  return (
    <div className={styles.inputs}>
      <div className={`${styles.box} ${styles.roundTop}`}>
        <p className={styles.boxTitle}>Name</p>
        <p className={styles.boxContent}>
          {`${props.student.firstName} ${props.student.lastName}`}
        </p>
        <CheckBox className={styles.checkbox} sx={checkBoxStyle} />
      </div>
      <div className={styles.box}>
        <p className={styles.boxTitle}>Email</p>
        <p className={styles.boxContent}>{props.student.email}</p>
        <CheckBox className={styles.checkbox} sx={checkBoxStyle} />
      </div>
      <div className={styles.box}>
        <p className={styles.boxTitle}>Grade</p>
        <p className={styles.boxContent}>
          {props.student.gradeLevel ?? 'No Given Grade'}
        </p>
        <CheckBox className={styles.checkbox} sx={checkBoxStyle} />
      </div>
      <div className={`${styles.box} ${styles.roundBottom}`}>
        <p className={styles.boxTitle}>School</p>
        <p className={styles.boxContent}>
          {props.student.schoolName ?? 'No Given School'}
        </p>
        <CheckBox className={styles.checkbox} sx={checkBoxStyle} />
      </div>
    </div>
  );
};

export default StudentInformationList;
