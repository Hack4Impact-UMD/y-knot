export interface YKNOTUser {
  name: string;
  auth_id: string;
  type: Role;
  userInfo?: Teacher;
}

export interface Teacher {
  email: string;
  courses: Set<string>;
}

export type Role = 'ADMIN' | 'TEACHER';
