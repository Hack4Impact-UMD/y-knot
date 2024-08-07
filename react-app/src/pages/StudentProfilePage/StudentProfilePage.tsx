import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../../auth/AuthProvider';
import {
  getStudent,
  updateStudent,
  getCourse,
} from '../../backend/FirestoreCalls';
import { type Student } from '../../types/StudentType';
import { CourseID } from '../../types/CourseType';
import { ToolTip } from '../../components/ToolTip/ToolTip';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';
import styles from './StudentProfilePage.module.css';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import editImage from '../../assets/edit.svg';
import saveImage from '../../assets/save.svg';
import transcriptIcon from '../../assets/transcript.svg';
import CourseCard from '../../components/CourseCard/CourseCard';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

const StudentProfilePage = (): JSX.Element => {
  const blankStudent: Student = {
    firstName: '',
    middleName: '',
    lastName: '',
    addrFirstLine: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: 0,
    guardianFirstName: '',
    guardianLastName: '',
    guardianEmail: '',
    guardianPhone: 0,
    birthDate: '',
    gradeLevel: '',
    schoolName: '',
    courseInformation: [],
  };

  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [pageError, setPageError] = useState<boolean>(false);
  const [student, setStudent] = useState<Student>(blankStudent);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [courses, setCourses] = useState<CourseID[]>([]);
  const authContext = useAuth();
  const studentID = useParams().id;

  const colors = [
    'var(--color-green)',
    'var(--color-orange)',
    'var(--color-blue)',
    'var(--color-red)',
  ];

  const compareLuxonDates = (course1: CourseID, course2: CourseID): number => {
    return (
      DateTime.fromISO(course1.startDate).toMillis() -
      DateTime.fromISO(course2.startDate).toMillis()
    );
  };

  const formatDateToYYYYMMDD = (dateTime: DateTime) => {
    const date = dateTime.toJSDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (studentID) {
      getStudent(studentID)
        .then(async (data) => {
          setStudent(data || blankStudent);
          if (data.courseInformation) {
            const dataCourses = await Promise.all(
              data.courseInformation.map(async (course) => {
                let courseResp = await getCourse(course.id);
                return { ...courseResp, id: course.id };
              }),
            ).catch(() => {
              setError(true);
              setPageError(true);
            });
            setCourses(dataCourses!);
          }
        })
        .catch(() => {
          setError(true);
          setPageError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const displayCourseCards = () => {
    let inSession: CourseID[] = [];
    let notInSession: CourseID[] = [];
    courses.forEach((course) => {
      const now = DateTime.now();
      let isInSession = true;
      if (
        DateTime.fromISO(course.startDate) > now ||
        DateTime.fromISO(course.endDate) < now.minus({ days: 1 })
      ) {
        isInSession = false;
      }
      if (isInSession) {
        inSession.push(course);
      } else {
        notInSession.push(course);
      }
    });

    inSession.sort(compareLuxonDates);
    notInSession.sort(compareLuxonDates);
    return inSession.concat(notInSession).map((course, i) => {
      let color = colors[i % colors.length];
      const now = DateTime.now();
      if (
        DateTime.fromISO(course.startDate) > now ||
        DateTime.fromISO(course.endDate) < now.minus({ days: 1 })
      ) {
        color = 'gray';
      }
      return (
        <Link to={`/courses/${course.id}`} key={i} className={styles.card}>
          <CourseCard
            teacher={course.teachers}
            course={course.name}
            startDate={course.startDate}
            endDate={course.endDate}
            color={color}
          />
        </Link>
      );
    });
  };

  const studentSchema = Yup.object().shape({
    firstName: Yup.string().required('*Required'),
    lastName: Yup.string().required('*Required'),
    addrFirstLine: Yup.string().required('*Required'),
    city: Yup.string().required('*Required'),
    state: Yup.string().required('*Required'),
    zipCode: Yup.string()
      .min(5, '*Enter a valid zipcode')
      .max(5, '*Enter a valid zipcode')
      .matches(/^\d+$/, '*Must be only digits')
      .required('*Required'),
    email: Yup.string().email('*Enter a valid email').required('*Required'),
    phone: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(1000000000, '*Enter a valid phone number')
      .max(10000000000, '*Enter a valid phone number')
      .required('*Required'),
    guardianFirstName: Yup.string(),
    guardianLastName: Yup.string(),
    guardianEmail: Yup.string().email('*Enter a valid email'),
    guardianPhone: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(1000000000, '*Enter a valid phone number')
      .max(10000000000, '*Enter a valid phone number'),
    birthDate: Yup.date().required('*Required'),
    gradeLevel: Yup.string(),
    schoolName: Yup.string(),
  });

  if (pageError) {
    return <NotFoundPage />;
  }

  return (
    <>
      <NavigationBar />
      {authContext?.loading || loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : error ? (
        <div className={styles.loadingContainer}>
          <h4 className={styles.errorMessage}>
            Error obtaining student's profile. Please try again later.
          </h4>
        </div>
      ) : (
        <div className={styles.rightPane}>
          <div className={styles.header}>
            <h1 className={styles.title}>Student Profile</h1>

            <div className={styles.topButtons}>
              <ToolTip title="View Transcript" placement="top">
                <button
                  className={styles.button}
                  onClick={() => {
                    window.open(`/transcript/${studentID}`, '_blank');
                  }}
                >
                  <img className={styles.icon} src={transcriptIcon} />
                </button>
              </ToolTip>
              <ToolTip title={editing ? 'Save' : 'Edit'} placement="top">
                <button
                  className={styles.button}
                  onClick={() => {
                    if (editing) {
                      studentSchema
                        .validate(student, {
                          abortEarly: false,
                        })
                        .then(() => {
                          updateStudent(student, studentID!)
                            .catch(() => {
                              window.location.reload();
                            })
                            .finally(() => {
                              setFieldErrors({});
                              setEditing(!editing);
                            });
                        })
                        .catch((error: Yup.ValidationError) => {
                          let newErrors = {} as Record<string, string>;

                          for (let i = 0; i < error.inner.length; i++) {
                            const path = error.inner[i].path;

                            if (path !== undefined) {
                              newErrors[path] = error.inner[i].message.includes(
                                'must be a `date` type',
                              )
                                ? '*Required'
                                : error.inner[i].message;
                            }
                          }
                          setFieldErrors(newErrors);
                        });
                    } else {
                      setEditing(!editing);
                    }
                  }}
                >
                  <img
                    className={styles.icon}
                    src={editing ? saveImage : editImage}
                  />
                </button>
              </ToolTip>
            </div>
          </div>

          <div className={styles.inputs}>
            <div className={styles.box} id="Name">
              <a className={styles.boxTitle}>Name</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.nameInputs}>
                    <div className={styles.group}>
                      <input
                        className={styles.inputBox}
                        onChange={(event) => {
                          setStudent({
                            ...student,
                            firstName: event.target.value,
                          });
                        }}
                        placeholder="First"
                        value={student.firstName}
                      ></input>
                      {'firstName' in fieldErrors ? (
                        <div className={styles.errorMessage}>
                          {fieldErrors.firstName}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className={styles.group}>
                      <input
                        className={styles.inputBox}
                        onChange={(event) => {
                          setStudent({
                            ...student,
                            middleName: event.target.value,
                          });
                        }}
                        placeholder="Middle"
                        value={student.middleName}
                      ></input>
                    </div>
                    <div className={styles.group}>
                      <input
                        className={styles.inputBox}
                        onChange={(event) => {
                          setStudent({
                            ...student,
                            lastName: event.target.value,
                          });
                        }}
                        placeholder="Last"
                        value={student.lastName}
                      ></input>
                      {'lastName' in fieldErrors ? (
                        <div className={styles.errorMessage}>
                          {fieldErrors.lastName}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ) : (
                  `${student?.firstName} ${
                    student?.middleName ? student?.middleName : ''
                  } ${student?.lastName}`
                )}
              </a>
            </div>

            <div className={styles.box} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.group}>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setStudent({ ...student, email: event.target.value });
                      }}
                      value={student.email}
                    ></input>
                    {'email' in fieldErrors ? (
                      <div className={styles.errorMessage}>
                        {fieldErrors.email}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  student?.email
                )}
              </a>
            </div>

            <div className={styles.box} id="Phone">
              <a className={styles.boxTitle}>Phone</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.group}>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setStudent({
                          ...student,
                          phone: parseInt(event.target.value),
                        });
                      }}
                      value={isNaN(student.phone) ? '' : student.phone}
                    ></input>
                    {'phone' in fieldErrors ? (
                      <div className={styles.errorMessage}>
                        {fieldErrors.phone}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  student?.phone
                )}
              </a>
            </div>

            <div className={styles.box} id="Birthdate">
              <a className={styles.boxTitle}>Birthdate</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.group}>
                    <DatePicker
                      label=""
                      defaultValue={
                        student.birthDate
                          ? DateTime.fromISO(student.birthDate)
                          : null
                      }
                      onChange={(newValue: DateTime | null) =>
                        setStudent({
                          ...student,
                          birthDate: newValue
                            ? formatDateToYYYYMMDD(newValue)
                            : '',
                        })
                      }
                      slotProps={{ textField: { size: 'small' } }}
                      sx={{
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
                          {
                            border: '1px solid black',
                          }, // at page load
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                          { border: '2px solid black' }, // at focused state
                      }}
                    />
                    {'birthDate' in fieldErrors ? (
                      <div className={styles.errorMessage}>
                        {fieldErrors.birthDate}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  DateTime.fromISO(student?.birthDate).toFormat('LLLL dd, yyyy')
                )}
              </a>
            </div>

            <div className={styles.box} id="Grade">
              <a className={styles.boxTitle}>Grade</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.group}>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setStudent({
                          ...student,
                          gradeLevel: event.target.value,
                        });
                      }}
                      value={student.gradeLevel}
                    ></input>
                    {'gradeLevel' in fieldErrors ? (
                      <div className={styles.errorMessage}>
                        {fieldErrors.gradeLevel}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  student?.gradeLevel
                )}
              </a>
            </div>

            <div className={styles.box} id="School">
              <a className={styles.boxTitle}>School</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.group}>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setStudent({
                          ...student,
                          schoolName: event.target.value,
                        });
                      }}
                      value={student.schoolName}
                    ></input>
                    {'schoolName' in fieldErrors ? (
                      <div className={styles.errorMessage}>
                        {fieldErrors.schoolName}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  student?.schoolName
                )}
              </a>
            </div>

            <div className={styles.bottomBox} id="Address">
              <a className={styles.boxTitle}>Address</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.nameInputs}>
                    <div className={styles.group}>
                      <input
                        className={styles.inputBox}
                        onChange={(event) => {
                          setStudent({
                            ...student,
                            addrFirstLine: event.target.value,
                          });
                        }}
                        placeholder="Street Address"
                        value={student.addrFirstLine}
                      ></input>
                      {'addrFirstLine' in fieldErrors ? (
                        <div className={styles.errorMessage}>
                          {fieldErrors.addrFirstLine}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className={styles.group}>
                      <input
                        className={styles.inputBox}
                        onChange={(event) => {
                          setStudent({
                            ...student,
                            addrSecondLine: event.target.value,
                          });
                        }}
                        placeholder="Street Address Line 2"
                        value={student.addrSecondLine}
                      ></input>
                    </div>
                    <div className={styles.group}>
                      <input
                        className={styles.inputBox}
                        onChange={(event) => {
                          setStudent({
                            ...student,
                            city: event.target.value,
                          });
                        }}
                        placeholder="City"
                        value={student.city}
                      ></input>
                      {'city' in fieldErrors ? (
                        <div className={styles.errorMessage}>
                          {fieldErrors.city}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className={styles.group}>
                      <input
                        className={styles.inputBox}
                        onChange={(event) => {
                          setStudent({
                            ...student,
                            state: event.target.value,
                          });
                        }}
                        placeholder="State"
                        value={student.state}
                      ></input>
                      {'state' in fieldErrors ? (
                        <div className={styles.errorMessage}>
                          {fieldErrors.state}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className={styles.group}>
                      <input
                        className={styles.inputBox}
                        onChange={(event) => {
                          setStudent({
                            ...student,
                            zipCode: event.target.value,
                          });
                        }}
                        placeholder="Zip Code"
                        value={student.zipCode}
                      ></input>
                      {'zipCode' in fieldErrors ? (
                        <div className={styles.errorMessage}>
                          {fieldErrors.zipCode}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>{student?.addrFirstLine}</div>
                    <div>
                      {student?.addrSecondLine ? student?.addrSecondLine : ''}
                    </div>
                    <div>{student?.city}</div>
                    <div>{student?.state}</div>
                    <div>{student?.zipCode}</div>
                  </div>
                )}
              </a>
            </div>
          </div>

          <div className={styles.secondTitle}>
            <h2>Guardian Information</h2>
          </div>
          <div className={styles.inputs}>
            <div className={styles.box} id="Guardian Name">
              <a className={styles.boxTitle}>Name</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.nameInputs}>
                    <div className={styles.group}>
                      <input
                        className={styles.inputBox}
                        onChange={(event) => {
                          setStudent({
                            ...student,
                            guardianFirstName: event.target.value,
                          });
                        }}
                        placeholder="First"
                        value={student.guardianFirstName ?? ''}
                      ></input>
                      {'guardianFirstName' in fieldErrors ? (
                        <div className={styles.errorMessage}>
                          {fieldErrors.guardianFirstName}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className={styles.group}>
                      <input
                        className={styles.inputBox}
                        onChange={(event) => {
                          setStudent({
                            ...student,
                            guardianLastName: event.target.value,
                          });
                        }}
                        placeholder="Last"
                        value={student.guardianLastName ?? ''}
                      ></input>
                      {'guardianLastName' in fieldErrors ? (
                        <div className={styles.errorMessage}>
                          {fieldErrors.guardianLastName}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ) : (
                  `${student?.guardianFirstName ?? ''} ${
                    student?.guardianLastName ?? ''
                  }`
                )}
              </a>
            </div>

            <div className={styles.box} id="Guardian Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.group}>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setStudent({
                          ...student,
                          guardianEmail: event.target.value,
                        });
                      }}
                      value={student.guardianEmail ?? ''}
                    ></input>
                    {'guardianEmail' in fieldErrors ? (
                      <div className={styles.errorMessage}>
                        {fieldErrors.guardianEmail}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  student?.guardianEmail ?? ''
                )}
              </a>
            </div>

            <div className={styles.bottomBox} id="Guardian Phone">
              <a className={styles.boxTitle}>Phone</a>
              <a className={styles.boxData}>
                {editing ? (
                  <div className={styles.group}>
                    <input
                      className={styles.inputBox}
                      onChange={(event) => {
                        setStudent({
                          ...student,
                          guardianPhone: parseInt(event.target.value),
                        });
                      }}
                      value={student.guardianPhone ?? ''}
                    ></input>
                    {'guardianPhone' in fieldErrors ? (
                      <div className={styles.errorMessage}>
                        {fieldErrors.guardianPhone}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  student?.guardianPhone ?? ''
                )}
              </a>
            </div>
          </div>

          <h1 className={styles.coursesTitle}>Courses</h1>
          <div className={styles.courseList}>{displayCourseCards()}</div>
        </div>
      )}
    </>
  );
};

export default StudentProfilePage;
