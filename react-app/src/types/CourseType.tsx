export interface Course {
  name: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  meetingTime: string;
  students: string[]; // list of student ids
  teachers: string[]; // list of teacher ids
  leadershipApp: boolean; // is this a leadership class, which requires an application
  courseType: CourseType;
  formId: string;
  introEmail: IntroEmail;
  attendance: Attendance[];
  homeworks: Homework[];
}

export interface IntroEmail {
  content: string;
}

export interface Attendance {
  date: string;
  notes: string;
}

export interface Homework {
  name: string;
  notes: string;
}

export type CourseType = 'PROGRAM' | 'ACADEMY' | 'CLUB';
