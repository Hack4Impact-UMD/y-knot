import { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import styles from '../../pages/ClassPage/ClassPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';
import ClassAttendance from './ClassAttendance/ClassAttendance';
import ClassHomework from './ClassHomework/ClassHomework';
import ClassStudents from './ClassStudents/ClassStudents';

enum Tab {
  Main = 'Main',
  Students = 'Students',
  Attendance = 'Attendance',
  Homework = 'Homework',
  Teachers = 'Teachers',
  Settings = 'Settings',
}

const ClassPage = (): JSX.Element => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.Main);

  const authContext = useAuth();

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    console.log(tab);
  };

  return (
    <div>
      <NavigationBar />
      {authContext?.loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.rightPane}>
          <div className={styles.classInfo}>
            <h1 className={styles.title}>Math</h1>
            <h2 className={styles.date}>January 31st - May 20th</h2>
            <h2 className={styles.time}>3:00 - 4:00 pm</h2>
          </div>

          <div className={styles.content}>
            <button
              className={
                currentTab === Tab.Main ? styles.selectedTab : styles.tab
              }
              onClick={() => {
                handleTabChange(Tab.Main);
              }}
            >
              Main
            </button>
            <button
              className={
                currentTab === Tab.Students ? styles.selectedTab : styles.tab
              }
              onClick={() => {
                handleTabChange(Tab.Students);
              }}
            >
              Students
            </button>
            <button
              className={
                currentTab === Tab.Attendance ? styles.selectedTab : styles.tab
              }
              onClick={() => {
                handleTabChange(Tab.Attendance);
              }}
            >
              Attendance
            </button>
            <button
              className={
                currentTab === Tab.Homework ? styles.selectedTab : styles.tab
              }
              onClick={() => {
                handleTabChange(Tab.Homework);
              }}
            >
              Homework
            </button>
            {authContext?.token?.claims.role === 'admin' ? (
              <button
                className={
                  currentTab === Tab.Teachers ? styles.selectedTab : styles.tab
                }
                onClick={() => {
                  handleTabChange(Tab.Teachers);
                }}
              >
                Teachers
              </button>
            ) : (
              <></>
            )}
            {authContext?.token?.claims.role === 'admin' ? (
              <button
                className={
                  currentTab === Tab.Settings ? styles.selectedTab : styles.tab
                }
                onClick={() => {
                  handleTabChange(Tab.Settings);
                }}
              >
                Settings
              </button>
            ) : (
              <></>
            )}
          </div>

          {currentTab == Tab.Students && <ClassStudents />}

          {/* For rendering the corresponding component whenever tab value changes */}
          {/* {currentTab === Tab.Main && <MainClassPage />}
        {currentTab === Tab.Students && <Students />}
        {currentTab === Tab.Teachers && <Teachers />}
        {currentTab === Tab.Settings && <Settings />} */}

          {currentTab === Tab.Homework && <ClassHomework />}
          {currentTab === Tab.Attendance && <ClassAttendance />}
        </div>
      )}
    </div>
  );
};

export default ClassPage;
