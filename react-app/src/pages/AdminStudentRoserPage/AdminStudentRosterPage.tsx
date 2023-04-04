import styles from './AdminStudentRosterPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import StudentList from './StudentList/StudentList';

const AdminStudentRosterPage = (): JSX.Element => {
    return (
    <div className={styles.rightPane}>
         <NavigationBar />
         <div className={styles.searchBar}>
            <input type="text" placeholder="Search Students" />
         </div>
         <h1 className={styles.heading}>Student Roster</h1>
         <StudentList />
    </div>
    );
  };
  
  export default AdminStudentRosterPage;