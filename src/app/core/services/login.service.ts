import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface PerfilResponse {
  id: string;
  nome: string;
  email: string;
  role: string;
  idRestaurante: string;
}

export interface TokenResponse {
  accessToken: string;
  headers: any;
  profile: PerfilResponse;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  login(request: AuthenticationRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, request);
  }
}
