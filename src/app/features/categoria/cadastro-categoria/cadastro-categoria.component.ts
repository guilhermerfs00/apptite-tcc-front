import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importe o CommonModule
import { CategoriaService } from '../../../core/services/categoria.service';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { CategoriaResponse } from '../../../core/models/categoria/categoria-response.model';
import { CategoriaRequest } from '../../../core/models/categoria/categoria-request';

@Component({
  selector: 'app-cadastro-categoria',
  standalone: true,
  imports: [FormsModule, CommonModule], // Adicione o CommonModule aqui
  templateUrl: './cadastro-categoria.component.html',
  styleUrls: ['./cadastro-categoria.component.css'],
})
export class CadastroCategoriaComponent implements OnInit {
  idCardapio!: number; // ID do cardápio
  categoriaRequest: CategoriaRequest = { nome: '', idCardapio: 0 }; // Ajustado para incluir idCardapio
  categoriasPage!: PaginatedResponse<CategoriaResponse>; // Dados paginados das categorias
  currentPage: number = 0; // Página atual
  pageSize: number = 10; // Tamanho da página

  constructor(
    private route: ActivatedRoute,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    // Obtém o ID do cardápio da rota
    this.idCardapio = +this.route.snapshot.paramMap.get('idCardapio')!;
    this.categoriaRequest.idCardapio = this.idCardapio; // Vincula o ID do cardápio à requisição
    this.carregarCategorias(); // Carrega as categorias ao iniciar
  }

  carregarCategorias(): void {
    this.categoriaService
      .buscarCategoriasPorCardapio(this.idCardapio, this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => {
          this.categoriasPage = page;
          console.log('Categorias carregadas:', page);
        },
        error: (error) => {
          console.error('Erro ao carregar categorias:', error);
          alert('Erro ao carregar categorias. Tente novamente.');
        },
      });
  }

  onSubmit(): void {
    // Envia os dados do formulário para a API
    this.categoriaService.criarCategoria(this.categoriaRequest).subscribe({
      next: (response) => {
        console.log('Categoria criada com sucesso:', response);
        alert('Categoria criada com sucesso!');
        this.categoriaRequest = { nome: '', idCardapio: this.idCardapio }; // Limpa o formulário, mantendo o idCardapio
        this.carregarCategorias(); // Recarrega as categorias após o cadastro
      },
      error: (error) => {
        console.error('Erro ao criar categoria:', error);
        alert('Erro ao criar categoria. Verifique os dados e tente novamente.');
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.carregarCategorias(); // Recarrega as categorias ao mudar de página
  }

  // Método para gerar os números das páginas
  getPages(): number[] {
    const pages = [];
    if (this.categoriasPage && this.categoriasPage.totalPages) {
      for (let i = 0; i < this.categoriasPage.totalPages; i++) {
        pages.push(i);
      }
    }
    return pages;
  }
}