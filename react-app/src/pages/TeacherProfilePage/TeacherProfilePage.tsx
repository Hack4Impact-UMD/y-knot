import { useState } from 'react';
import styles from './TeacherProfilePage.module.css';
import { MdEdit } from 'react-icons/md';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import CourseCard from '../../components/CourseCard/CourseCard';
import edit from '../../assets/edit.svg';

const TeacherProfilePage = (): JSX.Element => {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState('Fiona Love');
  const [email, setEmail] = useState('f.love@gmail.com');

  const authContext = useAuth();

  return (
    <>
      <NavigationBar />
      {authContext?.loading ? (
        <div className={styles.container}>
          <Loading />
        </div>
      ) : (
        <div className={styles.settings}>
          <div className={styles.topButtons}>
            <h1 className={styles.title}>Teacher Profile</h1>
            <button className={styles.editButton}>
              <img src={edit} />
            </button>
          </div>
          <div className={styles.inputs}>
            {authContext?.token?.claims.role !== 'admin' ? (
              <div className={styles.box} id="Name">
                <a className={styles.boxTitle}>Name</a>
                <a className={styles.boxData}>
                  {editName ? (
                    <input
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                    ></input>
                  ) : (
                    name
                  )}
                </a>
                <button
                  className={styles.editKey}
                  onClick={() => {
                    setEditName(!editName);
                  }}
                >
                  {editName ? 'save' : <MdEdit />}
                </button>
              </div>
            ) : (
              <></>
            )}

            <div className={styles.box} id="Name">
              <a className={styles.boxTitle}>Name</a>
              <a className={styles.boxData}>{name}</a>
            </div>
            <div className={styles.bottomBox} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>{email}</a>
            </div>
          </div>
          <h1 className={styles.coursesTitle}>Courses</h1>
          <div className={styles.courseList}>
            <CourseCard teacher="bob" course="1" section="1" />
            <CourseCard teacher="bob" course="1" section="1" />
            <CourseCard teacher="bob" course="1" section="1" />
            <CourseCard teacher="bob" course="1" section="1" />
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherProfilePage;
