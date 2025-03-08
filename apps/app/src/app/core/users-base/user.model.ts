export const createUserAction = 'CREATE_USER';
export const updateUserAction = 'UPDATE_USER';

export type userFormAction = typeof createUserAction | typeof updateUserAction;

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserState {
  data: User[];
  activeUserId: string | undefined;
}

export interface UserPayload {
  name: string;
  email: string;
}

export interface UserFormData {
  name: User['name'];
  email: User['email'];
  id?: User['id'];
}

export interface UpdateDialogFormResponse {
  action: 'UPDATE_USER';
  payload: {
    id: User['id'];
    name: User['name'];
    email: User['email'];
  };
}

export interface CreateDialogFormResponse {
  action: 'CREATE_USER';
  payload: {
    name: User['name'];
    email: User['email'];
  };
}
