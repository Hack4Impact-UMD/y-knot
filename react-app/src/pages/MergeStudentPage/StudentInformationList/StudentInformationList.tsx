import { Student } from '../../../types/StudentType';
import { useMergedStudentContext } from '../MergeStudentPage';
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

  function selectAll() {
    MergedStudentContext.setMergedStudent({
      name: props.whichStudent,
      email: props.whichStudent,
      phone: props.whichStudent,
      birthDate: props.whichStudent,
      gradeLevel: props.whichStudent,
      schoolName: props.whichStudent,
      addr: props.whichStudent,
      guardianName: props.whichStudent,
      guardianEmail: props.whichStudent,
      guardianPhone: props.whichStudent,
    });
  }

  return (
    <>
      <div className={styles.inputs}>
        <div className={`${styles.box} ${styles.roundTop}`}>
          <p className={styles.boxTitle}>Name</p>
          <p className={styles.boxContent}>
            {`${props.student.firstName} ${
              props.student.middleName ? props.student.middleName + ' ' : ''
            }${props.student.lastName}`}
          </p>
          <Checkbox
            sx={{
              '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checked={
              props.whichStudent === MergedStudentContext.mergedStudent.name
            }
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            onChange={() => {
              if (
                MergedStudentContext.mergedStudent.name !== props.whichStudent
              ) {
                // Other checkbox is selected
                // "Unselect" previous by changing value to current student
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  name: props.whichStudent,
                });
              } else {
                // "Unselect" the current student by setting to empty prop type
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  name: '',
                });
              }
            }}
          />
        </div>
        <div className={styles.box}>
          <p className={styles.boxTitle}>Email</p>
          <p className={styles.boxContent}>{props.student.email ?? ''}</p>
          <Checkbox
            sx={{
              '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checked={
              props.whichStudent === MergedStudentContext.mergedStudent.email
            }
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            onChange={() => {
              if (
                MergedStudentContext.mergedStudent.email !== props.whichStudent
              ) {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  email: props.whichStudent,
                });
              } else {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  email: '',
                });
              }
            }}
          />
        </div>
        <div className={styles.box}>
          <p className={styles.boxTitle}>Phone</p>
          <p className={styles.boxContent}>{props.student.phone ?? ''}</p>
          <Checkbox
            sx={{
              '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checked={
              props.whichStudent === MergedStudentContext.mergedStudent.phone
            }
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            onChange={() => {
              if (
                MergedStudentContext.mergedStudent.phone !== props.whichStudent
              ) {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  phone: props.whichStudent,
                });
              } else {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  phone: '',
                });
              }
            }}
          />
        </div>
        <div className={styles.box}>
          <p className={styles.boxTitle}>Birthdate</p>
          <p className={styles.boxContent}>{props.student.birthDate ?? ''}</p>
          <Checkbox
            sx={{
              '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checked={
              props.whichStudent ===
              MergedStudentContext.mergedStudent.birthDate
            }
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            onChange={() => {
              if (
                MergedStudentContext.mergedStudent.birthDate !==
                props.whichStudent
              ) {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  birthDate: props.whichStudent,
                });
              } else {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  birthDate: '',
                });
              }
            }}
          />
        </div>
        <div className={styles.box}>
          <p className={styles.boxTitle}>Grade</p>
          <p className={styles.boxContent}>{props.student.gradeLevel ?? ''}</p>
          <Checkbox
            sx={{
              '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checked={
              props.whichStudent ===
              MergedStudentContext.mergedStudent.gradeLevel
            }
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            onChange={() => {
              if (
                MergedStudentContext.mergedStudent.gradeLevel !==
                props.whichStudent
              ) {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  gradeLevel: props.whichStudent,
                });
              } else {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  gradeLevel: '',
                });
              }
            }}
          />
        </div>
        <div className={styles.box}>
          <p className={styles.boxTitle}>School</p>
          <p className={styles.boxContent}>{props.student.schoolName ?? ''}</p>
          <Checkbox
            sx={{
              '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checked={
              props.whichStudent ===
              MergedStudentContext.mergedStudent.schoolName
            }
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            onChange={() => {
              if (
                MergedStudentContext.mergedStudent.schoolName !==
                props.whichStudent
              ) {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  schoolName: props.whichStudent,
                });
              } else {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  schoolName: '',
                });
              }
            }}
          />
        </div>
        <div className={styles.box}>
          <p className={styles.boxTitle}>Address</p>
          <p className={styles.boxContent}>
            {`${props.student.addrFirstLine} ${
              props.student.addrSecondLine
                ? props.student.addrSecondLine + ' '
                : ''
            }${props.student.city} ${props.student.state} ${
              props.student.zipCode
            }`}
          </p>
          <Checkbox
            sx={{
              '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checked={
              props.whichStudent === MergedStudentContext.mergedStudent.addr
            }
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            onChange={() => {
              if (
                MergedStudentContext.mergedStudent.addr !== props.whichStudent
              ) {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  addr: props.whichStudent,
                });
              } else {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  addr: '',
                });
              }
            }}
          />
        </div>
        <div className={styles.box}>
          <p className={styles.boxTitle}>Guardian Name</p>
          <p className={styles.boxContent}>
            {`${props.student.guardianFirstName ?? ''} ${
              props.student.guardianLastName ?? ''
            }`}
          </p>
          <Checkbox
            sx={{
              '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checked={
              props.whichStudent ===
              MergedStudentContext.mergedStudent.guardianName
            }
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            onChange={() => {
              if (
                MergedStudentContext.mergedStudent.guardianName !==
                props.whichStudent
              ) {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  guardianName: props.whichStudent,
                });
              } else {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  guardianName: '',
                });
              }
            }}
          />
        </div>
        <div className={styles.box}>
          <p className={styles.boxTitle}>Guardian Email</p>
          <p className={styles.boxContent}>
            {props.student.guardianEmail ?? ''}
          </p>
          <Checkbox
            sx={{
              '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checked={
              props.whichStudent ===
              MergedStudentContext.mergedStudent.guardianEmail
            }
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            onChange={() => {
              if (
                MergedStudentContext.mergedStudent.guardianEmail !==
                props.whichStudent
              ) {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  guardianEmail: props.whichStudent,
                });
              } else {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  guardianEmail: '',
                });
              }
            }}
          />
        </div>
        <div className={`${styles.box} ${styles.roundBottom}`}>
          <p className={styles.boxTitle}>Guardian Phone</p>
          <p className={styles.boxContent}>
            {props.student.guardianPhone ?? ''}
          </p>
          <Checkbox
            sx={{
              '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checked={
              props.whichStudent ===
              MergedStudentContext.mergedStudent.guardianPhone
            }
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            onChange={() => {
              if (
                MergedStudentContext.mergedStudent.guardianPhone !==
                props.whichStudent
              ) {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  guardianPhone: props.whichStudent,
                });
              } else {
                MergedStudentContext.setMergedStudent({
                  ...MergedStudentContext.mergedStudent,
                  guardianPhone: '',
                });
              }
            }}
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.selectAllButton} onClick={selectAll}>
          Select All
        </button>
      </div>
    </>
  );
};

export default StudentInformationList;
