import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaService } from '../../core/services/categoria.service';
import { ItemService } from '../../core/services/item.service';
import { RestauranteService } from '../../core/services/restaurante.service';
import { VariacaoService } from '../../core/services/variacao.service';
import { PedidoService } from '../../core/services/pedido.service';

import { CategoriaResponse } from '../../core/models/categoria-response.model';
import { ItemResponse } from '../../core/models/item-response.model';
import { VariacaoResponse } from '../../core/models/variacao-response.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  idCliente!: number;
  idRestaurante!: number;
  categorias: CategoriaResponse[] = [];
  itens: ItemResponse[] = [];
  categoriaSelecionada!: number;

  imagemPadrao = `${window.location.origin}/assets/img/sem-imagem.jpg`;

  variacoesPorItem: { [idItem: number]: VariacaoResponse[] } = {};
  itemExpandido: number | null = null;
  variacoesSelecionadas: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private restauranteService: RestauranteService,
    private itemService: ItemService,
    private variacaoService: VariacaoService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    const idClienteParam = this.route.snapshot.paramMap.get('idCliente');
    if (idClienteParam) {
      this.idCliente = Number(idClienteParam);
      this.carregarCategoriasDoCliente();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'ID do cliente não encontrado na URL.'
      });
    }
  }

  carregarCategoriasDoCliente(): void {
    this.restauranteService.obterRestaurantePorIdCliente(this.idCliente).subscribe({
      next: (restaurante) => {
        this.idRestaurante = restaurante.idRestaurante;
        this.buscarCategoriasPorRestaurante(this.idRestaurante);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao carregar restaurante do cliente.'
        });
      }
    });
  }

  buscarCategoriasPorRestaurante(idRestaurante: number): void {
    this.categoriaService.buscarCategoriasPorRestaurante(idRestaurante).subscribe({
      next: (data) => {
        this.categorias = data.content;
        if (this.categorias.length > 0) {
          this.categoriaSelecionada = this.categorias[0].idCategoria;
          this.carregarItens(this.categoriaSelecionada);
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao carregar categorias.'
        });
      }
    });
  }

  carregarItens(idCategoria: number): void {
    this.itemService.buscarItensPorCategoria(idCategoria).subscribe({
      next: (data) => {
        this.itens = data.content;

        this.itens.forEach(item => {
          this.itemService.getItemImageBase64(item.idItem).subscribe({
            next: (base64) => {
              item.imagemUrl = `data:image/jpeg;base64,${base64}`;
            },
            error: () => {
              item.imagemUrl = this.imagemPadrao;
            }
          });

          this.variacaoService.buscarVariacoesPorItem(item.idItem).subscribe({
            next: (res) => {
              this.variacoesPorItem[item.idItem] = res.content;
            },
            error: () => {
              console.error('Erro ao buscar variações do item:', item.idItem);
            }
          });
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao carregar itens.'
        });
      }
    });
  }

  onCategoriaChange(): void {
    this.carregarItens(this.categoriaSelecionada);
  }

  toggleVariacoes(idItem: number): void {
    this.itemExpandido = this.itemExpandido === idItem ? null : idItem;
  }

  toggleVariacaoSelecionada(idVariacao: number): void {
    const index = this.variacoesSelecionadas.indexOf(idVariacao);
    if (index > -1) {
      this.variacoesSelecionadas.splice(index, 1);
    } else {
      this.variacoesSelecionadas.push(idVariacao);
    }
  }

  enviarPedido(idItem: number): void {
    const pedido = {
      idCliente: this.idCliente,
      idItem: idItem,
      idsVariacao: this.variacoesSelecionadas
    };

    this.pedidoService.criarPedido(pedido).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Pedido realizado com sucesso!',
          timer: 1500,
          showConfirmButton: false
        });
        this.variacoesSelecionadas = [];
        this.itemExpandido = null;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao criar pedido. Tente novamente.'
        });
      }
    });
  }

  scrollCategoria(direcao: 'left' | 'right'): void {
    const el = this.scrollContainer?.nativeElement as HTMLElement;
    const scrollAmount = 200;
    if (el) {
      el.scrollBy({ left: direcao === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  }
}
