import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemResponse } from '../../../core/models/item-response.model';
import { ItemService } from '../../../core/services/item.service';
import { CategoriaResponse } from '../../../core/models/categoria-response.model';
import { CategoriaService } from '../../../core/services/categoria.service';
import Swal from 'sweetalert2';

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

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

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
        console.error('Erro ao carregar categoria:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar a categoria.'
        });
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
        this.itens.forEach((item) => {
          this.itemService.getItemImageBase64(item.idItem).subscribe({
            next: (base64) => {
              (item as any).imagemUrl = 'data:image/jpeg;base64,' + base64;
            },
            error: () => {
              (item as any).imagemUrl = `${window.location.origin}/assets/img/sem-imagem.jpg`;
            }
          });
        });
      },
      error: (error) => {
        console.error('Erro ao carregar itens:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao carregar os itens.'
        });
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
    Swal.fire({
      title: 'Deseja excluir este item?',
      text: 'Essa ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.itemService.excluirItem(idItem).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Item excluído com sucesso!',
              timer: 1500,
              showConfirmButton: false
            });
            this.carregarItens();
          },
          error: (error) => {
            console.error('Erro ao excluir item:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Não foi possível excluir o item.'
            });
          }
        });
      }
    });
  }

  cadastrarVariacao(idItem: number): void {
    this.router.navigate(['/cadastro-variacao', idItem]);
  }
}
