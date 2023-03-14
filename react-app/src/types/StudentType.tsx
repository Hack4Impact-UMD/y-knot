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
  birthdate: Date;
  minor: boolean;
  gradeLevel?: string;
  schoolName?: string;
  courseInformation: StudentCourse[];
}

export interface StudentCourse {
  id: string;
  startDate: Date;
  endDate: Date;
  attendance: StudentAttendance[];
  homeworks: StudentHomework[];
  progress: Progress;
}

export interface StudentAttendance {
  date: Date;
  attended: boolean;
}

export interface StudentHomework {
  name: string;
  completed: boolean;
}

export type Progress = 'INPROGRESS' | 'PASS' | 'FAIL';
