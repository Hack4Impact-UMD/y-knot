import { useAuth } from '../../../src/auth/AuthProvider';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type CourseID } from '../../types/CourseType';
import { getAllCourses } from '../../../src/backend/FirestoreCalls';
import { DateTime } from 'luxon';
import styles from './CoursesPage.module.css';
import CourseCard from '../../components/CourseCard/CourseCard';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';
import { Alert, Snackbar } from '@mui/material';

const CoursesPage = ({ formSubmitted, setFormSubmitted }: any): JSX.Element => {
  const authContext = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [filteredCurrentCourses, setFilteredCurrentCourses] = useState<
    CourseID[]
  >([]);
  const [filteredPastCourses, setFilteredPastCourses] = useState<CourseID[]>(
    [],
  );
  const [filteredUpcomingCourses, setFilteredUpcomingCourses] = useState<
    CourseID[]
  >([]);
  const [search, setSearch] = useState<string>('');
  const [allCurrentCourses, setAllCurrentCourses] = useState<CourseID[]>([]);
  const [allPastCourses, setAllPastCourses] = useState<CourseID[]>([]);
  const [allUpcomingCourses, setAllUpcomingCourses] = useState<CourseID[]>([]);
  const navigate = useNavigate();

  const colors = [
    'var(--color-green)',
    'var(--color-orange)',
    'var(--color-blue)',
    'var(--color-red)',
  ];

  // Used to detect time in between keystrokes when using the search bar
  let timer: NodeJS.Timeout | null = null;
  useEffect(() => {
    console.log('formSubmitted: ', formSubmitted);
    getAllCourses()
      .then((courses) => {
        const now = DateTime.now();
        const tempAllUpcomingCourses = courses.filter(
          (course) => DateTime.fromISO(course.startDate) > now,
        );
        const tempAllCurrentCourses = courses.filter(
          (course) =>
            DateTime.fromISO(course.startDate) <= now &&
            DateTime.fromISO(course.endDate) >= now,
        );
        const tempAllPastCourses = courses.filter(
          (course) => DateTime.fromISO(course.endDate) < now,
        );

        setAllPastCourses(tempAllPastCourses);
        setAllUpcomingCourses(tempAllUpcomingCourses);
        setAllCurrentCourses(tempAllCurrentCourses);

        setFilteredPastCourses(tempAllPastCourses);
        setFilteredUpcomingCourses(tempAllUpcomingCourses);
        setFilteredCurrentCourses(tempAllCurrentCourses);
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const displayCourseCards = (courses: CourseID[]) => {
    return courses.map((course, i) => {
      let color = colors[i % colors.length];
      const now = DateTime.now();
      if (
        DateTime.fromISO(course.startDate) > now ||
        DateTime.fromISO(course.endDate) < now
      ) {
        color = 'gray';
      }
      return (
        <Link
          to={`/courses/class/${course.id}`}
          key={i}
          className={styles.card}
        >
          <CourseCard
            teacher={course.teachers}
            course={course.name}
            section={course.meetingTime}
            startDate={course.startDate}
            endDate={course.endDate}
            color={color}
          />
        </Link>
      );
    });
  };

  const filterWithSearchValue = (searchVal: string) => {
    if (searchVal !== '') {
      const tempUpcomingCourses = allUpcomingCourses.filter((course) =>
        course.name.toLowerCase().includes(searchVal.toLowerCase()),
      );

      const tempCurrentCourses = allCurrentCourses.filter((course) =>
        course.name.toLowerCase().includes(searchVal.toLowerCase()),
      );

      const tempPastCourses = allPastCourses.filter((course) =>
        course.name.toLowerCase().includes(searchVal.toLowerCase()),
      );

      setFilteredUpcomingCourses(tempUpcomingCourses);
      setFilteredCurrentCourses(tempCurrentCourses);
      setFilteredPastCourses(tempPastCourses);
    } else {
      setFilteredCurrentCourses(allCurrentCourses);
      setFilteredPastCourses(allPastCourses);
      setFilteredUpcomingCourses(allUpcomingCourses);
    }
  };

  const handleSearch = (e: any) => {
    if (error || loading) {
      return;
    }
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      const searchVal = e.target.value;
      setSearch(searchVal);
      filterWithSearchValue(searchVal);
    }, 500);
  };

  const handleAddCourse = () => {
    navigate('/courses/add');
  };

  const handleToClose = (event: any, reason: any) => {
    console.log('closing');
    setFormSubmitted(false);
  };

  return (
    <>
      {authContext.loading ? (
        // Used to center the loading spinner
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : (
        <>
          <NavigationBar />
          <div className={styles.rightPane}>
            {loading ? (
              <div className={styles.message}>
                <Loading />
              </div>
            ) : error ? (
              <h4 className={styles.message}>
                Error retrieving courses. Please try again later.
              </h4>
            ) : (
              <>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search Courses"
                    onChange={(event) => {
                      handleSearch(event);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        // TODO: Connect backend
                        event.preventDefault();
                        handleSearch(event);
                      }
                    }}
                    className={styles.searchBar}
                  />
                </div>

                <div className={styles.courseHeader}>
                  <h1 className={styles.courseStatus}>Active Courses</h1>

                  {authContext?.token?.claims.role === 'ADMIN' ? (
                    <button
                      className={styles.addCourse}
                      onClick={handleAddCourse}
                    >
                      Add Course
                    </button>
                  ) : (
                    <></>
                  )}
                </div>

                <div className={styles.cardLayout}>
                  {allCurrentCourses.length === 0 ? (
                    <h4 className={styles.noStudent}>No Active Courses</h4>
                  ) : filteredCurrentCourses.length === 0 ? (
                    <h4 className={styles.noStudent}>
                      No Active Courses Matching "{search}"
                    </h4>
                  ) : (
                    displayCourseCards(filteredCurrentCourses)
                  )}
                </div>

                {authContext?.token?.claims.role != 'TEACHER' ? (
                  <>
                    <h1 className={styles.courseStatus}>Past Courses</h1>
                    <div className={styles.cardLayout}>
                      {allPastCourses.length === 0 ? (
                        <h4 className={styles.noStudent}>No Past Courses</h4>
                      ) : filteredPastCourses.length === 0 ? (
                        <h4 className={styles.noStudent}>
                          No Past Courses Matching "{search}"
                        </h4>
                      ) : (
                        displayCourseCards(filteredPastCourses)
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <h1 className={styles.courseStatus}>Upcoming Courses</h1>
                <div className={styles.cardLayout}>
                  {allUpcomingCourses.length === 0 ? (
                    <h4 className={styles.noStudent}>No Upcoming Courses</h4>
                  ) : filteredUpcomingCourses.length === 0 ? (
                    <h4 className={styles.noStudent}>
                      No Upcoming Courses Matching "{search}"
                    </h4>
                  ) : (
                    displayCourseCards(filteredUpcomingCourses)
                  )}
                </div>
              </>
            )}
            <Snackbar
              anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom',
              }}
              open={formSubmitted}
              autoHideDuration={3000}
              onClose={handleToClose}
            >
              <Alert severity="success" sx={{ width: '100%' }}>
                Course was Successfully Added
              </Alert>
            </Snackbar>
          </div>
        </>
      )}
      ;
    </>
  );
};

export default CoursesPage;
