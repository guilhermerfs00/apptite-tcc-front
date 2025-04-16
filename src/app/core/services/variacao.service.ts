import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../models/paginated-response.model';
import { VariacaoRequest } from '../models/variacao-request.model';
import { VariacaoResponse } from '../models/variacao-response.model';

@Injectable({
  providedIn: 'root',
})
export class VariacaoService {
  
  private apiUrl = `${environment.apiUrl}/variacoes`;

  constructor(private http: HttpClient) {}

  criarVariacao(request: VariacaoRequest): Observable<VariacaoResponse> {
    return this.http.post<VariacaoResponse>(this.apiUrl, request);
  }

  buscarVariacoesPorItem(
    idItem: number,
    pageNumber: number = 0,
    pageSize: number = 10,
    searchTerm: string = ''
  ): Observable<PaginatedResponse<VariacaoResponse>> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (searchTerm.trim() !== '') {
      params = params.set('search', searchTerm);
    }

    return this.http.get<PaginatedResponse<VariacaoResponse>>(`${this.apiUrl}/item/${idItem}`, { params });
  }

  excluirItem(idItem: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idItem}`);
  }

  listaVariacoes(pageNumber: number, pageSize: number, searchTerm: string = ''): Observable<PaginatedResponse<VariacaoResponse>> {
      let params = new HttpParams()
        .set('page', pageNumber.toString())
        .set('size', pageSize.toString());
  
      if (searchTerm.trim() !== '') {
        params = params.set('search', searchTerm);
      }
  
      return this.http.get<PaginatedResponse<VariacaoResponse>>(this.apiUrl, { params });
    }
    
    criarRestaurante(restauranteRequest: VariacaoResponse): Observable<VariacaoResponse> {
      return this.http.post<VariacaoResponse>(this.apiUrl, restauranteRequest);
    }

    excluirVariacao(idVariacao: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${idVariacao}`);
    }
}
