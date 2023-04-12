export interface YKNOTUser {
  name: string;
  auth_id: string;
  type: Role;
  userInfo?: Teacher;
}

export interface Teacher {
  email: string;
  classes: TeacherCourse[];
}

export interface TeacherCourse {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

export type Role = 'ADMIN' | 'TEACHER';
