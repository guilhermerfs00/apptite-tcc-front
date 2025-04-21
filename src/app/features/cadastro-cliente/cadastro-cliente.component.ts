import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteRequest } from '../../core/models/cliente-request.model';
import { ClienteService } from '../../core/services/cliente.service';
import { AuthService } from '../../core/services/auth.service';
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
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idMesa = +this.route.snapshot.paramMap.get('idMesa')!;
    this.clienteRequest.idMesa = this.idMesa;
  }

  onSubmit() {
    // Primeiro tenta cadastrar o cliente
    this.clienteService.criarCliente(this.clienteRequest).subscribe({
      next: (response) => {
        // Em seguida, tenta logar o cliente
        this.authService.loginCliente(response.idCliente).subscribe({
          next: (token) => {
            localStorage.setItem('accessToken', token);
            this.authService.atualizarPerfil();

            Swal.fire({
              icon: 'success',
              title: 'Cliente autenticado! 🎉',
              text: 'Redirecionando para o pedido...',
              timer: 1000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate([`/pedido/${response.idCliente}`]);
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao realizar login do cliente',
              text: 'Cadastro efetuado, mas o login falhou.'
            });
          }
        });
      },
      error: (error) => {
        if (error.status === 409 && error.error?.idCliente) {
          const idExistente = error.error.idCliente;
          this.authService.loginCliente(idExistente).subscribe({
            next: (token) => {
              localStorage.setItem('accessToken', token);
              this.authService.atualizarPerfil();

              Swal.fire({
                icon: 'success',
                title: 'Cliente já existente! 🎉',
                text: 'Autenticado com sucesso.',
                timer: 1000,
                showConfirmButton: false
              }).then(() => {
                this.router.navigate([`/pedido/${idExistente}`]);
              });
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Erro ao logar cliente existente'
              });
            }
          });
        } else {
          console.error('Erro ao cadastrar cliente:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao cadastrar cliente. Verifique os dados.',
            timer: 1000,
            showConfirmButton: false
          });
        }
      },
    });
  }
}