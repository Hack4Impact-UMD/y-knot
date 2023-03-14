export type YKNOTUser = {
  name: string;
  firebase_id: string;
  type: Role;
};

export type Role = 'ADMIN' | 'TEACHER';
