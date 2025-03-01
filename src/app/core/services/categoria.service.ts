import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoriaResponse } from '../models/categoria/categoria-response.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { CategoriaRequest } from '../models/categoria/categoria-request';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  criarCategoria(categoriaRequest: CategoriaRequest): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(this.apiUrl, categoriaRequest);
  }

  buscarCategoriasPorCardapio(
    idCardapio: number,
    pageNumber: number = 0,
    pageSize: number = 10
  ): Observable<PaginatedResponse<CategoriaResponse>> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    return this.http.get<PaginatedResponse<CategoriaResponse>>(
      `${this.apiUrl}/restaurante/${idCardapio}`,
      { params }
    );
  }
}