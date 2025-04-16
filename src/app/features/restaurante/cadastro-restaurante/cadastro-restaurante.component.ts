import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { RestauranteRequest } from '../../../core/models/restaurante-request.model';
import { ListaRestaurantesComponent } from '../lista-restaurante/lista-restaurante.component';
import Swal from 'sweetalert2'; // ✅ Importação do SweetAlert2

@Component({
  selector: 'app-cadastro-restaurante',
  standalone: true,
  imports: [FormsModule, CommonModule, ListaRestaurantesComponent],
  templateUrl: './cadastro-restaurante.component.html',
  styleUrls: ['./cadastro-restaurante.component.css'],
})
export class CadastroRestauranteComponent {
  @ViewChild(ListaRestaurantesComponent) listaRestaurantes!: ListaRestaurantesComponent;

  restauranteRequest: RestauranteRequest = { nome: '', endereco: '' };

  constructor(private restauranteService: RestauranteService) {}

  onSubmit() {
    this.restauranteService.criarRestaurante(this.restauranteRequest).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Restaurante criado com sucesso!',
          timer: 1500,
          showConfirmButton: false
        });
        this.restauranteRequest = { nome: '', endereco: '' };
        this.listaRestaurantes.carregarRestaurantes();
      },
      error: (error) => {
        console.error('Erro ao criar restaurante:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao criar restaurante. Verifique os dados e tente novamente.'
        });
      },
    });
  }
}
