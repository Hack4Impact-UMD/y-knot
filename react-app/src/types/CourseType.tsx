export interface Course {
  name: string;
  startDate: Date;
  endDate: Date;
  meetingTime: string;
  students: string[];
  teachers: string[];
  application: boolean;
  classType: ClassType;
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

export type ClassType = 'ADULT' | 'MINOR' | 'LEADERSHIP';
