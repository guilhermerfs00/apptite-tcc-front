import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurante } from '../models/restaurante.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../../environments/environment';
import { RestauranteRequest } from '../models/restaurante-request.model';
import { RestauranteResponse } from '../models/restaurante-response.model';

@Injectable({
  providedIn: 'root', // O serviço é fornecido no nível raiz
})
export class RestauranteService {
  private apiUrl = `${environment.apiUrl}/restaurantes`; // URL da API

  constructor(private http: HttpClient) {}

  // Método para obter a lista de restaurantes paginada
  listaRestaurantes(): Observable<PaginatedResponse<Restaurante>> {
    return this.http.get<PaginatedResponse<Restaurante>>(this.apiUrl);
  }
  criarRestaurante(restauranteRequest: RestauranteRequest): Observable<RestauranteResponse> {
    return this.http.post<RestauranteResponse>(this.apiUrl, restauranteRequest);
  }
}