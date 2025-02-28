import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { RestauranteRequest } from '../../../core/models/restaurante-request.model';
import { Router } from '@angular/router'; // Importe o Router

@Component({
  selector: 'app-cadastro-restaurante',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro-restaurante.component.html',
  styleUrls: ['./cadastro-restaurante.component.css'],
})
export class CadastroRestauranteComponent {
  restauranteRequest: RestauranteRequest = { nome: '', endereco: '' }; // Dados do formulário

  constructor(
    private restauranteService: RestauranteService,
    private router: Router // Injete o Router
  ) {}

  onSubmit() {
    // Envia os dados do formulário para a API
    this.restauranteService.criarRestaurante(this.restauranteRequest).subscribe({
      next: (response) => {
        console.log('Restaurante criado com sucesso:', response);
        alert('Restaurante criado com sucesso!');

        // Redireciona para a página de listagem de restaurantes
        this.router.navigate(['/lista-restaurantes']);
      },
      error: (error) => {
        console.error('Erro ao criar restaurante:', error);
        alert('Erro ao criar restaurante. Verifique os dados e tente novamente.');
      },
    });
  }
}