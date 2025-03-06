export interface Client {
  id: string;
  name: string;
  email: string;
}

export interface ClientState {
  data: Client[];
  activeClientId: string | undefined;
}

export interface ClientPayload {
  name: string;
  email: string;
}
