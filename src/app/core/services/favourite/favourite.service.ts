import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { LocalStorageKeyEnum } from '@core/enums/local-storage-key.enum';
import { PokemonItem } from '@core/interfaces/pokemon.interface';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  private readonly localStorageService = inject(LocalStorageService);

  public readonly favourites = signal<PokemonItem[]>(
    this.localStorageService.get<PokemonItem[]>(
      LocalStorageKeyEnum.FAVORITE_POKEMONS,
    ) ?? [],
  );

  public isFavourite(id: string): boolean {
    return this.favourites().some((item) => item.id === id);
  }

  public addFavourite(pokemon: PokemonItem): void {
    if (this.isFavourite(pokemon.id)) {
      return;
    }

    this.favourites.update((current) => [...current, pokemon]);

    this.localStorageService.set(
      LocalStorageKeyEnum.FAVORITE_POKEMONS,
      this.favourites(),
    );
  }

  public removeFavourite(pokemon: PokemonItem): void {
    this.favourites.update((current) =>
      current.filter((item) => item.id !== pokemon.id),
    );

    this.localStorageService.set(
      LocalStorageKeyEnum.FAVORITE_POKEMONS,
      this.favourites(),
    );
  }

  public toggleFavourite(pokemon: PokemonItem): void {
    if (this.isFavourite(pokemon.id)) {
      this.removeFavourite(pokemon);
    } else {
      this.addFavourite(pokemon);
    }
  }

  public reset(): void {
    this.favourites.set([]);
    this.localStorageService.set(LocalStorageKeyEnum.FAVORITE_POKEMONS, []);
  }
}
