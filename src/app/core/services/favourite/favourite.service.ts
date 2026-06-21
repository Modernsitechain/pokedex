import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { LocalStorageKeyEnum } from '@core/enums/local-storage-key.enum';
import { PokemonItem } from '@core/interfaces/pokemon.interface';

/**
 * Manages the user's favourite Pokémon.
 *
 * Holds the favourites in a signal for reactive reads, and persists every
 * change to local storage so the list survives page reloads. This service
 * is intentionally UI-agnostic, it only manages data. Any user feedback
 * (toasts, confirmation dialogs) belongs in the calling component.
 */
@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  private readonly localStorageService = inject(LocalStorageService);

  /**
   * Reactive list of favourite Pokémon, initialised from local storage.
   * Read it directly (`favourites()`) in templates or computed signals.
   */
  public readonly favourites = signal<PokemonItem[]>(
    this.localStorageService.get<PokemonItem[]>(
      LocalStorageKeyEnum.FAVORITE_POKEMONS,
    ) ?? [],
  );

  /**
   * Checks whether a Pokémon is currently in the favourites list.
   * @param id - the Pokémon id to look up
   * @returns true if the Pokémon is a favourite
   */
  public isFavourite(id: string): boolean {
    return this.favourites().some((item) => item.id === id);
  }

  /**
   * Adds a Pokémon to favourites and persists the change.
   * Does nothing if the Pokémon is already a favourite.
   * @param pokemon - the Pokémon to add
   */
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

  /**
   * Removes a Pokémon from favourites and persists the change.
   * @param pokemon - the Pokémon to remove
   */
  public removeFavourite(pokemon: PokemonItem): void {
    this.favourites.update((current) =>
      current.filter((item) => item.id !== pokemon.id),
    );

    this.localStorageService.set(
      LocalStorageKeyEnum.FAVORITE_POKEMONS,
      this.favourites(),
    );
  }

  /**
   * Clears all favourites and resets the stored list to empty.
   */
  public reset(): void {
    this.favourites.set([]);
    this.localStorageService.set(LocalStorageKeyEnum.FAVORITE_POKEMONS, []);
  }
}