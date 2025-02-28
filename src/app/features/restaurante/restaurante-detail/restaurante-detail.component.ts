import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { Restaurante } from '../../../core/models/restaurante.model';

@Component({
  selector: 'app-restaurante-detail',
  standalone: true, // Componente standalone
  templateUrl: './restaurante-detail.component.html',
  styleUrls: ['./restaurante-detail.component.css'],
  providers: [RestauranteService], // Adicione o serviço aqui
})
export class RestauranteDetailComponent implements OnInit {
  restaurante: Restaurante | undefined;

  constructor(
    private route: ActivatedRoute,
    private restauranteService: RestauranteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarRestaurante(+id);
    }
  }

  carregarRestaurante(id: number): void {
    this.restauranteService.getRestaurante(id).subscribe(
      (data) => {
        this.restaurante = data;
      },
      (error) => {
        console.error('Erro ao carregar detalhes do restaurante:', error);
      }
    );
  }
}