export interface Client {
  id: string;
  name: string;
}

export interface ClientState {
  data: Client[];
  activeClientId: string | undefined;
}
