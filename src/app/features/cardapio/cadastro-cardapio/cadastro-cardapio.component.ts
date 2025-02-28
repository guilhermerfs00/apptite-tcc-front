import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardapioService } from '../../../core/services/cardapio.service';
import { CardapioRequest } from '../../../core/models/cardapio-request.model';

@Component({
  selector: 'app-cadastro-cardapio',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro-cardapio.component.html',
  styleUrls: ['./cadastro-cardapio.component.css'],
})
export class CadastroCardapioComponent implements OnInit {
  idRestaurante!: number; // ID do restaurante
  cardapioRequest: CardapioRequest = { nome: '', descricao: '' }; // Dados do formulário

  constructor(
    private route: ActivatedRoute,
    private cardapioService: CardapioService
  ) {}

  ngOnInit(): void {
    // Obtém o ID do restaurante da rota
    this.idRestaurante = +this.route.snapshot.paramMap.get('idRestaurante')!;
  }

  onSubmit(): void {
    // Envia os dados do formulário para a API
    this.cardapioService.criarCardapio(this.idRestaurante, this.cardapioRequest).subscribe({
      next: (response) => {
        console.log('Cardápio criado com sucesso:', response);
        alert('Cardápio criado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao criar cardápio:', error);
        alert('Erro ao criar cardápio. Verifique os dados e tente novamente.');
      },
    });
  }
}