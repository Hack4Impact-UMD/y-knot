import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { getTeacher } from '../../backend/FirestoreCalls';
import { authenticateUser } from '../../backend/FirebaseCalls';
import { type Teacher } from '../../types/UserType';
import styles from './TeacherProfilePage.module.css';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import CourseCard from '../../components/CourseCard/CourseCard';

const TeacherProfilePage = (): JSX.Element => {
  const [teacher, setTeacher] = useState<Teacher>();
  const [editName, setEditName] = useState<boolean>(false);
  const [pageError, setPageError] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const authContext = useAuth();
  const teacherID = useParams().id;

  useEffect(() => {
    if (teacherID) {
      authenticateUser('sgaba@umd.edu', '123abc')
        .then(() =>
          getTeacher(teacherID)
            .then((data) => {
              setTeacher(data);
              setLoading(false);
              setName(data.name!);
              setEmail(data.email!);
            })
            .catch((err) => {
              console.error(err);
              setLoading(false);
              setPageError(true);
            }),
        )
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  if (pageError) {
    return <Navigate to="/*"></Navigate>
  }

  return (
    <>
      <NavigationBar />
      {authContext?.loading || loading ? (
        <div className={styles.container}>
          <Loading />
        </div>
      ) : loading ? (
        <div className={styles.container}>
          <Loading />
        </div>
      ) : (
        <div className={styles.settings}>
          <h1 className={styles.title}>Teacher Profile</h1>

          <div className={styles.inputs}>
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
            <CourseCard
              teacher={['bob']}
              course="Hack4Impact"
              section="[Section]"
              startDate="2023-01-01"
              endDate="2023-04-01"
              color="gray"
            />
            <CourseCard
              teacher={['bob']}
              course="Math"
              section="[Section]"
              startDate="2023-01-01"
              endDate="2023-04-01"
              color="gray"
            />
            <CourseCard
              teacher={['bob']}
              course="Sign Language"
              section="[Section]"
              startDate="2023-01-01"
              endDate="2023-04-01"
              color="gray"
            />
            <CourseCard
              teacher={['bob']}
              course="English"
              section="[Section]"
              startDate="2023-01-01"
              endDate="2023-04-01"
              color="gray"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherProfilePage;
