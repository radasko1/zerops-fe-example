export interface Client {
  id: number;
  name: string;
}

export interface ClientState {
  clients: Client[];
}
