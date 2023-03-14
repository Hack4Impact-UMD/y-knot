export type Student = {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  addrFirstLine: string;
  addrSecondLine?: string;
  city: string;
  state: string;
  zipCode: number;
  email: string;
  birthdate: Date;
  gradeLevel?: number;
  schoolName?: string;
  courseInformation: StudentCourses[];
};

export type StudentCourses = {
  id?: string;
  startDate: Date;
  endDate: Date;
  attendance: StudentAttendance[];
  homeworks: StudentHomework[];
  progress: Progress;
};

export type StudentAttendance = {
  date: Date;
  attended: boolean;
};

export type StudentHomework = {
  name: string;
  completed: boolean;
};

export type Progress = 'INPROGRESS' | 'PASS' | 'FAIL';
