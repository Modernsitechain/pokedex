import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonSkeletonText,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { PokemonItemComponent } from '@feature/pokemon/components/pokemon-item/pokemon-item.component';
import { PokemonFilterButtonComponent } from '@feature/pokemon/components/pokemon-filter-button/pokemon-filter-button.component';
import { FavouriteService } from '@core/services/favourite/favourite.service';
import { PokemonService } from '@core/services/pokemon/pokemon.service';
import { PokemonItem } from '@core/interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-page',
  templateUrl: './pokemon-page.component.html',
  styleUrls: ['./pokemon-page.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonSkeletonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSearchbar,
    PokemonItemComponent,
    PokemonFilterButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonPageComponent {
  private readonly pokemonService = inject(PokemonService);
  private readonly favouriteService = inject(FavouriteService);

  public readonly selectedType = signal<string>('');
  public readonly selectedTypeLoading = signal<boolean>(false);
  private readonly selectedTypeResult = signal<PokemonItem[]>([]);

  public readonly searchValue = signal<string>('');

  // dummy array untuk merender baris skeleton
  public readonly skeletonRows = Array.from({ length: 8 });

  protected pokemonTypeEffect = effect(() => {
    const type = this.selectedType();
    void this.handleTypeChange(type);
  });

  public readonly filteredPokemons = computed<PokemonItem[]>(() => {
    const hasType = !!this.selectedType();
    const list = hasType
      ? this.selectedTypeResult()
      : this.pokemonService.getPokemons();

    const term = this.searchValue().trim().toLowerCase();
    return term
      ? list.filter((item) => item.name.toLowerCase().includes(term))
      : list;
  });

  // skeleton saat load awal / filter type, dan belum ada data tampil
  public readonly showSkeleton = computed<boolean>(() => {
    if (this.selectedTypeLoading()) {
      return true;
    }
    return (
      this.pokemonService.isLoading() && this.filteredPokemons().length === 0
    );
  });

  // infinite scroll hanya saat browsing biasa (bukan filter type, bukan sedang search)
  public readonly showInfiniteScroll = computed<boolean>(
    () => !this.selectedType() && !this.searchValue().trim(),
  );

  constructor() {
    this.initialize();
  }

  public isFavourite(pokemonId: string): boolean {
    return this.favouriteService.isFavourite(pokemonId);
  }

  public toggleFavourite(pokemon: PokemonItem): void {
    void this.favouriteService.toggleFavourite(pokemon);
  }

  public onSearch(event: CustomEvent): void {
    const term = (event.detail as { value?: string }).value ?? '';
    this.searchValue.set(term);

    // saat user mulai search, pastikan seluruh data ter-load (sekali saja)
    if (term.trim()) {
      void this.pokemonService.loadAllRemaining();
    }
  }

  public async onInfinite(event: InfiniteScrollCustomEvent): Promise<void> {
    await this.pokemonService.loadMorePokemon();
    await event.target.complete();
    if (!this.pokemonService.hasMorePokemon()) {
      event.target.disabled = true;
    }
  }

  private async initialize(): Promise<void> {
    await this.pokemonService.loadPokemon();
  }

  private async handleTypeChange(type: string): Promise<void> {
    if (!type) {
      this.selectedTypeResult.set([]);
      return;
    }
    this.selectedTypeLoading.set(true);
    try {
      const data = await firstValueFrom(
        this.pokemonService.getPokemonsByType(type),
      );
      this.selectedTypeResult.set(data);
    } catch {
      this.selectedTypeResult.set([]);
    } finally {
      this.selectedTypeLoading.set(false);
    }
  }
}