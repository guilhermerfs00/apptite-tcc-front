import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VariacaoService } from '../../../core/services/variacao.service';
import { ItemService } from '../../../core/services/item.service';
import { PedidoService, PedidoRequest } from '../../../core/services/pedido.service';

import { ItemResponse } from '../../../core/models/item-response.model';
import { VariacaoResponse } from '../../../core/models/variacao-response.model';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';

@Component({
  selector: 'app-lista-variacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-variacao.component.html',
  styleUrls: ['./lista-variacao.component.css']
})
export class ListaVariacaoComponent implements OnInit {
  idItem!: number;
  idCliente!: number;

  item!: ItemResponse;
  variacoes: VariacaoResponse[] = [];

  searchTerm: string = '';
  pageNumber: number = 0;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(
    private route: ActivatedRoute,
    private variacaoService: VariacaoService,
    private itemService: ItemService,
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idItem = +this.route.snapshot.paramMap.get('idItem')!;
    this.idCliente = +this.route.snapshot.paramMap.get('idCliente')!;
    this.carregarItem();
    this.carregarVariacoes();
  }

  carregarItem(): void {
    this.itemService.obterItemPorId(this.idItem).subscribe({
      next: (data) => {
        this.item = data;
      },
      error: (error) => {
        console.error('Erro ao carregar item:', error);
      },
    });
  }

  carregarVariacoes(): void {
    this.variacaoService.buscarVariacoesPorItem(
      this.idItem,
      this.pageNumber,
      this.pageSize,
      this.searchTerm
    ).subscribe({
      next: (data: PaginatedResponse<VariacaoResponse>) => {
        this.variacoes = data.content;
        this.totalPages = data.totalPages;
      },
      error: (error) => {
        console.error('Erro ao carregar variações:', error);
      },
    });
  }

  filtrarVariacoes(): void {
    this.pageNumber = 0;
    this.carregarVariacoes();
  }

  proximaPagina(): void {
    if (this.pageNumber < this.totalPages - 1) {
      this.pageNumber++;
      this.carregarVariacoes();
    }
  }

  paginaAnterior(): void {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.carregarVariacoes();
    }
  }

  excluirVariacao(idVariacao: number): void {
    if (confirm('Tem certeza que deseja excluir esta variação?')) {
      this.variacaoService.excluirVariacao(idVariacao).subscribe({
        next: () => {
          alert('Variação excluída com sucesso!');
          this.carregarVariacoes();
        },
        error: (error) => {
          console.error('Erro ao excluir variação:', error);
        },
      });
    }
  }

  realizarPedido(idVariacao: number): void {
    const pedido: PedidoRequest = {
      idCliente: this.idCliente,
      idItem: this.idItem,
      idsVariacao: [idVariacao]
    };
  
    this.pedidoService.criarPedido(pedido).subscribe({
      next: () => {
        alert('Pedido realizado com sucesso!');
        this.router.navigate(['/pedido', this.idCliente]);
      },
      error: () => {
        alert('Erro ao criar pedido.');
      }
    });
  }  

  cadastrarVariacao(): void {
    this.router.navigate(['/cadastro-variacao', this.idItem]);
  }
}
