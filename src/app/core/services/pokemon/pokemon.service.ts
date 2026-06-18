import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import {
  PokemonListItem,
  PokemonListParams,
} from '@core/interfaces/pokemon.interface';
import { Observable } from 'rxjs';
import { ListResponse } from '@core/interfaces/response.interface';

interface Pokemon {}
@Injectable({
  providedIn: 'root',
})
export class PokemonService extends BaseService {
  public getPokemons(
    params?: PokemonListParams,
  ): Observable<ListResponse<PokemonListItem>> {
    return this.getApi<ListResponse<PokemonListItem>, PokemonListParams>(
      'pokemon',
      {
        offset: 0,
        limit: 20,
        ...params,
      },
    );
  }
}
