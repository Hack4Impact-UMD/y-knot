import styles from './AdminStudentRosterPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';
import StudentList from './StudentList/StudentList';
import { Student } from '../../types/StudentType';
import { useState, useEffect } from 'react';
import { getAllStudents } from '../../backend/FirestoreCalls';
import { authenticateUser } from '../../backend/FirebaseCalls';

const AdminStudentRosterPage = (): JSX.Element => {
  const [students, setStudents] = useState<Student[]>([]);
  const [tempRoster, setTempRoster] = useState<Student[]>([]);

  useEffect(() => {
    authenticateUser('sgaba@umd.edu', '123abc')
      .then(() =>
        getAllStudents()
          .then((data) => {
            setStudents(data);
            setTempRoster(data);
          })
          .catch((err) => console.error(err)),
      )
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSearch = (e: any) => {
    setTempRoster(
      students.filter((student) => checkName(student, e.target.value)),
    );
  };

  function checkName(student: Student, input: string) {
    const name = student.firstName + ' ' + student.lastName;
    const lowerCaseName = name.toLowerCase();
    return lowerCaseName.includes(input);
  }

  return (
    <div className={styles.rightPane}>
      <NavigationBar />
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search Students"
          onChange={(e) => {
            handleSearch(e);
          }}
        />
      </div>
      <h1 className={styles.heading}>Student Roster</h1>
      {students.length === 0 ? (
        <Loading />
      ) : (
        <StudentList students={tempRoster} />
      )}
    </div>
  );
};

export default AdminStudentRosterPage;
