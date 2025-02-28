import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestauranteListComponent } from './restaurante-list/restaurante-list.component';
import { RestauranteDetailComponent } from './restaurante-detail/restaurante-detail.component';
import { RouterModule } from '@angular/router';
import { RestauranteService } from '../../core/services/restaurante.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: RestauranteListComponent },
      { path: ':id', component: RestauranteDetailComponent }
    ]),
    RestauranteListComponent,
    RestauranteDetailComponent
  ],
  providers: [RestauranteService],
})
export class RestauranteModule { }