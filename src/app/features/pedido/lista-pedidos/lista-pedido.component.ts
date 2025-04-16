import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ClienteResponse {
  idCliente: number;
  nome: string;
  celular: string;
  cpf: string;
}

interface VariacaoResponse {
  idVariacao: number;
  nome: string;
  preco: number;
}

interface CategoriaResponse {
  idCategoria: number;
  nome: string;
}

interface ItemResponse {
  idItem: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: CategoriaResponse;
}

interface PedidoResponse {
  idPedido: number;
  cliente: ClienteResponse;
  status: string;
  variacoes: VariacaoResponse[];
  itens: ItemResponse[];
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-lista-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-pedido.component.html',
  styleUrls: ['./lista-pedido.component.css']
})
export class ListaPedidoComponent implements OnInit {
  pedidos: PedidoResponse[] = [];
  idRestaurante!: number;
  pageNumber = 0;
  pageSize = 10;
  totalPages = 0;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('idRestaurante');
    if (idParam) {
      this.idRestaurante = +idParam;
      this.carregarPedidos();
    } else {
      console.error('ID do restaurante não encontrado na rota.');
    }
  }

  carregarPedidos(): void {
    const url = `${environment.apiUrl}/pedidos/restaurante/${this.idRestaurante}?pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`;
    this.http.get<PageResponse<PedidoResponse>>(url).subscribe({
      next: (response) => {
        this.pedidos = response.content;
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.error('Erro ao carregar pedidos:', err);
      }
    });
  }

  paginaAnterior(): void {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.carregarPedidos();
    }
  }

  proximaPagina(): void {
    if (this.pageNumber < this.totalPages - 1) {
      this.pageNumber++;
      this.carregarPedidos();
    }
  }
}
