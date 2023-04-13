export interface Course {
  name: string;
  startDate: Date;
  endDate: Date;
  meetingTime: string;
  students: string[];
  teachers: string[];
  application: boolean;
  courseType: CourseType;
  prerequisites: string[];
  formId: string;
  introEmail: IntroEmail;
  attendance: Attendance[];
  homeworks: Homework[];
}

export interface IntroEmail {
  content: string;
}

export interface Attendance {
  date: Date;
  notes: string;
}

export interface Homework {
  name: string;
  notes: string;
}

export type CourseType = 'ADULT' | 'MINOR' | 'LEADERSHIP';
