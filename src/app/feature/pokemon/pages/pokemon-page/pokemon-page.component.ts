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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonIcon,
  IonButton,
  IonSearchbar,
  IonSpinner,
} from '@ionic/angular/standalone';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronForward, heart, heartOutline } from 'ionicons/icons';
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonSpinner,
    PokemonItemComponent,
    PokemonFilterButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonPageComponent {
  private readonly pokemonService = inject(PokemonService);
  private readonly favouriteService = inject(FavouriteService);

  public readonly filterType = signal<string>('');

  private readonly searchTerm = signal<string>('');
  private readonly typeResults = signal<PokemonItem[]>([]);
  public readonly typeLoading = signal<boolean>(false);

  private readonly source = computed<PokemonItem[]>(() =>
    this.filterType() ? this.typeResults() : this.pokemonService.getPokemons(),
  );

  public readonly visiblePokemons = computed<PokemonItem[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.source();
    return term
      ? list.filter((p) => p.name.toLowerCase().includes(term))
      : list;
  });

  public readonly showInfiniteScroll = computed<boolean>(
    () => !this.filterType(),
  );

  constructor() {
    addIcons({ heart, heartOutline, chevronForward });

    this.initialize();

    effect(() => {
      const type = this.filterType();
      void this.handleTypeChange(type);
    });
  }

  protected isFavourite(pokemonId: string): boolean {
    return this.favouriteService.isFavourite(pokemonId);
  }

  protected toggleFavourite(pokemon: PokemonItem): void {
    void this.favouriteService.toggleFavourite(pokemon);
  }

  private async initialize(): Promise<void> {
    await this.pokemonService.loadPokemon();
  }

  public onSearch(event: CustomEvent): void {
    this.searchTerm.set((event.detail as { value?: string }).value ?? '');
  }

  public async onInfinite(event: InfiniteScrollCustomEvent): Promise<void> {
    await this.pokemonService.loadMorePokemon();
    await event.target.complete();
    if (!this.pokemonService.hasMorePokemon()) {
      event.target.disabled = true;
    }
  }

  private async handleTypeChange(type: string): Promise<void> {
    if (!type) {
      this.typeResults.set([]);
      return;
    }
    this.typeLoading.set(true);
    try {
      const data = await firstValueFrom(
        this.pokemonService.getPokemonsByType(type),
      );
      this.typeResults.set(data);
    } catch {
      this.typeResults.set([]);
    } finally {
      this.typeLoading.set(false);
    }
  }
}