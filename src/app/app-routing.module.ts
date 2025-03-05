import { Routes } from '@angular/router';
import { LoginComponent } from './features/registro/login/login.component';
import { CadastroRestauranteComponent } from './features/restaurante/cadastro-restaurante/cadastro-restaurante.component';
import { ListaRestaurantesComponent } from './features/restaurante/lista-restaurante/lista-restaurante.component';
import { CadastroCategoriaComponent } from './features/categoria/cadastro-categoria/cadastro-categoria.component';
import { RegistroPasso1Component } from './features/registro/registro-passo-1/registro-passo1.component';
import { RegistroPasso2Component } from './features/registro/registro-passo-2/registro-passo2.component';
import { CadastroItemComponent } from './features/item/cadastro-item/cadastro-item.component';
import { ListaItemComponent } from './features/item/lista-item/lista-item.component';
import { CadastroVariacaoComponent } from './features/variacao/cadastro-variacao/cadastro-variacao.component';
import { ListaVariacaoComponent } from './features/variacao/lista-variacao/lista-variacao.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro-restaurante', component: CadastroRestauranteComponent },
  { path: 'lista-restaurantes', component: ListaRestaurantesComponent },
  { path: 'cadastro-categoria/:idRestaurante', component: CadastroCategoriaComponent },
  { path: 'registro', component: RegistroPasso1Component },
  { path: 'registro-passo2', component: RegistroPasso2Component },
  { path: 'cadastro-item/:idCategoria', component: CadastroItemComponent },
  { path: 'lista-item/:idCategoria', component: ListaItemComponent },
  { path: 'cadastro-variacao/:idItem', component: CadastroVariacaoComponent },
  { path: 'lista-variacao/:idItem', component: ListaVariacaoComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];