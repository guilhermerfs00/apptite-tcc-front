import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardapioRequest } from '../models/cardapio/cardapio-request.model';
import { CardapioResponse } from '../models/cardapio/cardapio-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardapioService {
  private apiUrl = `${environment.apiUrl}/cardapios`; // URL da API

  constructor(private http: HttpClient) {}

  criarCardapio(cardapioRequest: CardapioRequest): Observable<CardapioResponse> {
    return this.http.post<CardapioResponse>(this.apiUrl, cardapioRequest);
  }
}