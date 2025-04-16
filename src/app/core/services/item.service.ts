import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ItemRequest } from '../models/item-request.model';
import { ItemResponse } from '../models/item-response.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = `${environment.apiUrl}/itens`;

  constructor(private http: HttpClient) {}

  criarItem(itemRequest: ItemRequest): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(this.apiUrl, itemRequest);
  }

  uploadItem(formData: FormData): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(`${this.apiUrl}/upload`, formData);
  }

  buscarItensPorCategoria(
    idCategoria: number,
    pageNumber: number = 0,
    pageSize: number = 10,
    searchTerm: string = ''
  ): Observable<PaginatedResponse<ItemResponse>> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (searchTerm.trim() !== '') {
      params = params.set('search', searchTerm);
    }

    return this.http.get<PaginatedResponse<ItemResponse>>(`${this.apiUrl}/categoria/${idCategoria}`, { params });
  }

  excluirItem(idItem: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idItem}`);
  }

  listaItens(pageNumber: number, pageSize: number, searchTerm: string = ''): Observable<PaginatedResponse<ItemResponse>> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (searchTerm.trim() !== '') {
      params = params.set('search', searchTerm);
    }

    return this.http.get<PaginatedResponse<ItemResponse>>(this.apiUrl, { params });
  }

  criarRestaurante(restauranteRequest: ItemResponse): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(this.apiUrl, restauranteRequest);
  }

  obterItemPorId(idItem: number): Observable<ItemResponse> {
    return this.http.get<ItemResponse>(`${this.apiUrl}/${idItem}`);
  }

  getItemImageBase64(idItem: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/imagem/${idItem}`, {
      responseType: 'text'
    });
  }  
}