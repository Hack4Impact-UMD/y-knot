import { addStudent } from '../backend/FirestoreCalls';
import { type Student } from '../types/StudentType';
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
    .then(() => console.log('student added'))
    .catch((error) => console.log(error));
};
