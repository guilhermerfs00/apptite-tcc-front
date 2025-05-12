import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.css',
    './header-cliente.component.css'
  ]
})
export class HeaderComponent implements OnInit {
  isAdmin = false;
  isChef = false;
  isGarcon = false;
  isCliente = false;
  isMobileMenuOpen = false;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.profile$.subscribe(profile => {
      this.isAdmin = profile.role === 'ADMIN';
      this.isChef = profile.role === 'CHEF';
      this.isGarcon = profile.role === 'GARCON';
      this.isCliente = profile.role === 'CLIENTE';
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  dashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  carregarRestaurantes(): void {
    this.router.navigate(['/lista-restaurantes']);
  }

  cadastroRestaurante(): void {
    this.router.navigate(['/cadastro-restaurante']);
  }

  verPedidosChef(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload?.sub;

      if (!email) return;

      this.usuarioService.findByEmail(email).subscribe({
        next: (user) => {
          if (user.idRestaurante) {
            this.router.navigate([`/listar-pedidos-chef/${user.idRestaurante}`]);
          }
        },
        error: () => console.error('Erro ao buscar usuário por e-mail.')
      });
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
    }
  }

  verPedidosGarcon(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload?.sub;

      if (!email) return;

      this.usuarioService.findByEmail(email).subscribe({
        next: (user) => {
          if (user.idRestaurante) {
            this.router.navigate([`/listar-pedidos-garcon/${user.idRestaurante}`]);
          }
        },
        error: () => console.error('Erro ao buscar usuário por e-mail.')
      });
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
    }
  }

  pedidosCliente(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const idCliente = payload?.idCliente || payload?.id;
      if (!idCliente) return;
      this.router.navigate([`/pedido/${idCliente}`]);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
    }
  }

  verPedidosCliente(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const idCliente = payload?.id;

      if (!idCliente) return;

      this.router.navigate([`/listar-pedidos-cliente/${idCliente}`]);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
    }
  }

  pagarConta(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const idCliente = payload?.id;
  
      if (!idCliente) return;
  
      this.router.navigate([`/pagamento/${idCliente}`]);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
    }
  }  

  logout(): void {
    const token = localStorage.getItem('accessToken');
    this.authService.logout();

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const idRestaurante = payload?.idRestaurante;
      const role = payload?.role;

      console.log('ID Restaurante:', idRestaurante);
      console.log('Role:', role);

      if (role === 'CLIENTE' && idRestaurante) {
        this.router.navigate([`/cadastro-cliente/${idRestaurante}`]);
      } else {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Erro ao decodificar token no logout:', error);
      this.router.navigate(['/login']);
    }
  }

  abrirFeedback(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const idCliente = payload?.id;
      if (!idCliente) return;
      this.router.navigate([`/feedback/${idCliente}`]);
    } catch (error) {
      console.error('Erro ao decodificar token para feedback:', error);
    }
  }
  
}
