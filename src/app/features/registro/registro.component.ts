import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RegistroService, UserRequest } from '../../core/services/registro.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  nome = '';
  email = '';
  senha = '';
  role = ''; // inicialmente vazia
  idRestaurante?: number;

  constructor(
    private router: Router,
    private service: RegistroService
  ) {}

  onSubmit() {
    const userRole = this.role && this.role.trim() !== '' ? this.role : 'ADMIN';

    const request: UserRequest = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      role: userRole as 'ADMIN' | 'GARCON' | 'CHEF',
      ...(this.idRestaurante ? { idRestaurante: this.idRestaurante } : {})
    };

    this.service.criarUsuario(request).subscribe({
      next: (res: { nome: any }) => {
        alert(`Usuário ${res.nome} registrado com sucesso!`);
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Erro ao registrar usuário. Verifique os dados.');
      }
    });
  }
}
