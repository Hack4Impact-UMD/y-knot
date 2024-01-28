import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types/CourseType';
import { type TeacherID } from '../../types/UserType';
import { getAllTeachers, addCourse } from '../../backend/FirestoreCalls';
import { DateTime } from 'luxon';
import { DatePicker } from '@mui/x-date-pickers';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import styles from './AddCoursePage.module.css';
import Loading from '../../components/LoadingScreen/Loading';
import Select, { type OptionProps } from 'react-select';
import * as Yup from 'yup';

const InputOption: React.FC<OptionProps<any, true, any>> = ({
  isSelected,
  innerProps,
  children,
}) => {
  const { onMouseDown, onMouseUp, onMouseLeave, ...restInnerProps } =
    innerProps || {};

  const selectionStyle = {
    alignItems: 'center',
    backgroundColor: isSelected ? 'var(--color-orange)' : 'transparent',
    color: isSelected ? 'white' : 'black',
    display: 'flex ',
    fontSize: 'large',
    paddingTop: '5px',
    paddingBottom: '5px',
    borderRadius: '5px',
    margin: '5px',
  };

  const checkboxStyle = {
    marginRight: '10px',
    marginLeft: '10px',
    fontSize: 'large',
    width: '20px',
    height: '20px',
    color: isSelected ? 'white' : 'transparent',
    backgroundColor: 'var(--color-orange)',
    accentColor: 'var(--color-orange)',
    opacity: '50%',
  };

  return (
    <div
      {...restInnerProps}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={selectionStyle}
    >
      <input type="checkbox" checked={isSelected} style={checkboxStyle} />
      {children}
    </div>
  );
};

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

  const selectBoxStyle = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      width: '300px',
      height: 'fit-content',
      borderColor: 'black',
      boxShadow: 'none',
      '&:focus-within': {
        border: '2px solid black',
      },
      '&:hover': {
        border: '1px solid black',
      },
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'var(--color-orange)',
    }),
  };

  const blankCourse: Course = {
    name: '',
    startDate: '',
    endDate: '',
    students: [],
    teachers: [],
    leadershipApp: false, // is this a leadership class, which requires an application
    courseType: 'PROGRAM',
    formId: '',
    introEmail: { content: '', files: [] },
    attendance: [],
    homeworks: [],
  };
  const [course, setCourse] = useState<Course>(blankCourse);
  const [teachers, setTeachers] = useState<Array<Partial<TeacherID>>>([]);
  const [teacherList, setTeacherList] = useState<Array<Partial<TeacherID>>>([]);
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

  useEffect(() => {
    getAllTeachers()
      .then((allTeachers) => {
        const partialTeachers: Array<Partial<TeacherID>> = allTeachers.map(
          (currTeacher) => ({
            name: currTeacher.name,
            id: currTeacher.id,
          }),
        );
        setTeachers(partialTeachers);
      })
      .catch((err) => {})
      .finally(() => {});
  });

  useEffect(() => {
    setTeacherList(teachers);
  }, [teachers]);

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
                        width: 'calc(12vw + 100px)',
                        minWidth: '30px',
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
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: 'transparent',
                        primary50: 'transparent',
                        primary: 'var(--color-orange)',
                      },
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
                <div className={styles.inputContainer}>
                  <Select
                    defaultValue={null}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    onChange={(selectedOptions: any) => {
                      setCourse({
                        ...course,
                        teachers: selectedOptions
                          ? selectedOptions.map((opt: any) => opt.value)
                          : '',
                      });
                    }}
                    options={teacherList.map((teacher) => ({
                      value: teacher.id,
                      label: teacher.name,
                    }))}
                    components={{
                      Option: InputOption,
                      /* Remove clear indicator from the main selection box */
                      ClearIndicator: () => null,
                    }}
                    placeholder="Select Teacher(s)"
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        borderColor: 'black',
                        '&:hover': {
                          border: '1px solid black',
                        },
                      }),
                    }} 
                    className={styles.dateSelection}
                  />
                </div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>Leadership Academy</p>
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
                      console.log(course);
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
                          console.log('date error: ' + error.inner[i].message);
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
