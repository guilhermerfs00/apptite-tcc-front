import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { PedidoService, PedidoResponse } from '../../core/services/pedido.service';
import { FeedbackService, FeedbackResponse } from '../../core/services/feedback.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  totalPedidos = 0;
  totalFaturamento = 0;
  totalPorStatus: Record<string, number> = {};
  pedidosPorMes: number[] = new Array(12).fill(0);

  pedidosHoje = 0;
  pedidosOntem = 0;
  variacaoHoje = 0;
  pedidosPrevisao = 0;

  dataInicio: string = '';
  dataFim: string = '';
  exportando = false;
  carregando = false;

  // Feedbacks
  feedbacks: FeedbackResponse[] = [];
  mediaNota: number = 0;

  constructor(
    private pedidoService: PedidoService,
    private feedbackService: FeedbackService
  ) {}

  ngAfterViewInit(): void {
    this.carregarPedidosFiltrados();
    this.carregarFeedbacksRestaurante(1); // ID de exemplo do restaurante
  }

  aplicarFiltro(): void {
    this.carregarPedidosFiltrados();
    this.carregarFeedbacksRestaurante(1); // Atualize o ID conforme filtro se necessário
  }

  carregarPedidosFiltrados(): void {
    this.carregando = true;

    this.pedidoService.listarTodosPedidosFiltrados(this.dataInicio, this.dataFim).subscribe({
      next: (pedidos: PedidoResponse[]) => {
        this.totalPedidos = pedidos.length;
        this.totalFaturamento = 0;
        this.totalPorStatus = {};
        this.pedidosPorMes.fill(0);

        pedidos.forEach(p => {
          const status = p.status;
          this.totalPorStatus[status] = (this.totalPorStatus[status] || 0) + 1;

          const mes = new Date(p.dataCriacao).getMonth();
          this.pedidosPorMes[mes]++;

          const valorItens = p.itens.reduce((sum, i) => sum + i.preco, 0);
          const valorVariacoes = p.variacoes?.reduce((sum, v) => sum + v.preco, 0) || 0;
          this.totalFaturamento += valorItens + valorVariacoes;
        });

        this.calcularComparacaoDias(pedidos);
        this.calcularProjecao(pedidos);
        this.renderGraficoPizza();
        this.renderGraficoBarra();
        this.carregando = false;
      },
      error: () => {
        console.error('Erro ao carregar pedidos');
        this.carregando = false;
      }
    });
  }

  carregarFeedbacksRestaurante(idRestaurante: number): void {
    this.feedbackService.findByRestaurante(idRestaurante).subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks;
        if (feedbacks.length > 0) {
          this.mediaNota = feedbacks.reduce((sum, f) => sum + (f.nota || 0), 0) / feedbacks.length;
        } else {
          this.mediaNota = 0;
        }
      },
      error: () => {
        console.error('Erro ao carregar feedbacks');
        this.feedbacks = [];
        this.mediaNota = 0;
      }
    });
  }

  calcularComparacaoDias(pedidos: PedidoResponse[]): void {
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    this.pedidosHoje = pedidos.filter(p =>
      new Date(p.dataCriacao).toDateString() === hoje.toDateString()).length;

    this.pedidosOntem = pedidos.filter(p =>
      new Date(p.dataCriacao).toDateString() === ontem.toDateString()).length;

    this.variacaoHoje = this.pedidosOntem === 0 ? 100 : ((this.pedidosHoje - this.pedidosOntem) / this.pedidosOntem) * 100;
  }

  calcularProjecao(pedidos: PedidoResponse[]): void {
    const diasUnicos = new Set(pedidos.map(p => new Date(p.dataCriacao).toDateString())).size;
    const media = pedidos.length / (diasUnicos || 1);
    this.pedidosPrevisao = Math.ceil(media * 30);
  }

  renderGraficoPizza(): void {
    const ctx = document.getElementById('graficoPizza') as HTMLCanvasElement;
    if (!ctx) return;

    const data = Object.values(this.totalPorStatus);
    const labels = Object.keys(this.totalPorStatus);
    const total = data.reduce((sum, val) => sum + val, 0);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#f97316', '#ef4444']
        }]
      },
      options: {
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const percent = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} pedidos (${percent}%)`;
              }
            }
          }
        }
      }
    });
  }

  renderGraficoBarra(): void {
    const ctx = document.getElementById('graficoBarra') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
          label: 'Pedidos por Mês',
          data: this.pedidosPorMes,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} pedidos`
            }
          },
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }

  exportarPDF(): void {
    const element = document.querySelector('.dashboard-container')!;
    const nomeArquivo = `dashboard_${new Date().toISOString().split('T')[0]}.pdf`;

    this.exportando = true;
    import('html2pdf.js').then(html2pdf => {
      html2pdf.default()
        .from(element)
        .set({
          margin: 0.5,
          filename: nomeArquivo,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        })
        .save()
        .finally(() => this.exportando = false);
    });
  }
}
