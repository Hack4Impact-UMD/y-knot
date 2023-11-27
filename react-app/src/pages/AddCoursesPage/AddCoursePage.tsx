import React from 'react';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../../components/LoadingScreen/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import type { Course, CourseID } from '../../types/CourseType';
import { getCourse } from '../../backend/FirestoreCalls';
import { DateTime } from 'luxon';
import { ToolTip } from '../../components/ToolTip/ToolTip';
import styles from './AddCoursePage.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import Select from 'react-select';

function AddCoursePage() {
  const dropdownOptions = ['Program', 'Academy', 'Club'];
  const navigate = useNavigate();
  const authContext = useAuth();

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
                    placeholder="Enter Name"
                  ></input>
                </div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>Start Date</p>
                <div className={styles.inputContainer}>
                  <DatePicker label="January 31, 2023" />
                </div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>End Date</p>
                <div className={styles.inputContainer}>
                  <div className={styles.inputContainer}>
                    <DatePicker label="January 31, 2023" />
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
                        borderColor: 'black',
                        width: '300px',
                      }),
                    }}
                    options={dropdownOptions.map((option) => {
                      return { value: option, label: option };
                    })}
                  />
                </div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>Teacher(s)</p>
                <div className={styles.inputContainer}></div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>Leader Application</p>
                <div className={styles.inputContainer}>
                  <div className={styles.radioButtonGroup}>
                    <input
                      className={styles.radioButton}
                      id="Yes"
                      type="radio"
                      name="radioGroup"
                      value="yes"
                      checked
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
                    />
                    <label className={styles.noLabel} htmlFor="No">
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className={styles.studentBox}>
                <p className={styles.name}>Form ID</p>
                <div className={styles.inputContainer}>
                  <input
                    className={styles.inputBox}
                    placeholder="Enter ID"
                  ></input>
                </div>
              </div>
            </div>
            <div className={styles.bottomButtons}>
              <button className={styles.createCourseButton}>
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
