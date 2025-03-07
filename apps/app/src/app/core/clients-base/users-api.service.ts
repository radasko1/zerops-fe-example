import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client, UserFormData, UserPayload } from './client.model';

@Injectable({
  providedIn: 'root',
})
export class UsersApi {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${process.env.Z_API_URL}/clients`;

  public getAll$() {
    return this.httpClient.get<Client[]>(`${this.apiUrl}`);
  }

  public create$(ClientPayload: UserPayload) {
    return this.httpClient.post<Client>(`${this.apiUrl}`, ClientPayload);
  }

  public update$(userPayload: UserFormData) {
    return this.httpClient.put<Client>(`${this.apiUrl}/${userPayload.id}`, userPayload);
  }

  public delete$(clientId: string) {
    return this.httpClient.delete<void>(`${this.apiUrl}/${clientId}`);
  }
}
