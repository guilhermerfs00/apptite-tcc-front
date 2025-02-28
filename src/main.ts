import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module'; // Importe as rotas
import { provideHttpClient } from '@angular/common/http'; // Importe o HttpClient

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()], // Configure as rotas e o HttpClient
}).catch((err) => console.error(err));