import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';  // ✅ Importando CommonModule para usar *ngFor
import { MesaService } from '../../../core/services/mesa.service';
import { MesaResponse } from '../../../core/models/mesa/mesa-response.model';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import QRCode from 'qrcode-generator';

@Component({
  selector: 'app-lista-mesa',
  standalone: true,
  templateUrl: './lista-mesa.component.html',
  styleUrls: ['./lista-mesa.component.css'],
  imports: [CommonModule]  // ✅ Adicionando CommonModule para resolver o erro do *ngFor
})
export class ListaMesaComponent implements OnInit {
  idRestaurante!: number;
  mesas: MesaResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private mesaService: MesaService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.idRestaurante = +this.route.snapshot.paramMap.get('idRestaurante')!;
    this.carregarMesas();
  }

  carregarMesas(): void {
    this.mesaService.buscarMesasPorRestaurante(this.idRestaurante).subscribe({
      next: (data: PaginatedResponse<MesaResponse>) => {
        this.mesas = data.content;
        setTimeout(() => this.gerarQRCodes(), 100);
      },
      error: (error) => {
        console.error('Erro ao carregar mesas:', error);
      }
    });
  }

  gerarQRCodes(): void {
    this.mesas.forEach(mesa => {
      const qrContainer = document.getElementById(`qrcode-${mesa.uuid}`);
      if (qrContainer) {
        qrContainer.innerHTML = ''; // Limpa o conteúdo anterior
        const qr = QRCode(0, 'M');
        qr.addData(`http://localhost:4200/mesa/${mesa.uuid}`);
        qr.make();
        qrContainer.innerHTML = qr.createImgTag(6); // Gera a imagem do QR Code
      }
    });
  }

  baixarQRCode(uuid: string, numeroMesa: number): void {
    const qrElement = document.getElementById(`qrcode-${uuid}`)?.querySelector('img');
    if (qrElement) {
      const link = document.createElement('a');
      link.href = (qrElement as HTMLImageElement).src;
      link.download = `mesa_${numeroMesa}_qrcode.png`;
      link.click();
    } else {
      console.error('Erro ao encontrar o QR Code para download.');
    }
  }

  excluirMesa(idMesa: number): void {
    if (confirm('Tem certeza que deseja excluir esta mesa?')) {
      this.mesaService.excluirMesa(idMesa).subscribe({
        next: () => {
          alert('Mesa excluída com sucesso!');
          this.carregarMesas();
        },
        error: (error) => {
          console.error('Erro ao excluir mesa:', error);
        }
      });
    }
  }
}
