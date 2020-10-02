import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/weather', pathMatch: 'full' },
  { path: 'weather', component: WeatherComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'weather/:id', component: WeatherComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [

  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
export const routingComponents = [WeatherComponent, FavoritesComponent, PageNotFoundComponent];