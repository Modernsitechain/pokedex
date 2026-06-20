import { computed, inject, Injectable, signal } from '@angular/core';
import { BaseService } from '../base/base.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import {
  PokemonItem,
  PokemonListParams,
  PokemonListResponse,
} from '@core/interfaces/pokemon-v2.interface';
import {
  extractPokemonId,
  getBasePokemonImageUrl,
} from '@core/utils/pokemon-helper.function';

@Injectable({
  providedIn: 'root',
})
export class PokemonV2Service extends BaseService {
  private readonly localStorageService = inject(LocalStorageService);

  private readonly pokemons = signal<PokemonItem[] | undefined>(undefined);

  public readonly isLoading = signal<boolean>(false);
  public readonly errorMessage = signal<string | undefined>(undefined);

  public readonly total = signal<number>(0);
  public readonly previousUrl = signal<string | null>(null);
  public readonly nextUrl = signal<string | null>(null);

  public readonly getPokemons = computed<PokemonItem[]>(() => {
    const data = this.pokemons();

    if (!data) return [];

    return data;
  });

  public readonly hasMorePokemon = computed<boolean>(() => {
    const hasStoredPokemon = this.getPokemons().length > 0;

    if (hasStoredPokemon && this.nextUrl()) return true;

    return false;
  });

  public async loadPokemon(): Promise<void> {
    const hasStoredPokemon = this.getPokemons().length > 0;

    if (hasStoredPokemon || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(undefined);

    try {
      const response = await firstValueFrom(
        this.fetchPokemons('/pokemon', false),
      );

      this.pokemons.set(response);
    } catch (error) {
      this.errorMessage.set('Failed to load pokemons');
    } finally {
      this.isLoading.set(false);
    }
  }

  public async loadMorePokemon(): Promise<void> {
    const hasStoredPokemon = this.getPokemons().length > 0;
    const nextUrl = this.nextUrl();

    if (!hasStoredPokemon || !nextUrl) {
      await this.loadPokemon();
      return;
    }

    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(undefined);

    try {
      const response = await firstValueFrom(this.fetchPokemons(nextUrl, true));

      this.pokemons.update((current) => [...(current || []), ...response]);
    } catch (error) {
      this.errorMessage.set('Failed to load more pokemons');
    } finally {
      this.isLoading.set(false);
    }
  }

  public reset(): void {
    this.pokemons.set(undefined);

    this.isLoading.set(false);
    this.errorMessage.set(undefined);

    this.total.set(0);
    this.previousUrl.set(null);
    this.nextUrl.set(null);
  }

  private fetchPokemons(
    url: string,
    isAbsoluteUrl: boolean,
  ): Observable<PokemonItem[]> {
    return this.getApi<PokemonListResponse>(url, undefined, {
      absoluteUrl: isAbsoluteUrl,
    }).pipe(
      tap((res) => {
        this.total.set(res.count);
        this.previousUrl.set(res.previous);
        this.nextUrl.set(res.next);
      }),
      map((res) => res.results),
      map((res) =>
        res.map((item) => ({
          id: item.name,
          name: item.name,
          imageUrl: getBasePokemonImageUrl(extractPokemonId(item.url)),
        })),
      ),
    );
  }
}
