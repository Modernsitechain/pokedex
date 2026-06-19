import { Routes } from '@angular/router';
import { PokemonPageComponent } from './pages/pokemon-page/pokemon-page.component';
import { PokemonFavouritePageComponent } from './pages/pokemon-favourite-page/pokemon-favourite-page.component';

export const POKEMON_ROUTES: Routes = [
  {
    path: 'list',
    component: PokemonPageComponent,
  },
  {
    path: 'favourite',
    component: PokemonFavouritePageComponent,
  },
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', redirectTo: '' },
];
