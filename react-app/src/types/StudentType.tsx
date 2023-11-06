export interface StudentID extends Student {
  // Contains an id as well
  id: string;
}

export interface Student {
  firstName: string;
  middleName?: string;
  lastName: string;
  addrFirstLine: string;
  addrSecondLine?: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: number;
  guardianFirstName: string;
  guardianLastName: string;
  guardianEmail: string;
  guardianPhone: number;
  birthDate: string; // "YYYY-MM-DD"
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
