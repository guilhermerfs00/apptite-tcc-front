import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PedidoResponse, PedidoService } from '../../core/services/pedido.service';
import { PagamentoService, PagamentoRequest, MetodoDePagamento, PagamentoResponse } from '../../core/services/pagamento.service';

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
  focandoCvv = false;
  dadosCartao: MetodoDePagamento = {
    name: 'João da Silva',
    cardNumber: '4242424242424242',
    expirationDate: '12/30',
    securityCode: '123'
  };
  mostrarFormularioPagamento: boolean = false;
  pagamentoStatus: 'PAGO' | 'PENDENTE' | null = null;
  idPagamento: number = 123;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private pagamentoService: PagamentoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.idCliente = +this.route.snapshot.paramMap.get('id')!;
    this.carregarPedidos();
    this.cdr.detectChanges(); // Força atualização do template
  }
  carregarPedidos(): void {
    this.pedidoService.buscarPedidosPorClienteId(this.idCliente).subscribe({
      next: (res) => {
        this.pedidos = res.content;
        this.calcularTotal();
        this.verificarStatusPagamento();
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

  verificarStatusPagamento(): void {
    this.pagamentoService.consultarStatusPagamento(this.idCliente).subscribe({
      next: (res: string) => {
        const status = res?.toUpperCase();

        if (status === 'PAGO') {
          this.pagamentoStatus = 'PAGO';
          this.mostrarFormularioPagamento = false;
        } else {
          this.pagamentoStatus = 'PENDENTE';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.pagamentoStatus = null;
        Swal.fire({ icon: 'error', title: 'Erro ao consultar status do pagamento' });
      }
    });
  }

  efetuarPagamento(): void {
    this.mostrarFormularioPagamento = true;
  }

  confirmarPagamento(): void {
    const payload: PagamentoRequest = {
      idPagamento: this.idPagamento,
      valorPago: this.total,
      valorTotal: this.total,
      idCliente: this.idCliente,
      metodoDePagamento: this.dadosCartao
    };

    this.pagamentoService.realizarPagamento(payload).subscribe({
      next: () => {
        this.verificarStatusPagamento();
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Erro ao realizar pagamento' });
      }
    });
  }

  fecharFormulario(): void {
    this.mostrarFormularioPagamento = false;
    this.focandoCvv = false;
  }
}
