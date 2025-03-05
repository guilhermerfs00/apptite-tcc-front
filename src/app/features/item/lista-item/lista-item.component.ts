import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemResponse } from '../../../core/models/item/item-response.model';
import { ItemService } from '../../../core/services/item.service';
import { CategoriaResponse } from '../../../core/models/categoria/categoria-response.model';
import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-lista-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-item.component.html',
  styleUrls: ['./lista-item.component.css'],
})
export class ListaItemComponent implements OnInit {

  idCategoria!: number;
  categoria!: CategoriaResponse;
  itens: ItemResponse[] = [];
  searchTerm: string = '';
  pageNumber: number = 0;
  pageSize: number = 10;
  totalPages: number = 1;
  itemRequest: any;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idCategoria = +this.route.snapshot.paramMap.get('idCategoria')!;
    this.carregarCategorias();
    this.carregarItens();
  }

  carregarCategorias(): void {
    this.categoriaService.obterCategoriaPorId(this.idCategoria).subscribe({
      next: (data) => {
        this.categoria = data;
      },
      error: (error) => {
        console.error('Erro ao carregar restaurante:', error);
      },
    });
  }

  carregarItens(): void {
    this.itemService.buscarItensPorCategoria(
      this.idCategoria, this.pageNumber, this.pageSize, this.searchTerm
    ).subscribe({
      next: (data: PaginatedResponse<ItemResponse>) => {
        this.itens = data.content;
        this.totalPages = data.totalPages;
      },
      error: (error) => {
        console.error('Erro ao carregar itens:', error);
      },
    });
  }

  filtrarItens(): void {
    this.pageNumber = 0;
    this.carregarItens();
  }

  proximaPagina(): void {
    if (this.pageNumber < this.totalPages - 1) {
      this.pageNumber++;
      this.carregarItens();
    }
  }

  paginaAnterior(): void {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.carregarItens();
    }
  }

  excluirItem(idItem: number): void {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      this.itemService.excluirItem(idItem).subscribe({
        next: () => {
          alert('Categoria excluída com sucesso!');
          this.carregarItens();
        },
        error: (error) => {
          console.error('Erro ao excluir categoria:', error);
        },
      });
    }
  }

  cadastrarVariacao(idItem: number): void {
    this.router.navigate(['/cadastro-variacao', idItem]);
  }
}
