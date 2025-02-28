import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { Restaurante } from '../../../core/models/restaurante.model';
import { CommonModule } from '@angular/common';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';

@Component({
  selector: 'app-restaurante-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurante-list.component.html',
  styleUrls: ['./restaurante-list.component.css'],
})
export class RestauranteListComponent implements OnInit {
  restaurantes: Restaurante[] = []; // Lista de restaurantes

  constructor(private restauranteService: RestauranteService) {}

  ngOnInit(): void {
    this.carregarRestaurantes();
  }

  carregarRestaurantes(): void {
    this.restauranteService.getRestaurantes().subscribe(
      (response: PaginatedResponse<Restaurante>) => {
        this.restaurantes = response.content; // Acesse a propriedade 'content'
      },
      (error) => {
        console.error('Erro ao carregar restaurantes:', error);
      }
    );
  }
}