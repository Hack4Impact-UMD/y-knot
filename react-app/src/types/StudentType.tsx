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
  birthDate: String;
  minor: boolean;
  gradeLevel?: string;
  schoolName?: string;
  courseInformation: StudentCourse[];
}

export interface StudentCourse {
  id: string;
  startDate: string;
  endDate: string;
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
