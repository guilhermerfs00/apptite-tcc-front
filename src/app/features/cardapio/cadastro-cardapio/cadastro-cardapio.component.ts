import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardapioService } from '../../../core/services/cardapio.service';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { CardapioRequest } from '../../../core/models/cardapio/cardapio-request.model';
import { CardapioResponse } from '../../../core/models/cardapio/cardapio-response.model';
import { RestauranteResponse } from '../../../core/models/restaurante/restaurante-response.model';

@Component({
  selector: 'app-cadastro-cardapio',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro-cardapio.component.html',
  styleUrls: ['./cadastro-cardapio.component.css'],
})
export class CadastroCardapioComponent implements OnInit {
  idRestaurante!: number;
  restaurante!: RestauranteResponse; // Guarda os dados do restaurante
  cardapioRequest: CardapioRequest = { nome: '', idRestaurante: 0 };

  constructor(
    private route: ActivatedRoute,
    private cardapioService: CardapioService,
    private restauranteService: RestauranteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idRestaurante = +this.route.snapshot.paramMap.get('idRestaurante')!;
    this.cardapioRequest.idRestaurante = this.idRestaurante;

    this.restauranteService.obterRestaurantePorId(this.idRestaurante).subscribe({
      next: (data: RestauranteResponse) => {
        this.restaurante = data;
      },
      error: (error: any) => {
        console.error('Erro ao carregar restaurante:', error);
      },
    });
  }

  onSubmit(): void {
    this.cardapioService.criarCardapio(this.cardapioRequest).subscribe({
      next: (response: CardapioResponse) => {
        alert('Cardápio criado com sucesso!');
        this.router.navigate(['/cadastro-categoria', response.idCardapio]);
      },
      error: (error) => {
        console.error('Erro ao criar cardápio:', error);
        alert('Erro ao criar cardápio. Verifique os dados e tente novamente.');
      },
    });
  }
}
