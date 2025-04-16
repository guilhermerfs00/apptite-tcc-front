import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserRequest {
  nome: string;
  email: string;
  senha: string;
  role: 'ADMIN' | 'CHEF' | 'GARCON';
  idRestaurante?: number;
}


export interface UserResponse {
  idUsuario: string;
  nome: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  criarUsuario(request: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/create`, request);
  }
}
