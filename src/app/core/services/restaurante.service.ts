import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../../environments/environment';
import { RestauranteRequest } from '../models/restaurante/restaurante-request.model';
import { RestauranteResponse } from '../models/restaurante/restaurante-response.model';

@Injectable({
  providedIn: 'root',
})
export class RestauranteService {
  obterRestaurantePorId(id: number): Observable<RestauranteResponse> {
    return this.http.get<RestauranteResponse>(`${this.apiUrl}/${id}`);
  }
  
  private apiUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient) {}

  listaRestaurantes(pageNumber: number, pageSize: number, searchTerm: string = ''): Observable<PaginatedResponse<RestauranteResponse>> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (searchTerm.trim() !== '') {
      params = params.set('search', searchTerm);
    }

    return this.http.get<PaginatedResponse<RestauranteResponse>>(this.apiUrl, { params });
  }
  
  criarRestaurante(restauranteRequest: RestauranteRequest): Observable<RestauranteResponse> {
    return this.http.post<RestauranteResponse>(this.apiUrl, restauranteRequest);
  }

  excluirRestaurante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
