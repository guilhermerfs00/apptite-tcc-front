import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { RestauranteRequest } from '../../../core/models/restaurante/restaurante-request.model';
import { ListaRestaurantesComponent } from '../lista-restaurante/lista-restaurante.component';

@Component({
  selector: 'app-cadastro-restaurante',
  standalone: true,
  imports: [FormsModule, CommonModule, ListaRestaurantesComponent], // Adicionando o componente de listagem
  templateUrl: './cadastro-restaurante.component.html',
  styleUrls: ['./cadastro-restaurante.component.css'],
})
export class CadastroRestauranteComponent {
  restauranteRequest: RestauranteRequest = { nome: '', endereco: '' };

  constructor(private restauranteService: RestauranteService) {}

  onSubmit() {
    this.restauranteService.criarRestaurante(this.restauranteRequest).subscribe({
      next: () => {
        alert('Restaurante criado com sucesso!');
        this.restauranteRequest = { nome: '', endereco: '' }; // Limpa o formulário
      },
      error: (error) => {
        console.error('Erro ao criar restaurante:', error);
        alert('Erro ao criar restaurante. Verifique os dados e tente novamente.');
      },
    });
  }
}
