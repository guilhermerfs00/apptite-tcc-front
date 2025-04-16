import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../core/services/categoria.service';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { RestauranteResponse } from '../../../core/models/restaurante-response.model';
import { CategoriaResponse } from '../../../core/models/categoria-response.model';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import Swal from 'sweetalert2'; // ✅ Importação do SweetAlert2

@Component({
  selector: 'app-lista-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-categoria.component.html',
  styleUrls: ['./lista-categoria.component.css'],
})
export class ListaCategoriaComponent implements OnInit {
  idRestaurante!: number;
  restaurante!: RestauranteResponse;
  categorias: CategoriaResponse[] = [];
  searchTerm: string = '';
  pageNumber: number = 0;
  pageSize: number = 10;
  totalPages: number = 1;
  categoriaRequest: any;

  constructor(
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private restauranteService: RestauranteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idRestaurante = +this.route.snapshot.paramMap.get('idRestaurante')!;
    this.carregarRestaurante();
    this.carregarCategorias();
  }

  carregarRestaurante(): void {
    this.restauranteService.obterRestaurantePorId(this.idRestaurante).subscribe({
      next: (data) => {
        this.restaurante = data;
      },
      error: (error) => {
        console.error('Erro ao carregar restaurante:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Falha ao carregar restaurante.'
        });
      },
    });
  }

  carregarCategorias(): void {
    this.categoriaService.buscarCategoriasPorRestaurante(
      this.idRestaurante, this.pageNumber, this.pageSize, this.searchTerm
    ).subscribe({
      next: (data: PaginatedResponse<CategoriaResponse>) => {
        this.categorias = data.content;
        this.totalPages = data.totalPages;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar as categorias.'
        });
      },
    });
  }

  filtrarCategorias(): void {
    this.pageNumber = 0;
    this.carregarCategorias();
  }

  proximaPagina(): void {
    if (this.pageNumber < this.totalPages - 1) {
      this.pageNumber++;
      this.carregarCategorias();
    }
  }

  paginaAnterior(): void {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.carregarCategorias();
    }
  }

  excluirCategoria(idCategoria: number): void {
    Swal.fire({
      title: 'Deseja excluir esta categoria?',
      text: 'Essa ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.excluirCategoria(idCategoria).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Excluída com sucesso!',
              timer: 1500,
              showConfirmButton: false
            });
            this.carregarCategorias();
          },
          error: (error) => {
            console.error('Erro ao excluir categoria:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Não foi possível excluir a categoria.'
            });
          },
        });
      }
    });
  }

  cadastrarItem(idCategoria: number): void {
    this.router.navigate(['/cadastro-item', idCategoria]);
  }
}
