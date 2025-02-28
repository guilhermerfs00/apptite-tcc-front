import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe o CommonModule
import { RestauranteService } from './core/services/restaurante.service';
import { Restaurante } from './core/models/restaurante.model';
import { PaginatedResponse } from './core/models/paginated-response.model';

@Component({
  selector: 'app-root', // Seletor do componente
  standalone: true, // Define o componente como standalone
  imports: [CommonModule], // Importa o CommonModule para usar diretivas como *ngFor
  templateUrl: './app.component.html', // Template do componente
  styleUrls: ['./app.component.css'], // Estilos do componente
})
export class AppComponent implements OnInit {
  // Propriedade para armazenar a lista de restaurantes
  restaurantes: Restaurante[] = [];

  // Injeção do serviço RestauranteService
  constructor(private restauranteService: RestauranteService) {}

  // Método executado quando o componente é inicializado
  ngOnInit(): void {
    this.carregarRestaurantes(); // Carrega a lista de restaurantes
  }

  // Método para carregar a lista de restaurantes
  carregarRestaurantes(): void {
    this.restauranteService.getRestaurantes().subscribe(
      (data: PaginatedResponse<Restaurante>) => {
        this.restaurantes = data.content; // Atribui a lista de restaurantes à propriedade
      },
      (error) => {
        console.error('Erro ao carregar restaurantes:', error); // Trata erros
      }
    );
  }
}