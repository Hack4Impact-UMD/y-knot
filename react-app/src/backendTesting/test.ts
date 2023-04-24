import { addStudent, addCourse } from '../backend/FirestoreCalls';
import { type Student } from '../types/StudentType';
import {
  type Course,
  type IntroEmail,
  type Attendance,
  type Homework,
  type ClassType,
} from '../types/CourseType';

export const addSampleStudent = ({
  firstName = 'firstname',
  middleName = 'middlename',
  lastName = 'lastname',
  addrFirstLine = 'addr first',
  addrSecondLine = 'addr second',
  city = 'sample city',
  state = 'sample state',
  zipCode = 11111,
  email = 'sample@gmail.com',
  birthDate = '2020-12-31',
  minor = true,
  gradeLevel = '10th',
  schoolName = 'YKnot High School',
  courseInformation = [],
}) => {
  const student: Student = {
    firstName,
    middleName,
    lastName,
    addrFirstLine,
    addrSecondLine,
    city,
    state,
    zipCode,
    email,
    birthDate,
    minor,
    gradeLevel,
    schoolName,
    courseInformation,
  };
  addStudent(student)
    .then(() => {
      console.log('student added');
    })
    .catch((error) => {
      console.log(error);
    });
};

export const addSampleCourse = ({
  name = 'Course Name',
  startDate = '2023-04-23',
  endDate = '2023-09-13',
  meetingTime = 'Thursday 3:30PM',
  students = [],
  teachers = [],
  application = false,
  classType = 'MINOR' as ClassType,
  prerequisites = [],
  formId = 'test123',
  introEmail = { content: 'This is an intro email.' },
  attendance = [{ date: '2023-04-26', notes: 'This is a note.' }],
  homeworks = [{ name: 'Homework 1', notes: 'This is also a note.' }],
}) => {
  const course: Course = {
    name,
    startDate,
    endDate,
    meetingTime,
    students,
    teachers,
    application,
    classType,
    prerequisites,
    formId,
    introEmail,
    attendance,
    homeworks,
  };
  addCourse(course)
    .then(() => {
      console.log('course added');
    })
    .catch((error) => {
      console.log(error);
    });
};
