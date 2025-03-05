import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-passo2',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-passo2.component.html',
  styleUrls: ['./registro-passo2.component.css'],
})
export class RegistroPasso2Component {
  email: string = '';

  constructor(private router: Router) {
    this.email = sessionStorage.getItem('email') || '';
  }

  onSubmit() {
    alert(`Conta registrada para ${this.email}!`);
    this.router.navigate(['/login']);
  }
}
