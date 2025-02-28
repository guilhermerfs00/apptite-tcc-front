import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurante } from '../models/restaurante.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root', // O serviço é fornecido no nível raiz
})
export class RestauranteService {
  private apiUrl = `${environment.apiUrl}/restaurantes`; // URL da API

  constructor(private http: HttpClient) {}

  // Método para obter a lista de restaurantes paginada
  getRestaurantes(): Observable<PaginatedResponse<Restaurante>> {
    return this.http.get<PaginatedResponse<Restaurante>>(this.apiUrl);
  }
}