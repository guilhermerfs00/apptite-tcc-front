import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MetodoDePagamento {
  stripeTestToken?: string;
  name: string;
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
}

export interface PagamentoRequest {
  idPagamento: number;
  valorPago: number;
  valorTotal: number;
  idCliente: number;
  metodoDePagamento: MetodoDePagamento;
}

export interface PagamentoResponse {
  idPagamento: number;
  valorPago: number;
  valorTotal: number;
  status: string;
  stripePaymentIntentId: string;
  clientSecret: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private apiUrl = `${environment.apiUrl}/pagamento`;

  constructor(private http: HttpClient) { }

  realizarPagamento(request: PagamentoRequest): Observable<PagamentoResponse> {
    return this.http.post<PagamentoResponse>(this.apiUrl, request);
  }

  consultarStatusPagamento(idCliente: number): Observable<string> {
    const url = `${this.apiUrl}/${idCliente}/status`;
    return this.http.get<string>(url);
  }
}
