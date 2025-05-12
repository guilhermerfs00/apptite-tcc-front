import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FeedbackRequest {
  idCliente: number;
  idRestaurante: number;
  conteudo: string;
  nota: number;
}

export interface FeedbackResponse {
  id: number;
  conteudo: string;
  nota: number;
  dataCriacao: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private apiUrl = `${environment.apiUrl}/feedbacks`;

  constructor(private http: HttpClient) { }

  criarFeedback(feedbackRequest: FeedbackRequest): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(this.apiUrl, feedbackRequest);
  }

  findByRestaurante(id: number): Observable<FeedbackResponse[]> {
    return this.http.get<FeedbackResponse[]>(`${this.apiUrl}/restaurantes/${id}`);
  }
}