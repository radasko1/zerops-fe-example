import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TodoAddPayload, TodoAddResponse, TodoEntity, TodoUpdatePayload, TodoUpdateResponse } from './todos.model';

@Injectable({ providedIn: 'root' })
export class TodosApi {
  #httpClient = inject(HttpClient);
  #apiUrl = `${process.env.Z_API_URL}/todos`;
  #clientId = process.env.Z_CLIENT_ID;

  add$(data: TodoAddPayload) {
    return this.#httpClient.post<TodoAddResponse>(this.#apiUrl, {
      ...data,
      clientId: this.#clientId,
    });
  }

  update$(id: number, data: TodoUpdatePayload) {
    return this.#httpClient.patch<TodoUpdateResponse>(
      `${this.#apiUrl}/${id}`,
      data
    );
  }

  delete$(id: number) {
    return this.#httpClient.delete(`${this.#apiUrl}/${id}`);
  }

  search$(clientId = this.#clientId) {
    return this.#httpClient.get<TodoEntity[]>(
      `${this.#apiUrl}?clientId=${clientId}`
    );
  }

  markAllComplete$() {
    return this.#httpClient.patch<TodoUpdateResponse>(
      `${this.#apiUrl}/mark-all-as-completed?clientId=${this.#clientId}`,
      {}
    );
  }
}
