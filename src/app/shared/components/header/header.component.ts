import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isSidebarOpen = false;

  constructor(private router: Router) {}

  toggleSidebar(open: boolean) {
    this.isSidebarOpen = open;
  }

  logout() {
    localStorage.removeItem('userToken'); // Remove token
    this.router.navigate(['/login']); // Redireciona para login
  }
}
