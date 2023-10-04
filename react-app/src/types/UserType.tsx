export interface YKNOTUser {
  name: string;
  auth_id: string;
  email: string;
  type: Role;
}

export interface Teacher extends YKNOTUser {
  courses: string[];
}

export interface TeacherID extends Teacher {
  id: string;
}

export type Role = 'ADMIN' | 'TEACHER';
