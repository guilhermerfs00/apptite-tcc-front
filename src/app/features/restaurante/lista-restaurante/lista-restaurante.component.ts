import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importe o Router
import { RestauranteResponse } from '../../../core/models/restaurante/restaurante-response.model';

@Component({
  selector: 'app-lista-restaurantes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-restaurantes.component.html',
  styleUrls: ['./lista-restaurantes.component.css'],
})
export class ListaRestaurantesComponent implements OnInit {
  restaurantes: RestauranteResponse[] = []; // Lista de restaurantes

  constructor(
    private restauranteService: RestauranteService,
    private router: Router // Injete o Router
  ) {}

  ngOnInit(): void {
    this.listaRestaurantes();
  }

  listaRestaurantes(): void {
    this.restauranteService.listaRestaurantes().subscribe({
      next: (data) => {
        this.restaurantes = data.content;
      },
      error: (error) => {
        console.error('Erro ao carregar restaurantes:', error);
      },
    });
  }

  cadastrarCardapio(idRestaurante: number): void {
    this.router.navigate(['/cadastro-cardapio', idRestaurante]);
  }
}