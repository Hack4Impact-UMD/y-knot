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

export interface LeadershipApplicant extends Student {
  idx: number; // display order index
  dateApplied: string; // "YYYY-MM-DD"
  gpa: string;
  gender: string;
  textAnswer1: string;
  transcript: LeadershipFile;
  recLetter: LeadershipFile;
  textAnswer2: string;
  status: LeadershipStatus;
  statusNote: string;
}

export interface LeadershipFile {
  name: string;
  path: string;
  downloadURL: string;
}

export type Progress = 'INPROGRESS' | 'PASS' | 'FAIL' | 'NA';

export type LeadershipStatus = 'ACCEPTED' | 'PENDING' | 'REJECTED' | 'NA';
