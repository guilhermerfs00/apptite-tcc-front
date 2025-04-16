import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VariacaoService } from '../../../core/services/variacao.service';
import { VariacaoRequest } from '../../../core/models/variacao-request.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { ItemResponse } from '../../../core/models/item-response.model';
import { ListaVariacaoComponent } from '../lista-variacao/lista-variacao.component';

@Component({
  selector: 'app-cadastro-variacao',
  standalone: true,
  imports: [FormsModule, CommonModule, ListaVariacaoComponent],
  templateUrl: './cadastro-variacao.component.html',
  styleUrls: ['./cadastro-variacao.component.css'],
})
export class CadastroVariacaoComponent {

  @ViewChild(ListaVariacaoComponent) listaVariacoes!: ListaVariacaoComponent;
  
  idItem!: number;
  item!: ItemResponse;
  variacaoRequest: VariacaoRequest = { nome: '', preco: 0, idItem: 0 };

  constructor(
    private route: ActivatedRoute,
    private variacaoService: VariacaoService,
    private itemService: ItemService  ) { }

  ngOnInit(): void {
    this.idItem = +this.route.snapshot.paramMap.get('idItem')!;
    this.variacaoRequest.idItem = this.idItem;

    this.itemService.obterItemPorId(this.idItem).subscribe({
      next: (data) => {
        this.item = data;
      },
      error: (error) => {
        console.error('Erro ao carregar item:', error);
      },
    });
  }

  onSubmit(): void {
    this.variacaoService.criarVariacao(this.variacaoRequest).subscribe({
      next: () => {
        alert('Variação criada com sucesso!');
        this.variacaoRequest = { nome: '', preco: 0, idItem: this.idItem };
        this.listaVariacoes.carregarVariacoes();
      },
      error: (error) => {
        console.error('Erro ao criar variação:', error);
        alert('Erro ao criar variação. Verifique os dados e tente novamente.');
      },
    });
  }
}
