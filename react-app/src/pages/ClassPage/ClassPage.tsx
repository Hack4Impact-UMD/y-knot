import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import {
  getCourse,
  getStudentsFromList,
  getTeachersFromList,
} from '../../backend/FirestoreCalls';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import styles from '../../pages/ClassPage/ClassPage.module.css';
import type { Course, CourseID } from '../../types/CourseType';
import type { StudentID } from '../../types/StudentType';
import type { TeacherID } from '../../types/UserType';
import ClassAcademy from './ClassAcademy/ClassAcademy';
import ClassAttendance from './ClassAttendance/ClassAttendance';
import ClassHomework from './ClassHomework/ClassHomework';
import ClassMain from './ClassMain/ClassMain';
import ClassSettings from './ClassSettings/ClassSettings';
import ClassStudents from './ClassStudents/ClassStudents';
import ClassTeachers from './ClassTeachers/ClassTeachers';

enum Tab {
  Main = 'Main',
  Academy = 'Academy',
  Students = 'Students',
  Attendance = 'Attendance',
  Homework = 'Homework',
  Teachers = 'Teachers',
  Settings = 'Settings',
}

const dateFormat = 'LLL dd, yyyy';
const blankCourse: CourseID = {
  name: '',
  startDate: '',
  endDate: '',
  students: [],
  teachers: [],
  leadershipApp: false,
  formId: '',
  introEmail: { content: '', files: [] },
  attendance: [],
  homeworks: [],
  id: '',
};

const ClassPage = ({ setCourseDeleted }: any): JSX.Element => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.Main);
  const [course, setCourse] = useState<Course>(blankCourse);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<StudentID[]>([]);
  const [teachers, setTeachers] = useState<TeacherID[]>([]);
  const authContext = useAuth();
  const courseID = useParams().id;

  const handleTabChange = (tab: Tab): void => {
    setCurrentTab(tab);
  };

  useEffect(() => {
    if (courseID !== undefined) {
      getCourse(courseID)
        .then(async (courseData) => {
          setCourse(courseData);
          getStudentsFromList(courseData.students).then((data) => {
            setStudents(data);
          });
          getTeachersFromList(courseData.teachers).then((data) => {
            setTeachers(data);
          });
        })
        .catch(() => {
          console.log('Failed to get Course Information in Class Page');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  function titleCase(str: string) {
    return str && str[0].toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div>
      <NavigationBar />
      {authContext?.loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : isLoading ? (
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
            {course.leadershipApp ? (
              <button
                className={
                  currentTab === Tab.Academy ? styles.selectedTab : styles.tab
                }
                onClick={() => {
                  handleTabChange(Tab.Academy);
                }}
              >
                Academy
              </button>
            ) : (
              <></>
            )}
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
          {currentTab === Tab.Main && (
            <ClassMain
              course={course}
              courseID={courseID!}
              setCourse={setCourse}
            />
          )}
          {currentTab === Tab.Academy && <ClassAcademy courseID={courseID!} />}
          {currentTab === Tab.Students && (
            <ClassStudents
              students={students}
              setStudents={setStudents}
              courseID={courseID!}
              courseName={course.name}
            />
          )}
          {currentTab === Tab.Attendance && (
            <ClassAttendance
              students={students}
              setStudents={setStudents}
              course={course}
              courseID={courseID!}
              setCourse={setCourse}
            />
          )}
          {currentTab === Tab.Homework && (
            <ClassHomework
              homeworks={course.homeworks}
              students={students}
              setStudents={setStudents}
              course={course}
              courseID={courseID!}
              setCourse={setCourse}
            />
          )}
          {currentTab === Tab.Teachers && (
            <ClassTeachers
              teachers={teachers}
              setTeachers={setTeachers}
              courseID={courseID!}
              courseName={course.name}
            />
          )}
          {currentTab === Tab.Settings && (
            <ClassSettings
              course={course}
              courseID={courseID!}
              setCourseDeleted={setCourseDeleted}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ClassPage;
