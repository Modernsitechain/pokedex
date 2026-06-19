import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import {
  PokemonItem,
  PokemonListItem,
  PokemonListParams,
} from '@core/interfaces/pokemon.interface';
import { map, Observable } from 'rxjs';
import { ListResponse } from '@core/interfaces/response.interface';
import {
  extractPokemonId,
  getBasePokemonImageUrl,
} from '@core/utils/pokemon-helper.function';

interface Pokemon {}
@Injectable({
  providedIn: 'root',
})
export class PokemonService extends BaseService {
  public getPokemons(
    params?: PokemonListParams,
  ): Observable<ListResponse<PokemonItem>> {
    return this.getApi<ListResponse<PokemonListItem>, PokemonListParams>(
      '/pokemon',
      {
        ...params,
      },
    ).pipe(
      map((res) => ({
        ...res,
        results: res.results.map((item) => ({
          id: extractPokemonId(item.url),
          name: item.name,
          imageUrl: getBasePokemonImageUrl(extractPokemonId(item.url)),
        })),
      })),
    );
  }
}
