export interface StudentID {
  // Contains an id as well
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  addrFirstLine: string;
  addrSecondLine?: string;
  city: string;
  state: string;
  zipCode: number;
  email: string;
  birthDate: string;
  minor: boolean;
  gradeLevel?: string;
  schoolName?: string;
  courseInformation: StudentCourse[];
}

export interface Student {
  firstName: string;
  middleName?: string;
  lastName: string;
  addrFirstLine: string;
  addrSecondLine?: string;
  city: string;
  state: string;
  zipCode: number;
  email: string;
  birthDate: string;
  minor: boolean;
  gradeLevel?: string;
  schoolName?: string;
  courseInformation: StudentCourse[];
}

export interface StudentCourse {
  id: string;
  attendance: StudentAttendance[];
  homeworks: StudentHomework[];
  progress: Progress;
}

export interface StudentAttendance {
  date: string;
  attended: boolean;
}

export interface StudentHomework {
  name: string;
  completed: boolean;
}

export type Progress = 'INPROGRESS' | 'PASS' | 'FAIL';
