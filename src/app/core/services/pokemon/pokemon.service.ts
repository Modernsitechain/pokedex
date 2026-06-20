import { Injectable, computed, inject, signal } from '@angular/core';
import { BaseService } from '../base/base.service';
import {
  PokemonDetail,
  PokemonDetailResponse,
  PokemonItem,
  PokemonList,
  TypeResponse,
} from '@core/interfaces/pokemon.interface';
import { firstValueFrom, map, Observable } from 'rxjs';
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

  public readonly limit = 10;
  private readonly initialUrl = `/pokemon?offset=0&limit=${this.limit}`;

  // ---- state list (infinite scroll) ----
  private readonly _items = signal<PokemonItem[]>([]);
  private readonly _nextUrl = signal<string | null>(this.initialUrl);
  private readonly _total = signal<number>(0);
  private readonly _loading = signal<boolean>(false);
  private _isFirstLoad = true;

  public readonly items = this._items.asReadonly();
  public readonly total = this._total.asReadonly();
  public readonly loading = this._loading.asReadonly();
  // habis ketika API tidak memberi `next` lagi
  public readonly hasMore = computed(() => this._nextUrl() !== null);

  // ---- state favorit ----
  private readonly _favorites = signal<PokemonItem[]>(
    this.storage.get<PokemonItem[]>(LocalStorageKeyEnum.FAVORITE_POKEMONS) ??
      [],
  );
  public readonly favorites = this._favorites.asReadonly();
  public readonly favoriteCount = computed(() => this._favorites().length);

  // ================= LIST =================
  public async loadMore(): Promise<void> {
    const url = this._nextUrl();
    if (this._loading() || !url) {
      return;
    }
    this._loading.set(true);
    try {
      const res: PokemonList = await firstValueFrom(
        this.getApi<PokemonList>(url, undefined, {
          absoluteUrl: !this._isFirstLoad,
        }),
      );
      this._isFirstLoad = false;
      this._total.set(res.count);
      this._nextUrl.set(res.next);
      this._items.update((prev) => [
        ...prev,
        ...res.results.map(
          (item): PokemonItem => ({
            name: item.name,
            imageUrl: getBasePokemonImageUrl(extractPokemonId(item.url)),
          }),
        ),
      ]);
    } finally {
      this._loading.set(false);
    }
  }

  public resetList(): void {
    this._items.set([]);
    this._nextUrl.set(this.initialUrl);
    this._total.set(0);
    this._isFirstLoad = true;
  }

  // ================= FAVORIT =================
  public isFavorite(name: string): boolean {
    return this._favorites().some((p) => p.name === name);
  }

  public addFavorite(pokemon: PokemonItem): void {
    if (this.isFavorite(pokemon.name)) {
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
    if (this.isFavorite(pokemon.name)) {
      this.removeFavorite(pokemon.name);
    } else {
      this.addFavorite(pokemon);
    }
  }

  public clearFavorites(): void {
    this._favorites.set([]);
    this.persistFavorites();
  }

  // ================= DETAIL =================
  public getPokemonDetail(idOrName: string): Observable<PokemonDetail> {
    return this.getApi<PokemonDetailResponse>(`/pokemon/${idOrName}`).pipe(
      map((res) => this.mapDetail(res)),
    );
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

  // ================= TYPE =================
  public getPokemonsByType(type: string): Observable<PokemonItem[]> {
    return this.getApi<TypeResponse>(`/type/${type}`).pipe(
      map((res) =>
        res.pokemon.map(
          (entry): PokemonItem => ({
            name: entry.pokemon.name,
            imageUrl: getBasePokemonImageUrl(extractPokemonId(entry.pokemon.url)),
          }),
        ),
      ),
    );
  }

  private persistFavorites(): void {
    this.storage.set(LocalStorageKeyEnum.FAVORITE_POKEMONS, this._favorites());
  }
}