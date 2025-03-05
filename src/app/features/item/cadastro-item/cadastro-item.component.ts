import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../../core/services/item.service';
import { ItemRequest } from '../../../core/models/item/item-request.model';
import { ListaItemComponent } from '../lista-item/lista-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { CategoriaResponse } from '../../../core/models/categoria/categoria-response.model';

@Component({
  selector: 'app-cadastro-item',
  standalone: true,
  imports: [FormsModule, CommonModule, ListaItemComponent],
  templateUrl: './cadastro-item.component.html',
  styleUrls: ['./cadastro-item.component.css'],
})
export class CadastroItemComponent {
  
  @ViewChild(ListaItemComponent) listaItens!: ListaItemComponent;
  
  idCategoria!: number;
  categoria!: CategoriaResponse;
  itemRequest: ItemRequest = { nome: '', preco: 0, descricao: '', idCategoria: 0 };

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idCategoria = +this.route.snapshot.paramMap.get('idCategoria')!;
    this.itemRequest.idCategoria = this.idCategoria;

    this.categoriaService.obterCategoriaPorId(this.idCategoria).subscribe({
      next: (data) => {
        this.categoria = data;
      },
      error: (error) => {
        console.error('Erro ao carregar restaurante:', error);
      },
    });
  }

  onSubmit(): void {
    this.itemService.criarItem(this.itemRequest).subscribe({
      next: () => {
        alert('Item criado com sucesso!');
        this.itemRequest = { nome: '', preco: 0, descricao: '', idCategoria: 0 };
        this.listaItens.carregarItens();
      },
      error: (error) => {
        console.error('Erro ao criar categoria:', error);
        alert('Erro ao criar categoria. Verifique os dados e tente novamente.');
      },
    });
  }

  cadastrarVariacao(idVariacao: number): void {
    this.router.navigate(['/cadastro-variacao', idVariacao]);
  }
}
