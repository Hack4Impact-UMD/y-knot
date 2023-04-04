import styles from './AdminStudentRosterPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import StudentList from './StudentList/StudentList';
import { Student } from '../../types/StudentType';
import { useState, useEffect } from 'react';
import { getAllStudents } from '../../backend/FirestoreCalls';
import { authenticateUser } from '../../backend/FirebaseCalls';

const AdminStudentRosterPage = (): JSX.Element => {
  const [searchName, setSearchName] = useState<String>();
  const [students, setStudents] = useState<Student[]>([]);
  const [tempRoster, setTempRoster] = useState<Student[]>([]);

  useEffect(() => {
    authenticateUser('sgaba@umd.edu', '123abc')
      .then(() =>
        getAllStudents()
          .then((data) => setStudents(data))
          .catch((err) => console.error(err)),
      )
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSearch = (e: any) => {
    console.log(e.target.value);
    setSearchName(e.target.value);
    setTempRoster(students);
    tempRoster.filter(
      (student) =>
        student.firstName === searchName || student.lastName === searchName,
    );
  };

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
      <StudentList students={tempRoster} />
    </div>
  );
};

export default AdminStudentRosterPage;
