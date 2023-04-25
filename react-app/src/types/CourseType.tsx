export interface Course {
  name: string;
  startDate: Date;
  endDate: Date;
  meetingTime: string;
  students: Set<string>;
  teachers: Set<string>;
  application: boolean;
  courseType: CourseType;
  prerequisites: Set<string>;
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
