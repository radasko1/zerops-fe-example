import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from './client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsApi {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${process.env.Z_API_URL}/clients`;

  public getAll$() {
    return this.httpClient.get<Client[]>(`${this.apiUrl}`);
  }

  public create$(name: string) {
    return this.httpClient.post<Client>(`${this.apiUrl}`, { name });
  }
}
