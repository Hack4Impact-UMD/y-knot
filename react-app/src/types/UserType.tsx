export interface YKNOTUser {
  name: string;
  auth_id: string;
  type: Role;
  userInfo?: Teacher;
}

export interface Teacher extends YKNOTUser {
  email: string;
  gender?: string;
  pronoun?: string;
  classes: TeacherCourse[];
}

export interface TeacherCourse {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

export type Role = 'ADMIN' | 'TEACHER';
