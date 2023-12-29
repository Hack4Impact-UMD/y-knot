import React from 'react';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../../components/LoadingScreen/Loading';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types/CourseType';
import { addCourse } from '../../backend/FirestoreCalls';
import { DateTime } from 'luxon';
import styles from './AddCoursePage.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import Select from 'react-select';
import * as Yup from 'yup';

function AddCoursePage({ setFormSubmitted, history }: any) {
  const dropdownOptions = ['Program', 'Academy', 'Club'];
  const navigate = useNavigate();
  const authContext = useAuth();

  const courseSchema = Yup.object().shape({
    name: Yup.string().required('*Required'),
    startDate: Yup.date().required('*Required'),
    endDate: Yup.date()
      .required('*Required')
      .min(Yup.ref('startDate'), '*End date must be after start date'),
    courseType: Yup.string()
      .required('*Required')
      .oneOf(['PROGRAM', 'ACADEMY', 'CLUB'], '*Invalid course type'),
    leadershipApp: Yup.boolean().required('*Required'),
    formId: Yup.string().required('*Required'),
  });

  const blankCourse: Course = {
    name: '',
    startDate: '',
    endDate: '',
    meetingTime: '',
    students: [],
    teachers: [],
    leadershipApp: false, // is this a leadership class, which requires an application
    courseType: 'PROGRAM',
    formId: '',
    introEmail: { content: '' },
    attendance: [],
    homeworks: [],
  };
  const [course, setCourse] = useState<Course>(blankCourse);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function formatDateToYYYYMMDD(dateTime: DateTime) {
    const date = dateTime.toJSDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const handleClose = () => {
    navigate('/courses');
  };

  return (
    <div>
      {authContext?.loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <>
          <NavigationBar />
          <div className={styles.rightPane}>
            <div className={styles.headerContainer}>
              <h1 className={styles.newClassHeader}>New Course</h1>
            </div>

            <div className={styles.listBox}>
              <div className={styles.studentBoxTop}>
                <p className={styles.name}>Course Name</p>
                <div className={styles.inputContainer}>
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setCourse({
                        ...course,
                        name: event.target.value,
                      });
                    }}
                    placeholder="Enter Name"
                    value={course.name}
                  ></input>
                  {'name' in fieldErrors ? (
                    <div className={styles.errorMessage}>
                      {fieldErrors.name}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>Start Date</p>
                <div className={styles.inputContainer}>
                  <DatePicker
                    label=""
                    onChange={(newValue: DateTime | null) =>
                      setCourse({
                        ...course,
                        startDate: newValue
                          ? formatDateToYYYYMMDD(newValue)
                          : '',
                      })
                    }
                    slotProps={{ textField: { size: 'small' } }}
                    sx={{
                      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
                        { border: '1px solid black' }, // at page load
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                        { border: '2px solid black' }, // at focused state
                    }}
                  />
                  {'startDate' in fieldErrors ? (
                    <div className={styles.errorMessage}>
                      {fieldErrors.startDate}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>End Date</p>
                <div className={styles.inputContainer}>
                  <div className={styles.inputContainer}>
                    <DatePicker
                      label=""
                      onChange={(newValue: DateTime | null) =>
                        setCourse({
                          ...course,
                          endDate: newValue
                            ? formatDateToYYYYMMDD(newValue)
                            : '',
                        })
                      }
                      slotProps={{ textField: { size: 'small' } }}
                      sx={{
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
                          { border: '1px solid black' }, // at page load
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                          { border: '2px solid black' }, // at focused state
                      }}
                    />
                    {'endDate' in fieldErrors ? (
                      <div className={styles.errorMessage}>
                        {fieldErrors.endDate}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>Course Type</p>
                <div className={styles.inputContainer}>
                  <Select
                    placeholder="Select Program"
                    className={styles.dateSelection}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        minWidth: '300px',
                        height: '40px',
                        borderColor: 'black',
                        boxShadow: 'none',
                        '&:focus-within': {
                          border: '2px solid black',
                        },
                        '&:hover': {
                          border: '1px solid black',
                        },
                      }),
                    }}
                    options={dropdownOptions.map((option) => {
                      return { value: option, label: option };
                    })}
                    onChange={(newValue) => {
                      setCourse({
                        ...course,
                        endDate: newValue ? newValue.value.toUpperCase() : '',
                      });
                    }}
                    defaultValue={{ value: 'Program', label: 'Program' }}
                  />
                </div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>Teacher(s)</p>
                <div className={styles.inputContainer}></div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>Leadership Application</p>
                <div className={styles.inputContainer}>
                  <div className={styles.radioButtonGroup}>
                    <input
                      className={styles.radioButton}
                      id="Yes"
                      type="radio"
                      name="radioGroup"
                      value="yes"
                      checked={course.leadershipApp === true}
                      onChange={() =>
                        setCourse({ ...course, leadershipApp: true })
                      }
                    />
                    <label className={styles.yesLabel} htmlFor="Yes">
                      Yes
                    </label>
                    <input
                      className={styles.radioButton}
                      id="No"
                      type="radio"
                      name="radioGroup"
                      value="no"
                      checked={course.leadershipApp === false}
                      onChange={() =>
                        setCourse({ ...course, leadershipApp: false })
                      }
                    />
                    <label className={styles.noLabel} htmlFor="No">
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>JotForm ID</p>
                <div className={styles.inputContainer}>
                  <input
                    className={styles.inputBox}
                    placeholder="Enter ID"
                    onChange={(event) => {
                      setCourse({
                        ...course,
                        formId: event.target.value,
                      });
                    }}
                  ></input>
                  {'formId' in fieldErrors ? (
                    <div className={styles.errorMessage}>
                      {fieldErrors.formId}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.bottomButtons}>
              <button
                className={styles.createCourseButton}
                onClick={() => {
                  courseSchema
                    .validate(course, { abortEarly: false })
                    .then(() => {
                      addCourse(course)
                        .then(() => {
                          setFormSubmitted(true);
                          handleClose();
                        })
                        .catch((error) => {})
                        .finally(() => {
                          setFieldErrors({});
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
                }}
              >
                Create Course
              </button>
              <button className={styles.cancelButton} onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AddCoursePage;
