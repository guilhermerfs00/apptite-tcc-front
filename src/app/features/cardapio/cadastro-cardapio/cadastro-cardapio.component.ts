import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardapioService } from '../../../core/services/cardapio.service';
import { CardapioRequest } from '../../../core/models/cardapio/cardapio-request.model';
import { CardapioResponse } from '../../../core/models/cardapio/cardapio-response.model';

@Component({
  selector: 'app-cadastro-cardapio',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro-cardapio.component.html',
  styleUrls: ['./cadastro-cardapio.component.css'],
})
export class CadastroCardapioComponent implements OnInit {
  idRestaurante!: number;
  cardapioRequest: CardapioRequest = { nome: '', idRestaurante: 0 };

  constructor(
    private route: ActivatedRoute,
    private cardapioService: CardapioService,
    private router: Router // Adicionado para redirecionamento
  ) {}

  ngOnInit(): void {
    // Obtém o ID do restaurante da rota
    this.idRestaurante = +this.route.snapshot.paramMap.get('idRestaurante')!;
    this.cardapioRequest.idRestaurante = this.idRestaurante;
  }

  onSubmit(): void {
    // Envia os dados do formulário para a API
    this.cardapioService.criarCardapio(this.cardapioRequest).subscribe({
      next: (response: CardapioResponse) => {
        console.log('Cardápio criado com sucesso:', response);
        alert('Cardápio criado com sucesso!');
        // Redireciona para a página de cadastro de categoria, passando o ID do cardápio
        this.router.navigate(['/cadastro-categoria', response.idCardapio]);
      },
      error: (error) => {
        console.error('Erro ao criar cardápio:', error);
        alert('Erro ao criar cardápio. Verifique os dados e tente novamente.');
      },
    });
  }
}