import { useState } from 'react';
import * as Yup from 'yup';
import { useAuth } from '../../auth/AuthProvider';
import { addStudent } from '../../backend/FirestoreCalls';
import { type Student } from '../../types/StudentType';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';
import styles from './AddStudentPage.module.css';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

const AddStudentPage = ({ setStudentAdded }: any): JSX.Element => {
  const blankStudent: Student = {
    firstName: '',
    lastName: '',
    addrFirstLine: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: 0,
    birthDate: '',
    courseInformation: [],
  };

  const [student, setStudent] = useState<Student>(blankStudent);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const authContext = useAuth();
  const navigate = useNavigate();

  const formatDateToYYYYMMDD = (dateTime: DateTime) => {
    const date = dateTime.toJSDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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

  const createStudent = () => {
    studentSchema
      .validate(student, {
        abortEarly: false,
      })
      .then(() => {
        addStudent(student)
          .then(() => {
            setStudentAdded(true);
            navigate('/students');
          })
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
  };

  return (
    <>
      <NavigationBar />
      {authContext?.loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.rightPane}>
          <div className={styles.header}>
            <h1 className={styles.title}>New Student</h1>
          </div>

          <div className={styles.inputs}>
            <div className={styles.box} id="Name">
              <a className={styles.boxTitle}>Name</a>
              <a className={styles.boxData}>
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
              </a>
            </div>

            <div className={styles.box} id="Email">
              <a className={styles.boxTitle}>Email</a>
              <a className={styles.boxData}>
                <div className={styles.group}>
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setStudent({ ...student, email: event.target.value });
                    }}
                  ></input>
                  {'email' in fieldErrors ? (
                    <div className={styles.errorMessage}>
                      {fieldErrors.email}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </a>
            </div>

            <div className={styles.box} id="Phone">
              <a className={styles.boxTitle}>Phone</a>
              <a className={styles.boxData}>
                <div className={styles.group}>
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setStudent({
                        ...student,
                        phone: parseInt(event.target.value),
                      });
                    }}
                    placeholder="1231231234"
                  ></input>
                  {'phone' in fieldErrors ? (
                    <div className={styles.errorMessage}>
                      {fieldErrors.phone}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </a>
            </div>

            <div className={styles.box} id="Birthdate">
              <a className={styles.boxTitle}>Birthdate</a>
              <a className={styles.boxData}>
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
              </a>
            </div>

            <div className={styles.box} id="Grade">
              <a className={styles.boxTitle}>Grade</a>
              <a className={styles.boxData}>
                <div className={styles.group}>
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setStudent({
                        ...student,
                        gradeLevel: event.target.value,
                      });
                    }}
                  ></input>
                  {'gradeLevel' in fieldErrors ? (
                    <div className={styles.errorMessage}>
                      {fieldErrors.gradeLevel}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </a>
            </div>

            <div className={styles.box} id="School">
              <a className={styles.boxTitle}>School</a>
              <a className={styles.boxData}>
                <div className={styles.group}>
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setStudent({
                        ...student,
                        schoolName: event.target.value,
                      });
                    }}
                  ></input>
                  {'schoolName' in fieldErrors ? (
                    <div className={styles.errorMessage}>
                      {fieldErrors.schoolName}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </a>
            </div>

            <div className={styles.box} id="Address">
              <a className={styles.boxTitle}>Address</a>
              <a className={styles.boxData}>
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
              </a>
            </div>

            <div className={styles.box} id="Guardian Name">
              <a className={styles.boxTitle}>Guardian Name</a>
              <a className={styles.boxData}>
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
              </a>
            </div>

            <div className={styles.box} id="Guardian Email">
              <a className={styles.boxTitle}>Guardian Email</a>
              <a className={styles.boxData}>
                <div className={styles.group}>
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setStudent({
                        ...student,
                        guardianEmail: event.target.value,
                      });
                    }}
                  ></input>
                  {'guardianEmail' in fieldErrors ? (
                    <div className={styles.errorMessage}>
                      {fieldErrors.guardianEmail}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </a>
            </div>

            <div className={styles.bottomBox} id="Guardian Phone">
              <a className={styles.boxTitle}>Guardian Phone</a>
              <a className={styles.boxData}>
                <div className={styles.group}>
                  <input
                    className={styles.inputBox}
                    onChange={(event) => {
                      setStudent({
                        ...student,
                        guardianPhone: parseInt(event.target.value),
                      });
                    }}
                    placeholder="1231231234"
                  ></input>
                  {'guardianPhone' in fieldErrors ? (
                    <div className={styles.errorMessage}>
                      {fieldErrors.guardianPhone}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </a>
            </div>
          </div>

          <div className={styles.bottomButtons}>
            <button
              className={styles.createStudentButton}
              onClick={() => {
                createStudent();
              }}
            >
              Add Student
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => navigate('/students')}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddStudentPage;
