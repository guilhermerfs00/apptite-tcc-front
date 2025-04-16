import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PedidoService,
  PedidoResponse,
} from '../../../core/services/pedido.service';
import Swal from 'sweetalert2';
import { PedidoVisual } from '../../../core/models/pedido-visual.model';

@Component({
  selector: 'app-lista-pedido-garcon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-pedido-garcon.component.html',
  styleUrls: ['./lista-pedido-garcon.component.css'],
})
export class ListaPedidoGarconComponent implements OnInit {
  idRestaurante!: number;

  pedidosRealizados: PedidoVisual[] = [];
  pedidosOriginais: PedidoVisual[] = [];


  filtroTexto: string = '';
  ordem: 'maisRecentes' | 'maisAntigos' = 'maisRecentes';

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idRestaurante');
    if (id) {
      this.idRestaurante = +id;
      this.carregarPedidos();
    }
  }

  carregarPedidos(): void {
    this.pedidoService
      .buscarPedidosPorRestauranteEStatus(this.idRestaurante, 'AGUARDANDO_RETIRADA')
      .subscribe({
        next: (res) => {
          this.pedidosRealizados = res.content.map((p) => ({
            ...p,
            tempoDecorrido: this.calcularTempo(p.dataCriacao),
          }));
          this.pedidosOriginais = [...this.pedidosRealizados];
          this.ordenarPedidos();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao carregar pedidos',
          });
        },
      });
  }

  atualizarStatus(idPedido: number, status: string): void {
    this.pedidoService.atualizarStatusPedido(status, idPedido).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Status atualizado!',
          timer: 1200,
          showConfirmButton: false,
        });
        this.carregarPedidos();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao atualizar pedido',
        });
      },
    });
  }

  ordenarPedidos(): void {
    const compare = (a: PedidoResponse, b: PedidoResponse) => {
      const timeA = new Date(a.dataCriacao).getTime();
      const timeB = new Date(b.dataCriacao).getTime();
      return this.ordem === 'maisRecentes' ? timeB - timeA : timeA - timeB;
    };

    this.pedidosRealizados.sort(compare);
  }

  filtrarPedidos(): void {
    const termo = this.filtroTexto.toLowerCase();

    this.pedidosRealizados = this.pedidosOriginais.filter(
      (pedido) =>
        pedido.cliente.nome.toLowerCase().includes(termo) ||
        pedido.itens.some((item) =>
          item.nome.toLowerCase().includes(termo)
        )
    );
  }

  calcularTempo(dataCriacao: string): string {
    const agora = new Date();
    const dataPedido = new Date(dataCriacao);
    const diffMs = agora.getTime() - dataPedido.getTime();
    const minutos = Math.floor(diffMs / 60000);
    const horas = Math.floor(minutos / 60);
    const restanteMinutos = minutos % 60;

    if (minutos < 1) return 'agora mesmo';
    if (minutos < 60) return `${minutos} min atrás`;
    return `${horas}h ${restanteMinutos}min atrás`;
  }
}
