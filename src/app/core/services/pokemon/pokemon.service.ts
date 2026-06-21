import { computed, Injectable, signal } from '@angular/core';
import { BaseService } from '../base/base.service';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import {
  PokemonDetail,
  PokemonDetailResponse,
  PokemonItem,
  PokemonListResponse,
  PokemonTypeResponse,
  TypeListResponse,
} from '@core/interfaces/pokemon.interface';
import {
  extractPokemonId,
  formatPokemonName,
  getBasePokemonImageUrl,
} from '@core/utils/pokemon-helper.function';

@Injectable({
  providedIn: 'root',
})
export class PokemonService extends BaseService {
  private readonly pokemons = signal<PokemonItem[] | undefined>(undefined);

  public readonly isLoading = signal<boolean>(false);
  public readonly errorMessage = signal<string | undefined>(undefined);
  private readonly isFullyLoaded = signal<boolean>(false);

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

  public async loadAllRemaining(): Promise<void> {
    if (this.isFullyLoaded() || this.isLoading()) {
      return;
    }

    const loaded = this.getPokemons().length;
    const total = this.total();

    if (loaded === 0 || loaded >= total) {
      this.isFullyLoaded.set(true);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(undefined);

    try {
      const remaining = total - loaded;
      const response = await firstValueFrom(
        this.fetchPokemons(
          `/pokemon?offset=${loaded}&limit=${remaining}`,
          false,
        ),
      );
      this.pokemons.update((current) => [...(current ?? []), ...response]);
      this.isFullyLoaded.set(true);
    } catch {
      this.errorMessage.set('Failed to load all pokemons');
    } finally {
      this.isLoading.set(false);
    }
  }

  public getPokemonDetail(id: string): Observable<PokemonDetail> {
    return this.getApi<PokemonDetailResponse>(`/pokemon/${id}`).pipe(
      map((res) => this.mapDetail(res)),
    );
  }

  public getTypes(): Observable<string[]> {
    const excluded = ['unknown', 'stellar'];
    return this.getApi<TypeListResponse>('/type').pipe(
      map((res) =>
        res.results
          .map((item) => item.name)
          .filter((name) => !excluded.includes(name)),
      ),
    );
  }

  public getPokemonsByType(type: string): Observable<PokemonItem[]> {
    return this.getApi<PokemonTypeResponse>(`/type/${type}`).pipe(
      map((res) =>
        res.pokemon.map(
          (entry): PokemonItem => ({
            id: extractPokemonId(entry.pokemon.url) || entry.pokemon.name,
            name: formatPokemonName(entry.pokemon.name),
            imageUrl: getBasePokemonImageUrl(
              extractPokemonId(entry.pokemon.url),
            ),
          }),
        ),
      ),
    );
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
          id: extractPokemonId(item.url) || item.name,
          name: formatPokemonName(item.name),
          imageUrl: getBasePokemonImageUrl(extractPokemonId(item.url)),
        })),
      ),
    );
  }

  private mapDetail(res: PokemonDetailResponse): PokemonDetail {
    const sprites = res.sprites;
    const artwork = sprites.other?.['official-artwork']?.front_default;
    return {
      id: String(res.id),
      name: formatPokemonName(res.name),
      imageUrl: artwork ?? sprites.front_default ?? '',
      sprites: {
        officialArtwork: artwork ?? sprites.front_default ?? '',
        front: sprites.front_default,
        frontShiny: sprites.front_shiny,
      },
      cryUrl: res.cries?.latest ?? null,
      height: res.height / 10,
      weight: res.weight / 10,
      baseExperience: res.base_experience,
      totalStats: res.stats.reduce((sum, s) => sum + s.base_stat, 0),
      types: res.types.map((t) => t.type.name),
      abilities: res.abilities.map((a) => ({
        name: a.ability.name,
        isHidden: a.is_hidden,
      })),
      stats: res.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
      moves: res.moves.map((m) => m.move.name),
    };
  }
}
