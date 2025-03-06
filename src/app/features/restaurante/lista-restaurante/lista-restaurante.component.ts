import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { Router } from '@angular/router';
import { RestauranteResponse } from '../../../core/models/restaurante/restaurante-response.model';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-restaurantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-restaurantes.component.html',
  styleUrls: ['./lista-restaurantes.component.css'],
})
export class ListaRestaurantesComponent implements OnInit {
  restaurantes: RestauranteResponse[] = [];
  searchTerm: string = '';
  pageNumber: number = 0;
  pageSize: number = 10;
  totalPages: number = 1;
  totalElements: number = 0;

  constructor(
    private restauranteService: RestauranteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarRestaurantes();
  }

  carregarRestaurantes(): void {
    this.restauranteService.listaRestaurantes(this.pageNumber, this.pageSize, this.searchTerm).subscribe({
      next: (data: PaginatedResponse<RestauranteResponse>) => {
        this.restaurantes = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
      },
      error: (error) => {
        console.error('Erro ao carregar restaurantes:', error);
      },
    });
  }

  filtrarRestaurantes(): void {
    this.pageNumber = 0;
    this.carregarRestaurantes();
  }

  proximaPagina(): void {
    if (this.pageNumber < this.totalPages - 1) {
      this.pageNumber++;
      this.carregarRestaurantes();
    }
  }

  paginaAnterior(): void {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.carregarRestaurantes();
    }
  }

  cadastrarCategoria(idRestaurante: number): void {
    this.router.navigate(['/cadastro-categoria', idRestaurante]).then(() => {
      this.carregarRestaurantes();
    });
  }

  cadastrarMesa(idRestaurante: number): void {
    this.router.navigate(['/cadastro-mesa', idRestaurante]).then(() => {
      this.carregarRestaurantes();
    });
  }

  excluirRestaurante(idRestaurante: number): void {
    if (confirm('Tem certeza que deseja excluir este restaurante?')) {
      this.restauranteService.excluirRestaurante(idRestaurante).subscribe({
        next: () => {
          alert('Restaurante excluído com sucesso!');
          this.carregarRestaurantes();
        },
        error: (error) => {
          console.error('Erro ao excluir restaurante:', error);
        },
      });
    }
  }
}
