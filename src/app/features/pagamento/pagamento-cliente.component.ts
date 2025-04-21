import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PedidoResponse, PedidoService } from '../../core/services/pedido.service';

@Component({
  selector: 'app-pagamento-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagamento-cliente.component.html',
  styleUrls: ['./pagamento-cliente.component.css']
})
export class PagamentoClienteComponent implements OnInit {
  idCliente!: number;
  pedidos: PedidoResponse[] = [];
  total: number = 0;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.idCliente = +this.route.snapshot.paramMap.get('id')!;
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.pedidoService.buscarPedidosPorClienteId(this.idCliente).subscribe({
      next: (res) => {
        this.pedidos = res.content;
        this.calcularTotal();
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Erro ao buscar pedidos do cliente' });
      }
    });
  }

  calcularTotal(): void {
    this.total = this.pedidos.reduce((acc, pedido) => {
      const totalItens = pedido.itens.reduce((soma, item) => soma + item.preco, 0);
      const totalVariacoes = pedido.variacoes?.reduce((soma, v) => soma + v.preco, 0) || 0;
      return acc + totalItens + totalVariacoes;
    }, 0);
  }

  efetuarPagamento(): void {
    // Chame aqui seu endpoint de pagamento (POST /pagamento/cliente/{id})
    // Exemplo simulado:
    Swal.fire({
      icon: 'success',
      title: 'Pagamento efetuado com sucesso!',
      text: `Total pago: R$ ${this.total.toFixed(2)}`,
      timer: 2000,
      showConfirmButton: false
    });
  }
}
