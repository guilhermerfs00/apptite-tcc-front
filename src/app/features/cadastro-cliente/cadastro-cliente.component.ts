import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteRequest } from '../../core/models/cliente-request.model';
import { ClienteService } from '../../core/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css'],
})
export class CadastroClienteComponent {
  clienteRequest: ClienteRequest = {
    nome: '', celular: '', cpf: '',
    idMesa: 0
  };
  
  idMesa!: number;

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idMesa = +this.route.snapshot.paramMap.get('idMesa')!;
    this.clienteRequest.idMesa = this.idMesa;
  }

  onSubmit() {
    this.clienteService.criarCliente(this.clienteRequest).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Cliente cadastrado!',
          text: 'Redirecionando para o pedido...',
          timer: 1000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/pedido/${response.idCliente}`]);
        });
      },
      error: (error) => {
        console.error('Erro ao cadastrar cliente:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao cadastrar cliente. Verifique os dados.',
          timer: 1000,
          showConfirmButton: false
        });
      },
    });
  }
}
