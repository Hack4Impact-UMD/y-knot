export interface YKNOTUser {
  name: string;
  auth_id: string;
  type: Role;
  userInfo?: Teacher;
}

export interface Teacher {
  email: string;
  courses: string[];
}

export type Role = 'ADMIN' | 'TEACHER';
