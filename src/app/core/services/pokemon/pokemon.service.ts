import { Injectable, computed, inject, signal } from '@angular/core';
import { BaseService } from '../base/base.service';
import {
  PokemonDetail,
  PokemonDetailResponse,
  PokemonItem,
  PokemonList,
  PokemonListParams,
} from '@core/interfaces/pokemon.interface';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { ListResponse } from '@core/interfaces/response.interface';
import {
  extractPokemonId,
  getBasePokemonImageUrl,
} from '@core/utils/pokemon-helper.function';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { LocalStorageKeyEnum } from '@core/enums/local-storage-key.enum';

@Injectable({
  providedIn: 'root',
})
export class PokemonService extends BaseService {
  private readonly storage = inject(LocalStorageService);

  public readonly totalPokemons = signal<number>(0);

  public readonly previousApiUrl = signal<string | null>(null);
  public readonly nextApiUrl = signal<string | null>(null);

  public readonly limit = 10;

  // ---- state list (infinite scroll) ----
  private readonly _items = signal<PokemonItem[]>([]);
  private readonly _offset = signal<number>(0);
  private readonly _total = signal<number>(0);
  private readonly _loading = signal<boolean>(false);

  public readonly items = this._items.asReadonly();
  public readonly total = this._total.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly hasMore = computed(
    () => this._total() === 0 || this._items().length < this._total(),
  );

  // ---- state favorit ----
  private readonly _favorites = signal<PokemonItem[]>(
    this.storage.get<PokemonItem[]>(LocalStorageKeyEnum.FAVORITE_POKEMONS) ??
      [],
  );
  public readonly favorites = this._favorites.asReadonly();
  public readonly favoriteCount = computed(() => this._favorites().length);

  public getPokemons(params?: PokemonListParams): Observable<PokemonItem[]> {
    return this.getApi<PokemonList, PokemonListParams>('/pokemon', {
      ...params,
    }).pipe(
      tap((res) => {
        this.totalPokemons.set(res.count);
        this.previousApiUrl.set(res.previous);
        this.nextApiUrl.set(res.next);
      }),
      map((res) => res.results),
      map((res) =>
        res.map((item) => ({
          name: item.name,
          imageUrl: getBasePokemonImageUrl(extractPokemonId(item.url)),
        })),
      ),
    );
  }

  // ================= LIST =================
  public async loadMore(): Promise<void> {
    if (this._loading() || !this.hasMore()) {
      return;
    }
    this._loading.set(true);
    try {
      const res = await firstValueFrom(
        this.fetchPokemons({ offset: this._offset(), limit: this.limit }),
      );
      this._total.set(res.count);
      this._items.update((prev) => [...prev, ...res.results]);
      this._offset.update((o) => o + this.limit);
    } finally {
      this._loading.set(false);
    }
  }

  public resetList(): void {
    this._items.set([]);
    this._offset.set(0);
    this._total.set(0);
  }

  private fetchPokemons(
    params?: PokemonListParams,
  ): Observable<ListResponse<PokemonItem>> {
    return this.getApi<PokemonList, PokemonListParams>(
      '/pokemon',
      { ...params },
    ).pipe(
      map((res) => ({
        ...res,
        results: res.results.map((item) => ({
          name: item.name,
          imageUrl: getBasePokemonImageUrl(extractPokemonId(item.url)),
        })),
      })),
    );
  }

  // ================= FAVORIT =================
  public isFavorite(name: string): boolean {
    return this._favorites().some((p) => p.name === name);
  }

  public addFavorite(pokemon: PokemonItem): void {
    if (this.isFavorite(pokemon.name!)) {
      return;
    }
    this._favorites.update((list) => [...list, pokemon]);
    this.persistFavorites();
  }

  public removeFavorite(name: string): void {
    this._favorites.update((list) => list.filter((p) => p.name !== name));
    this.persistFavorites();
  }

  public toggleFavorite(pokemon: PokemonItem): void {
    this.isFavorite(pokemon.name!)
      ? this.removeFavorite(pokemon.name!)
      : this.addFavorite(pokemon);
  }

  public clearFavorites(): void {
    this._favorites.set([]);
    this.persistFavorites();
  }

  public getPokemonDetail(idOrName: string): Observable<PokemonDetail> {
    return this.getApi<PokemonDetailResponse, never>(
      `/pokemon/${idOrName}`,
    ).pipe(map((res) => this.mapDetail(res)));
  }

  private mapDetail(res: PokemonDetailResponse): PokemonDetail {
    const artwork = res.sprites.other?.['official-artwork']?.front_default;
    return {
      id: res.id,
      name: res.name,
      imageUrl: artwork ?? res.sprites.front_default ?? '',
      height: res.height / 10, // API: decimeter → meter
      weight: res.weight / 10, // API: hectogram → kg
      baseExperience: res.base_experience,
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

  private persistFavorites(): void {
    this.storage.set(LocalStorageKeyEnum.FAVORITE_POKEMONS, this._favorites());
  }
}
