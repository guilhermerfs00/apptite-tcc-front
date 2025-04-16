import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../core/services/categoria.service';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { RestauranteResponse } from '../../../core/models/restaurante-response.model';
import { CategoriaRequest } from '../../../core/models/categoria-request';
import { ListaCategoriaComponent } from '../lista-categoria/lista-categoria.component';
import Swal from 'sweetalert2'; // ✅ Importação do SweetAlert2

@Component({
  selector: 'app-cadastro-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaCategoriaComponent],
  templateUrl: './cadastro-categoria.component.html',
  styleUrls: ['./cadastro-categoria.component.css'],
})
export class CadastroCategoriaComponent implements OnInit {
  @ViewChild(ListaCategoriaComponent) listaCategorias!: ListaCategoriaComponent;

  idRestaurante!: number;
  restaurante!: RestauranteResponse;
  categoriaRequest: CategoriaRequest = { nome: '', idRestaurante: 0 };

  constructor(
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private restauranteService: RestauranteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idRestaurante = +this.route.snapshot.paramMap.get('idRestaurante')!;
    this.categoriaRequest.idRestaurante = this.idRestaurante;

    this.restauranteService.obterRestaurantePorId(this.idRestaurante).subscribe({
      next: (data) => {
        this.restaurante = data;
      },
      error: (error) => {
        console.error('Erro ao carregar restaurante:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar os dados do restaurante.',
        });
      },
    });
  }

  onSubmit(): void {
    this.categoriaService.criarCategoria(this.categoriaRequest).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Categoria criada com sucesso!',
          timer: 1000,
          showConfirmButton: false,
        });
        this.categoriaRequest.nome = '';
        this.listaCategorias.carregarCategorias();
      },
      error: (error) => {
        console.error('Erro ao criar categoria:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao criar categoria. Verifique os dados e tente novamente.',
          timer: 1000,
          showConfirmButton: false,
        });
      },
    });
  }

  cadastrarItem(idCategoria: number): void {
    this.router.navigate(['/cadastro-item', idCategoria]);
  }
}
