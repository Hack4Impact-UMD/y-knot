import { Student } from '../../../types/StudentType';
import { useMergedStudentContext } from '../MergeStudentPage';
import { EmptyMergedPropType } from '../MergeStudentPage';
import { Checkbox } from '@mui/material';
import styles from './StudentInformationList.module.css';
import styled from '@emotion/styled';

// Checkbox icon
const BpIcon = styled('span')(() => ({
  borderRadius: 3,
  height: '20px',
  width: '20px',
  borderStyle: 'solid',
  borderColor: 'var(--color-grey)',
  backgroundColor: 'var(--color-grey)',
  marginLeft: '20px',
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: 'var(--color-orange)',
  borderColor: 'var(--color-orange)',
  '&::before': {
    display: 'block',
    height: '20px',
    width: '20px',
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  '&::after': {
    borderColor: 'var(--color-orange)',
  },
});

const StudentInformationList = (props: {
  student: Student;
  whichStudent: string;
}) => {
  //Subscribe to merged student information from context provider
  const MergedStudentContext = useMergedStudentContext();

  return (
    <div className={styles.inputs}>
      <div className={`${styles.box} ${styles.roundTop}`}>
        <p className={styles.boxTitle}>Name</p>
        <p className={styles.boxContent}>
          {`${props.student.firstName} ${props.student.lastName}`}
        </p>
        <Checkbox
          sx={{
            '&:hover': { bgcolor: 'transparent' },
          }}
          disableRipple
          color="default"
          checked={
            props.whichStudent ===
            MergedStudentContext.mergedStudentName.student
          }
          checkedIcon={<BpCheckedIcon />}
          icon={<BpIcon />}
          onChange={() => {
            if (
              MergedStudentContext.mergedStudentName.student !==
              props.whichStudent
            ) {
              // Other checkbox is selected
              // "Unselect" previous by changing value to current student
              MergedStudentContext.setMergedStudentName({
                student: props.whichStudent,
                value: `${props.student.firstName} ${props.student.lastName}`,
              });
            } else {
              // "Unselect" the current student by setting to empty prop type
              MergedStudentContext.setMergedStudentName(EmptyMergedPropType);
            }
          }}
        />
      </div>
      <div className={styles.box}>
        <p className={styles.boxTitle}>Email</p>
        <p className={styles.boxContent}>{props.student.email ?? 'N/A'}</p>
        <Checkbox
          sx={{
            '&:hover': { bgcolor: 'transparent' },
          }}
          disableRipple
          color="default"
          checked={
            props.whichStudent ===
            MergedStudentContext.mergedStudentEmail.student
          }
          checkedIcon={<BpCheckedIcon />}
          icon={<BpIcon />}
          onChange={() => {
            if (
              MergedStudentContext.mergedStudentEmail.student !==
              props.whichStudent
            ) {
              MergedStudentContext.setMergedStudentEmail({
                student: props.whichStudent,
                value: props.student.email,
              });
            } else {
              MergedStudentContext.setMergedStudentEmail(EmptyMergedPropType);
            }
          }}
        />
      </div>
      <div className={styles.box}>
        <p className={styles.boxTitle}>Grade</p>
        <p className={styles.boxContent}>{props.student.gradeLevel ?? 'N/A'}</p>
        <Checkbox
          sx={{
            '&:hover': { bgcolor: 'transparent' },
          }}
          disableRipple
          color="default"
          checked={
            props.whichStudent ===
            MergedStudentContext.mergedStudentGrade.student
          }
          checkedIcon={<BpCheckedIcon />}
          icon={<BpIcon />}
          onChange={() => {
            if (
              MergedStudentContext.mergedStudentGrade.student !==
              props.whichStudent
            ) {
              MergedStudentContext.setMergedStudentGrade({
                student: props.whichStudent,
                value: props.student.gradeLevel ?? 'N/A',
              });
            } else {
              MergedStudentContext.setMergedStudentGrade(EmptyMergedPropType);
            }
          }}
        />
      </div>
      <div className={`${styles.box} ${styles.roundBottom}`}>
        <p className={styles.boxTitle}>School</p>
        <p className={styles.boxContent}>{props.student.schoolName ?? 'N/A'}</p>
        <Checkbox
          sx={{
            '&:hover': { bgcolor: 'transparent' },
          }}
          disableRipple
          color="default"
          checked={
            props.whichStudent ===
            MergedStudentContext.mergedStudentSchool.student
          }
          checkedIcon={<BpCheckedIcon />}
          icon={<BpIcon />}
          onChange={() => {
            if (
              MergedStudentContext.mergedStudentSchool.student !==
              props.whichStudent
            ) {
              MergedStudentContext.setMergedStudentSchool({
                student: props.whichStudent,
                value: props.student.schoolName ?? 'N/A',
              });
            } else {
              MergedStudentContext.setMergedStudentSchool(EmptyMergedPropType);
            }
          }}
        />
      </div>
    </div>
  );
};

export default StudentInformationList;
