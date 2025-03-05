import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VariacaoService } from '../../../core/services/variacao.service';
import { ItemService } from '../../../core/services/item.service';
import { ItemResponse } from '../../../core/models/item/item-response.model';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { VariacaoResponse } from '../../../core/models/variacao/variacao-response.model';

@Component({
  selector: 'app-lista-variacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-variacao.component.html',
  styleUrls: ['./lista-variacao.component.css'],
})
export class ListaVariacaoComponent implements OnInit {

  idItem!: number;
  item!: ItemResponse;
  variacoes: VariacaoResponse[] = [];
  searchTerm: string = '';
  pageNumber: number = 0;
  pageSize: number = 10;
  totalPages: number = 1;
  variacaoRequest: any;

  constructor(
    private route: ActivatedRoute,
    private variacaoService: VariacaoService,
    private itemService: ItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idItem = +this.route.snapshot.paramMap.get('idItem')!;
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
      this.idItem, this.pageNumber, this.pageSize, this.searchTerm
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

  cadastrarVariacao(): void {
    this.router.navigate(['/cadastro-variacao', this.idItem]).then(() => {
      this.carregarVariacoes();
    });
  }
}
