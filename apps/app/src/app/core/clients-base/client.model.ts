export const createUserAction = 'CREATE_USER';
export const updateUserAction = 'UPDATE_USER';

export type userFormAction = typeof createUserAction | typeof updateUserAction;

export interface Client {
  id: string;
  name: string;
  email: string;
}

export interface UserState {
  data: Client[];
  activeClientId: string | undefined;
}

export interface UserPayload {
  name: string;
  email: string;
}

export interface UserFormData {
  name: Client['name'];
  email: Client['email'];
  id?: Client['id'];
}

export interface UpdateDialogFormResponse {
  action: 'UPDATE_USER';
  payload: {
    id: Client['id'];
    name: Client['name'];
    email: Client['email'];
  };
}

export interface CreateDialogFormResponse {
  action: 'CREATE_USER';
  payload: {
    name: Client['name'];
    email: Client['email'];
  };
}
