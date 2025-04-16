import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MesaResponse } from '../models/mesa-response.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { MesaRequest } from '../models/mesa-request';

@Injectable({
  providedIn: 'root',
})
export class MesaService {

  private apiUrl = `${environment.apiUrl}/mesas`;

  constructor(private http: HttpClient) { }

  criarMesa(mesaRequest: MesaRequest): Observable<MesaResponse> {
    return this.http.post<MesaResponse>(this.apiUrl, mesaRequest);
  }

  buscarMesasPorRestaurante(
    idRestaurante: number,
    pageNumber: number = 0,
    pageSize: number = 10,
    searchTerm: string = ''
  ): Observable<PaginatedResponse<MesaResponse>> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (searchTerm.trim() !== '') {
      params = params.set('search', searchTerm);
    }

    return this.http.get<PaginatedResponse<MesaResponse>>(
      `${this.apiUrl}/restaurante/${idRestaurante}`,
      { params }
    );
  }

  obterMesaPorId(idMesa: number): Observable<MesaResponse> {
    return this.http.get<MesaResponse>(`${this.apiUrl}/${idMesa}`);
  }

  editarMesa(idMesa: number, mesaRequest: MesaRequest): Observable<MesaResponse> {
    return this.http.put<MesaResponse>(`${this.apiUrl}/${idMesa}`, mesaRequest);
  }

  excluirMesa(idMesa: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idMesa}`);
  }
}