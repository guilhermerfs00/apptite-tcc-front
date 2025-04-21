import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService, PedidoResponse } from '../../../core/services/pedido.service';
import { PedidoVisual } from '../../../core/models/pedido-visual.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-pedidos-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-pedidos-cliente.component.html',
  styleUrls: ['./lista-pedido-cliente.component.css']
})
export class ListarPedidosClienteComponent implements OnInit {
  id!: number;
  pedidos: PedidoVisual[] = [];
  pedidosOriginais: PedidoVisual[] = [];
  filtroTexto: string = '';
  ordem: 'maisRecentes' | 'maisAntigos' = 'maisRecentes';

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.carregarPedidosCliente();
  }

  carregarPedidosCliente(): void {
    this.pedidoService.buscarPedidosPorClienteId(this.id).subscribe({
      next: (res) => {
        this.pedidos = res.content.map(pedido => ({
          ...pedido,
          tempoDecorrido: this.calcularTempo(pedido.dataCriacao)
        }));
        this.pedidosOriginais = [...this.pedidos];
        this.ordenarPedidos();
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Erro ao carregar pedidos do cliente' });
      }
    });
  }

  ordenarPedidos(): void {
    const compare = (a: PedidoResponse, b: PedidoResponse) => {
      const timeA = new Date(a.dataCriacao).getTime();
      const timeB = new Date(b.dataCriacao).getTime();
      return this.ordem === 'maisRecentes' ? timeB - timeA : timeA - timeB;
    };
    this.pedidos.sort(compare);
  }

  filtrarPedidos(): void {
    const termo = this.filtroTexto.toLowerCase();
    this.pedidos = this.pedidosOriginais.filter(
      pedido =>
        pedido.status.toLowerCase().includes(termo) ||
        pedido.itens.some(item => item.nome.toLowerCase().includes(termo))
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