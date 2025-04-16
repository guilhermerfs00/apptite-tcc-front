import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MesaService } from '../../../core/services/mesa.service';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { RestauranteResponse } from '../../../core/models/restaurante-response.model';
import { ListaMesaComponent } from '../lista-mesa/lista-mesa.component';
import { MesaRequest } from '../../../core/models/mesa-request';
import Swal from 'sweetalert2'; // ✅ Importação do SweetAlert2

@Component({
  selector: 'app-cadastro-mesa',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaMesaComponent],
  templateUrl: './cadastro-mesa.component.html',
  styleUrls: ['./cadastro-mesa.component.css'],
})
export class CadastroMesaComponent implements OnInit {
  @ViewChild(ListaMesaComponent) listaMesas!: ListaMesaComponent;

  idRestaurante!: number;
  restaurante!: RestauranteResponse;
  mesaRequest: MesaRequest = { numero: 0, idRestaurante: 0 };

  constructor(
    private route: ActivatedRoute,
    private mesaService: MesaService,
    private restauranteService: RestauranteService
  ) {}

  ngOnInit(): void {
    this.idRestaurante = +this.route.snapshot.paramMap.get('idRestaurante')!;
    this.mesaRequest.idRestaurante = this.idRestaurante;

    this.restauranteService.obterRestaurantePorId(this.idRestaurante).subscribe({
      next: (data) => {
        this.restaurante = data;
      },
      error: (error) => {
        console.error('Erro ao carregar restaurante:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Falha ao carregar o restaurante.'
        });
      },
    });
  }

  onSubmit(): void {
    this.mesaService.criarMesa(this.mesaRequest).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Mesa cadastrada com sucesso!',
          timer: 1500,
          showConfirmButton: false
        });
        this.mesaRequest = { numero: 0, idRestaurante: this.idRestaurante };
        this.listaMesas.carregarMesas();
      },
      error: (error) => {
        console.error('Erro ao cadastrar mesa:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao cadastrar mesa. Verifique os dados e tente novamente.'
        });
      },
    });
  }
}
