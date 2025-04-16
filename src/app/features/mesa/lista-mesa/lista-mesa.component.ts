import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MesaService } from '../../../core/services/mesa.service';
import { MesaResponse } from '../../../core/models/mesa-response.model';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { RouterModule } from '@angular/router';
import QRCode from 'qrcode-generator';
import Swal from 'sweetalert2'; // ✅ SweetAlert2 importado

@Component({
  selector: 'app-lista-mesa',
  standalone: true,
  templateUrl: './lista-mesa.component.html',
  styleUrls: ['./lista-mesa.component.css'],
  imports: [CommonModule, RouterModule]
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
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao carregar as mesas.'
        });
      }
    });
  }

  gerarQRCodes(): void {
    this.mesas.forEach(mesa => {
      const qrContainer = document.getElementById(`qrcode-${mesa.uuid}`);
      if (qrContainer) {
        qrContainer.innerHTML = '';
        const qr = QRCode(0, 'M');
        qr.addData(`${window.location.origin}/cadastro-cliente/${mesa.idMesa}`);
        qr.make();

        const qrImg = qr.createImgTag(6);
        qrContainer.innerHTML = `<a href="${window.location.origin}/cadastro-cliente/${mesa.idMesa}" target="_blank">${qrImg}</a>`;
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
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'QR Code não encontrado para download.'
      });
    }
  }

  excluirMesa(idMesa: number): void {
    Swal.fire({
      title: 'Deseja excluir esta mesa?',
      text: 'Essa ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mesaService.excluirMesa(idMesa).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Mesa excluída com sucesso!',
              timer: 1500,
              showConfirmButton: false
            });
            this.carregarMesas();
          },
          error: (error) => {
            console.error('Erro ao excluir mesa:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Não foi possível excluir a mesa.'
            });
          }
        });
      }
    });
  }
}
