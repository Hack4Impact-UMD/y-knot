export type YKNOTUser = {
  name: string;
  auth_id: string;
  type: Role;
  userInfo?: Teacher;
};

export type Teacher = {
  email: string;
  gender?: string;
  pronoun?: string;
  classes: TeacherCourse[];
};

export type TeacherCourse = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
};

export type Role = 'ADMIN' | 'TEACHER';
