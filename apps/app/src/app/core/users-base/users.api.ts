import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User, UserFormData, UserPayload } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersApi {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${process.env.Z_API_URL}/users`;

  public getAll$() {
    return this.httpClient.get<User[]>(`${this.apiUrl}`);
  }

  public create$(userPayload: UserPayload) {
    return this.httpClient.post<User>(`${this.apiUrl}`, userPayload);
  }

  public update$(userPayload: UserFormData) {
    return this.httpClient.put<User>(
      `${this.apiUrl}/${userPayload.id}`,
      userPayload
    );
  }

  public delete$(userId: string) {
    return this.httpClient.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
