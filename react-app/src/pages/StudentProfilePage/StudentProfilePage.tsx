import { useState } from 'react';
import styles from './StudentProfilePage.module.css';
import { MdEdit } from 'react-icons/md';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import edit from '../../assets/edit.svg'
import transcript from '../../assets/transcript.svg'

const StudentProfilePage = (): JSX.Element => {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState('Fiona Love');
  const [email, setEmail] = useState('f.love@gmail.com');
  const [grade, setGrade] = useState('10th');
  const [school, setSchool] = useState('College Park High School');
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);

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
            <button className={styles.editButton}><img src={edit}/></button>
            <button className={styles.transcriptButton}><img src={transcript}/></button>
            <h1 className={styles.title}>Student Profile</h1>
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
            <div className={styles.box} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>{email}</a>
            </div>
            
            <div className={styles.box} id="Grade">
              <a className={styles.boxTitle}>Grade</a>
              <a className={styles.boxData}>{grade}</a>
            </div>
            <div className={styles.bottomBox} id="Password">
              <a className={styles.boxTitle}>School</a>
              <a className={styles.boxData}>{school}</a>
            </div>
          </div>
          <h1 className={styles.coursesTitle}>Courses</h1>
        </div>
      )}
    </>
  );
};

export default StudentProfilePage;