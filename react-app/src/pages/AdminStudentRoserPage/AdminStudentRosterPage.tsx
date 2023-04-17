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
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    authenticateUser('sgaba@umd.edu', '123abc')
      .then(() =>
        getAllStudents()
          .then((data) => {
            setStudents(data);
            setTempRoster(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setLoading(false);
          }),
      )
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
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
      {loading ? (
        <Loading />
      ) : (
        <StudentList
          name={search}
          rosterSize={tempRoster.length}
          students={tempRoster}
        />
      )}
    </div>
  );
};

export default AdminStudentRosterPage;
