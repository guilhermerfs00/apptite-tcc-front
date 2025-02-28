import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // Importe o HttpClient

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient() // Configura o HttpClient
  ]
}).catch(err => console.error(err));