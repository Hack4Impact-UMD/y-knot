export interface YKNOTUser {
  name: string;
  auth_id: string;
  type: Role;
  userInfo?: Teacher;
}

export interface Teacher {
  email: string;
  gender?: string;
  pronoun?: string;
  classes: TeacherCourse[];
}

export interface TeacherCourse {
  id: string;
  name: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
}

export type Role = 'ADMIN' | 'TEACHER';
