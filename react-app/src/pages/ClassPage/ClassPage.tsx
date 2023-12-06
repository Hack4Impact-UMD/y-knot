import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import styles from '../../pages/ClassPage/ClassPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';
import ClassMain from './ClassMain/ClassMain';
import ClassAttendance from './ClassAttendance/ClassAttendance';
import ClassHomework from './ClassHomework/ClassHomework';
import ClassTeachers from './ClassTeachers/ClassTeachers';
import ClassStudents from './ClassStudents/ClassStudents';
import ClassSettings from './ClassSettings/ClassSettings';
import { useParams } from 'react-router-dom';
import type { Course, CourseID } from '../../types/CourseType';
import { getCourse } from '../../backend/FirestoreCalls';
import { DateTime } from 'luxon';

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
  const dateFormat = 'LLL dd, yyyy';
  const blankCourse: CourseID = {
    name: '',
    startDate: '',
    endDate: '',
    meetingTime: '',
    students: [],
    teachers: [],
    leadershipApp: false,
    courseType: 'ACADEMY',
    formId: '',
    introEmail: { content: '' },
    attendance: [],
    homeworks: [],
    id: '',
  };

  const [course, setCourse] = useState<Course>(blankCourse);

  const authContext = useAuth();
  const courseID = useParams().id;

  const handleTabChange = (tab: Tab): void => {
    setCurrentTab(tab);
  };

  useEffect(() => {
    if (courseID !== undefined) {
      getCourse(courseID)
        .then((data) => {
          setCourse(data);
        })
        .catch(() => {
          // add error handling
        })
        .finally(() => {
          // add handling
        });
    }
  }, []);

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
            <h1 className={styles.title}>{course?.name}</h1>
            <h2 className={styles.date}>
              {`${DateTime.fromISO(course.startDate).toFormat(
                dateFormat,
              )} - ${DateTime.fromISO(course.endDate).toFormat(dateFormat)}`}
            </h2>
            <h2 className={styles.time}>{course.meetingTime}</h2>
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
            {authContext?.token?.claims.role === 'ADMIN' ? (
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
            {authContext?.token?.claims.role === 'ADMIN' ? (
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

          {/* For rendering the corresponding component whenever tab value changes */}
          {currentTab === Tab.Main && <ClassMain />}
          {currentTab === Tab.Students && <ClassStudents />}
          {currentTab === Tab.Attendance && <ClassAttendance />}
          {currentTab === Tab.Homework && <ClassHomework />}
          {currentTab === Tab.Teachers && <ClassTeachers />}
          {currentTab === Tab.Settings && <ClassSettings />}
        </div>
      )}
    </div>
  );
};

export default ClassPage;
