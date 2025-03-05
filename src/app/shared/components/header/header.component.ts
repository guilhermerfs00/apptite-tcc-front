import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isSidebarOpen = false;
  idRestaurante!: number;
  idCategoria!: number;
  idItem!: number;

  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  toggleSidebar(open: boolean) {
    this.isSidebarOpen = open;
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }

  carregarRestaurantes() {
    this.router.navigate(['/lista-restaurantes']);
  }

  cadastroRestaurante() {
    this.router.navigate(['/cadastro-restaurante']);
  }

  logout() {
    localStorage.removeItem('userToken'); // Remove token
    this.router.navigate(['/login']); // Redireciona para login
  }
}
