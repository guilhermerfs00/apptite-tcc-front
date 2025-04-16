import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../../core/services/item.service';
import { ItemRequest } from '../../../core/models/item-request.model';
import { ListaItemComponent } from '../lista-item/lista-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { CategoriaResponse } from '../../../core/models/categoria-response.model';
import Swal from 'sweetalert2'; // ✅ Importação do SweetAlert2

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
  selectedFile!: File;
  itemRequest: ItemRequest = { nome: '', preco: 0, descricao: '', idCategoria: 0 };

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idCategoria = +this.route.snapshot.paramMap.get('idCategoria')!;
    this.itemRequest.idCategoria = this.idCategoria;

    this.categoriaService.obterCategoriaPorId(this.idCategoria).subscribe({
      next: (data) => {
        this.categoria = data;
      },
      error: (error) => {
        console.error('Erro ao carregar categoria:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao carregar categoria.',
        });
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('nome', this.itemRequest.nome);
    formData.append('descricao', this.itemRequest.descricao);
    formData.append('preco', this.itemRequest.preco.toString());
    formData.append('idCategoria', this.itemRequest.idCategoria.toString());

    if (this.selectedFile) {
      formData.append('imagem', this.selectedFile, 'imagem_temp.jpg');
    }

    this.itemService.uploadItem(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Item criado com sucesso!',
          timer: 1500,
          showConfirmButton: false
        });
        this.itemRequest = {
          nome: '',
          preco: 0,
          descricao: '',
          idCategoria: this.idCategoria
        };
        this.selectedFile = undefined!;
        this.listaItens.carregarItens();
      },
      error: (error) => {
        console.error('Erro ao criar item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao criar item. Verifique os dados e tente novamente.'
        });
      },
    });
  }

  cadastrarVariacao(idVariacao: number): void {
    this.router.navigate(['/cadastro-variacao', idVariacao]);
  }
}
