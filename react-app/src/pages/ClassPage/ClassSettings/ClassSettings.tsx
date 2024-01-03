import { useState, useRef } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import type { Course } from '../../../types/CourseType';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';
import styles from './ClassSettings.module.css';
import Select from 'react-select';
import editImage from '../../../assets/edit.svg';
import saveImage from '../../../assets/save.svg';

const ClassPage = (props: {
  course: Course;
  courseID: string;
}): JSX.Element => {
  const [course, setCourse] = useState<Course>(props.course);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<boolean>(false);
  const dropdownOptions = ['Program', 'Academy', 'Club'];

  function formatDateToYYYYMMDD(dateTime: DateTime) {
    const date = dateTime.toJSDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function titleCase(str: string) {
    return str && str[0].toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className={styles.mainContainer}>
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
              <div className={styles.errorMessage}>{fieldErrors.name}</div>
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
              defaultValue={DateTime.fromISO(course.startDate)}
              onChange={(newValue: DateTime | null) =>
                setCourse({
                  ...course,
                  startDate: newValue ? formatDateToYYYYMMDD(newValue) : '',
                })
              }
              slotProps={{ textField: { size: 'small' } }}
              sx={{
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid black',
                }, // at page load
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                  { border: '2px solid black' }, // at focused state
              }}
            />
            {'startDate' in fieldErrors ? (
              <div className={styles.errorMessage}>{fieldErrors.startDate}</div>
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
                defaultValue={DateTime.fromISO(course.endDate)}
                onChange={(newValue: DateTime | null) =>
                  setCourse({
                    ...course,
                    endDate: newValue ? formatDateToYYYYMMDD(newValue) : '',
                  })
                }
                slotProps={{ textField: { size: 'small' } }}
                sx={{
                  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid black',
                  }, // at page load
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                    { border: '2px solid black' }, // at focused state
                }}
              />
              {'endDate' in fieldErrors ? (
                <div className={styles.errorMessage}>{fieldErrors.endDate}</div>
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
              defaultValue={{
                value: titleCase(course.courseType.toString()),
                label: titleCase(course.courseType.toString()),
              }}
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
                onChange={() => setCourse({ ...course, leadershipApp: true })}
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
                onChange={() => setCourse({ ...course, leadershipApp: false })}
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
              value={course.formId}
              onChange={(event) => {
                setCourse({
                  ...course,
                  formId: event.target.value,
                });
              }}
            ></input>
            {'formId' in fieldErrors ? (
              <div className={styles.errorMessage}>{fieldErrors.formId}</div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className={styles.bottomButtons}>
        {/* <button
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
              </button> */}
      </div>
      <div className={styles.bottomButton}>
        {/* <ToolTip title={editing ? 'Save' : 'Edit'} placement="top">
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
                              newErrors[path] = error.inner[i].message;
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
              </ToolTip> */}
      </div>
    </div>
  );
};

export default ClassPage;
