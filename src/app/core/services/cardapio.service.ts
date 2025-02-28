import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardapioRequest } from '../models/cardapio-request.model';
import { CardapioResponse } from '../models/cardapio-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardapioService {
  private apiUrl = `${environment.apiUrl}/restaurantes`; // URL da API

  constructor(private http: HttpClient) {}

  // Método para criar um cardápio
  criarCardapio(idRestaurante: number, cardapioRequest: CardapioRequest): Observable<CardapioResponse> {
    return this.http.post<CardapioResponse>(`${this.apiUrl}/${idRestaurante}/cardapios`, cardapioRequest);
  }
}