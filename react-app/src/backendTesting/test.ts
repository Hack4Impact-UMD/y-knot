import {
  addCourse,
  addStudent,
  getCourse,
  updateCourse,
} from '../backend/FirestoreCalls';
import { type Course } from '../types/CourseType';
import { type Student, type StudentCourse } from '../types/StudentType';

export const addSampleStudent = ({
  firstName = 'firstname',
  middleName = 'middlename',
  lastName = 'lastname',
  addrFirstLine = 'addr first',
  addrSecondLine = 'addr second',
  city = 'sample city',
  state = 'sample state',
  zipCode = '11111',
  email = 'sample@gmail.com',
  phone = 1111111111,
  guardianFirstName = 'guardianFirstName',
  guardianLastName = 'guardianFirstName',
  guardianEmail = 'guardian@gmail.com',
  guardianPhone = 1111112222,
  birthDate = '2020-12-31',
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
    phone,
    guardianFirstName,
    guardianLastName,
    guardianEmail,
    guardianPhone,
    birthDate,
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
  students = [],
  teachers = [],
  leadershipApp = false,
  formId = 'test123',
  introEmail = { content: 'This is an intro email.', files: [] },
  attendance = [{ date: '2023-04-26', notes: 'This is a note.' }],
  homeworks = [{ name: 'Homework 1', notes: 'This is also a note.' }],
}) => {
  const course: Course = {
    name,
    startDate,
    endDate,
    students,
    teachers,
    leadershipApp,
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

export async function addStudentInCourse(courseId: string): Promise<void> {
  try {
    /* Add student to backend */
    const student: Student = {
      firstName: 'Milky',
      lastName: 'Way',
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
      courseInformation: [],
    };

    const studentCourse: StudentCourse = {
      id: courseId,
      attendance: [],
      homeworks: [],
      progress: 'INPROGRESS',
    };

    /* Add student and update their course information with the given courseId */
    student.courseInformation.push(studentCourse);
    const studentId = await addStudent(student);

    /* add the student in the course's Students array */
    const course = await getCourse(courseId);
    course.students.push(studentId);
    await updateCourse(course, courseId);

    console.log('added student in course');
  } catch (error) {
    console.error('could not add student in course', error);
  }
}
