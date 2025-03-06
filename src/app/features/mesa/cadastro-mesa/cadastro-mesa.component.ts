import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MesaService } from '../../../core/services/mesa.service';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { RestauranteResponse } from '../../../core/models/restaurante/restaurante-response.model';
import { ListaMesaComponent } from '../lista-mesa/lista-mesa.component';
import { MesaRequest } from '../../../core/models/mesa/mesa-request';

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
    private restauranteService: RestauranteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idRestaurante = +this.route.snapshot.paramMap.get('idRestaurante')!;
    this.mesaRequest.idRestaurante = this.idRestaurante;

    this.restauranteService.obterRestaurantePorId(this.idRestaurante).subscribe({
      next: (data) => {
        this.restaurante = data;
      },
      error: (error) => {
        console.error('Erro ao carregar restaurante:', error);
      },
    });
  }

  onSubmit(): void {
    this.mesaService.criarMesa(this.mesaRequest).subscribe({
      next: () => {
        alert('Mesa cadastrada com sucesso!');
        this.mesaRequest = { numero: 0, idRestaurante: this.idRestaurante };
        this.listaMesas.carregarMesas();
      },
      error: (error) => {
        console.error('Erro ao cadastrar mesa:', error);
        alert('Erro ao cadastrar mesa. Verifique os dados e tente novamente.');
      },
    });
  }
}
