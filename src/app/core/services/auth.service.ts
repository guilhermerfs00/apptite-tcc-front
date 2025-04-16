import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  nome: string;
  role: 'ADMIN' | 'CHEF' | 'GARCON' | '';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private profileSubject = new BehaviorSubject<UserProfile>({ nome: '', role: '' });

  constructor() {
    this.atualizarPerfil();
  }

  get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  get profile$(): Observable<UserProfile> {
    return this.profileSubject.asObservable();
  }

  atualizarPerfil(): void {
    const token = this.accessToken;
    if (token) {
      const decoded = this.decodeToken(token);
      const profile: UserProfile = {
        nome: decoded?.nome || '',
        role: decoded?.role || ''
      };
      this.profileSubject.next(profile);
    } else {
      this.profileSubject.next({ nome: '', role: '' });
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.profileSubject.next({ nome: '', role: '' });
  }

  private decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64);
      return JSON.parse(decodedJson);
    } catch {
      return null;
    }
  }
}
