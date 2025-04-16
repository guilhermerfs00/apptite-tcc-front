import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RegistroService, UserRequest } from '../../../core/services/registro.service';
import Swal from 'sweetalert2'; // ✅ SweetAlert2

@Component({
  selector: 'app-registro-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './registro-funcionario.component.html',
  styleUrls: ['./registro-funcionario.component.css'],
})
export class RegistroFuncionarioComponent {
  nome = '';
  email = '';
  senha = '';
  role: 'GARCON' | 'CHEF' = 'GARCON';
  idRestaurante: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: RegistroService
  ) {}

  ngOnInit(): void {
    this.idRestaurante = Number(this.route.snapshot.paramMap.get('idRestaurante'));
  }

  onSubmit() {
    const request: UserRequest = {
      idRestaurante: this.idRestaurante,
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      role: this.role,
    };

    this.service.criarUsuario(request).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Funcionário cadastrado!',
          text: `Funcionário ${res.nome} foi registrado com sucesso.`,
          timer: 1000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/lista-restaurantes']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao cadastrar funcionário. Verifique os dados e tente novamente.'
        });
      }
    });
  }
}
