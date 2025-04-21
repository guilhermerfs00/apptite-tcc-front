import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PedidoRequest {
  idCliente: number;
  idItem: number;
  idsVariacao: number[];
}

export interface ClienteResponse {
  idCliente: number;
  nome: string;
  celular: string;
  cpf: string;
}

export interface VariacaoResponse {
  idVariacao: number;
  nome: string;
  preco: number;
}

export interface CategoriaResponse {
  idCategoria: number;
  nome: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

export interface ItemResponse {
  idItem: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: CategoriaResponse;
  dataCriacao: string;
  dataAtualizacao: string;
}

export type StatusPedidoEnum =
  | 'PEDIDO_REALIZADO'
  | 'PRODUZINDO_PEDIDO'
  | 'AGUARDANDO_RETIRADA'
  | 'AGUARDANDO_PAGAMENTO'
  | 'PROCESSANDO_PAGAMENTO'
  | 'PAGAMENTO_RECUSADO'
  | 'PAGAMENTO_CONCLUIDO';

export interface PedidoResponse {
  idPedido: number;
  cliente: ClienteResponse;
  status: StatusPedidoEnum;
  itens: ItemResponse[];
  variacoes: VariacaoResponse[];
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class PedidoService {

  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  criarPedido(pedido: PedidoRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, pedido);
  }

  listarPedidosPorRestaurante(
    idRestaurante: number,
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<PedidoResponse>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<PedidoResponse>>(`${this.apiUrl}/restaurante/${idRestaurante}`, { params });
  }

  buscarPedidosPorRestauranteEStatus(
    idRestaurante: number,
    status: string,
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<PedidoResponse>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<PedidoResponse>>(`${this.apiUrl}/restaurante/${idRestaurante}/${status}`, { params });
  }

  atualizarStatusPedido(status: string, idPedido: number): Observable<PedidoResponse> {
    return this.http.put<PedidoResponse>(`${this.apiUrl}/${status}/${idPedido}`, {});
  }

  listarTodosPedidos(
    page: number = 0,
    size: number = 10000
  ): Observable<PageResponse<PedidoResponse>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<PedidoResponse>>(this.apiUrl, { params });
  } 

  listarTodosPedidosFiltrados(
    dataInicio?: string,
    dataFim?: string
  ): Observable<PedidoResponse[]> {
    let params = new HttpParams();
  
    if (dataInicio) {
      params = params.set('dataInicio', dataInicio);
    }
  
    if (dataFim) {
      params = params.set('dataFim', dataFim);
    }
  
    return this.http.get<PedidoResponse[]>(`${this.apiUrl}/filtro`, { params });
  }

  buscarPedidosPorClienteId(idCliente: number): Observable<PageResponse<PedidoResponse>> {
    return this.http.get<PageResponse<PedidoResponse>>(`${this.apiUrl}/cliente/${idCliente}`);
  }

}
