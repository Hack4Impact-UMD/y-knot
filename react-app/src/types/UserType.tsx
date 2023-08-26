export interface YKNOTUser {
  name: string;
  auth_id: string;
  type: Role;
  userInfo?: { email: string; courses: string[] };
}

export interface Teacher extends YKNOTUser {
  userInfo: { email: string; courses: string[] };
}

export interface TeacherID extends Teacher {
  id: string;
}
export type Role = 'ADMIN' | 'TEACHER';
