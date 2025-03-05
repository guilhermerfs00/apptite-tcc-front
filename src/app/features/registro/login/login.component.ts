import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    // Simula um login simples
    if (this.email === 'admin' && this.password === '123') {
      localStorage.setItem('userToken', 'token123');
      this.router.navigate(['/cadastro-restaurante']);
    } else {
      alert('Credenciais inválidas. Tente novamente.');
    }
  }
}
