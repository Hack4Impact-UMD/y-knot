export type Course = {
  name: string;
  startDate: Date;
  endDate: Date;
  meetingTime: string;
  students: string[];
  teachers: string[];
  application?: boolean;
  classType: ClassType;
  prerequisites?: string[];
  formId?: string;
  introEmail: IntroEmail;
  attendance: Attendance[];
  homeworks: Homework[];
};

export type IntroEmail = {
  content: string;
};

export type Attendance = {
  date: Date;
  notes: string;
};

export type Homework = {
  name: string;
  notes: string;
};

export type ClassType = 'ADULT' | 'STUDENT' | 'LEADERSHIP';
