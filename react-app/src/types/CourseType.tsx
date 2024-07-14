export interface CourseID extends Course {
  // Contains an id as well
  id: string;
}

export interface Course {
  name: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  students: string[]; // list of student ids
  teachers: string[]; // list of teacher ids
  leadershipApp: boolean; // is this a leadership class, which requires an application
  formId: string;
  introEmail: IntroEmail;
  attendance: Attendance[];
  homeworks: Homework[];
}

export interface IntroEmail {
  content: string;
  files: IntroEmailFile[];
}

export interface IntroEmailFile {
  name: string;
  downloadURL: string;
}

export interface Attendance {
  date: string;
  notes: string;
}

export interface Homework {
  name: string;
  notes: string;
}
