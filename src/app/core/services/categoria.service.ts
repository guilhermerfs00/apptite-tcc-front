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

  /** Criar uma nova categoria vinculada ao restaurante */
  criarCategoria(categoriaRequest: CategoriaRequest): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(this.apiUrl, categoriaRequest);
  }

  /** Buscar todas as categorias de um restaurante com paginação */
  buscarCategoriasPorRestaurante(
    idRestaurante: number,
    pageNumber: number = 0,
    pageSize: number = 10,
    searchTerm: string = ''
  ): Observable<PaginatedResponse<CategoriaResponse>> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (searchTerm.trim() !== '') {
      params = params.set('search', searchTerm);
    }

    return this.http.get<PaginatedResponse<CategoriaResponse>>(
      `${this.apiUrl}/restaurante/${idRestaurante}`,
      { params }
    );
  }

  /** Buscar uma única categoria pelo ID */
  obterCategoriaPorId(idCategoria: number): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(`${this.apiUrl}/${idCategoria}`);
  }

  /** Editar uma categoria existente */
  editarCategoria(idCategoria: number, categoriaRequest: CategoriaRequest): Observable<CategoriaResponse> {
    return this.http.put<CategoriaResponse>(`${this.apiUrl}/${idCategoria}`, categoriaRequest);
  }

  /** Excluir uma categoria */
  excluirCategoria(idCategoria: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idCategoria}`);
  }
}