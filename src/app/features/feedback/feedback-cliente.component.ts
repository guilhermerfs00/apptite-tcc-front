import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeedbackService } from '../../core/services/feedback.service';
import { RestauranteService } from '../../core/services/restaurante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feedback-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-cliente.component.html',
  styleUrls: ['./feedback-cliente.component.css']
})
export class FeedbackClienteComponent {
  conteudo: string = '';
  nota: number | null = null;
  idCliente!: number;
  idRestaurante!: number;

  constructor(
    private route: ActivatedRoute,
    private feedbackService: FeedbackService,
    private restauranteService: RestauranteService
  ) {}

  ngOnInit(): void {
    this.idCliente = +this.route.snapshot.paramMap.get('idCliente')!;

    this.restauranteService.obterRestaurantePorIdCliente(this.idCliente).subscribe({
      next: (res) => {
        this.idRestaurante = res.idRestaurante;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao obter restaurante do cliente'
        });
      }
    });
  }

  enviarFeedback(): void {
    if (!this.conteudo || !this.nota || !this.idRestaurante) return;

    this.feedbackService.criarFeedback({
      idCliente: this.idCliente,
      idRestaurante: this.idRestaurante,
      conteudo: this.conteudo,
      nota: this.nota
    }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Obrigado pelo seu feedback!',
          text: 'Sua opinião é muito importante para nós.',
          confirmButtonColor: '#e65100'
        });

        this.conteudo = '';
        this.nota = null;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao enviar feedback',
          text: 'Tente novamente mais tarde.',
          confirmButtonColor: '#e65100'
        });
      }
    });
  }
}
