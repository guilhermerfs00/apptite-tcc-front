import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VariacaoService } from '../../../core/services/variacao.service';
import { VariacaoResponse } from '../../../core/models/variacao-response.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-variacao',
  imports: [CommonModule, FormsModule],
  templateUrl: './variacao.component.html',
  styleUrls: ['./variacao.component.css'],
})
export class VariacaoComponent implements OnInit {
  idItem!: number;
  variacoes: VariacaoResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private variacaoService: VariacaoService
  ) {}

  ngOnInit(): void {
    this.idItem = +this.route.snapshot.paramMap.get('idItem')!;
    this.carregarVariacoes();
  }

  carregarVariacoes(): void {
    this.variacaoService.buscarVariacoesPorItem(this.idItem).subscribe({
      next: (response) => {
        this.variacoes = response.content;
      },
      error: (err) => {
        console.error('Erro ao buscar variações do item:', err);
      }
    });
  }
}
