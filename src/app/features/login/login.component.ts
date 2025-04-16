import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoginService, AuthenticationRequest, TokenResponse } from '../../core/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  onSubmit() {
    const request: AuthenticationRequest = {
      email: this.email,
      password: this.password
    };

    this.loginService.login(request).subscribe({
      next: (response: TokenResponse) => {
        localStorage.setItem('accessToken', response.accessToken);

        const role = response.profile.role;
        const idRestaurante = response.profile.idRestaurante;

        Swal.fire({
          icon: 'success',
          title: 'Login realizado!',
          timer: 1000,
          showConfirmButton: false
        }).then(() => {
          if (role === 'ADMIN') {
            this.router.navigate(['/cadastro-restaurante']);
          } else if (role === 'CHEF') {
            this.router.navigate([`/listar-pedidos-chef/${idRestaurante}`]);
          } else if (role === 'GARCON') {
            this.router.navigate([`/listar-pedidos-garcon/${idRestaurante}`]);
          } else {
            this.router.navigate(['/login']);
          }
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Falha no login',
          text: 'Email ou senha inválidos.',
          showConfirmButton: false,
          timer: 1000,
        });
      }
    });
  }

  onClick() {
    this.router.navigate(['/registro']);
  }
}
