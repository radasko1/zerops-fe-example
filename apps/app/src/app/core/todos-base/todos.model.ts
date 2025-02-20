export const FEATURE_NAME = 'todos';

export interface TodosState {
  data: TodoEntity[];
}

export interface TodoEntity {
  id: number;
  text: string;
  clientId: string;
  completed: boolean;
}

export interface TodoAddPayload {
  text: string;
  completed: boolean;
}

export interface TodoAddResponse extends TodoEntity { }

export interface TodoUpdatePayload {
  text: string;
  completed: boolean;
}

export interface TodoUpdateResponse extends TodoEntity { }
