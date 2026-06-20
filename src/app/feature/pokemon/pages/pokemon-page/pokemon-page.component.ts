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
  IonSpinner,
  IonSearchbar,
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
    IonSpinner,
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

  protected pokemonTypeEffect = effect(() => {
    const type = this.selectedType();
    void this.handleTypeChange(type);
  });

  public readonly searchValue = signal<string>('');

  constructor() {
    addIcons({ heart, heartOutline, chevronForward });
    this.initialize();
  }

  public filteredPokemons = computed<PokemonItem[]>(() => {
    const hasType = !!this.selectedType();
    const list = hasType
      ? this.selectedTypeResult()
      : this.pokemonService.getPokemons();

    const term = this.searchValue().trim().toLowerCase();
    return term
      ? list.filter((p) => p.name.toLowerCase().includes(term))
      : list;
  });
  public readonly showInfiniteScroll = computed<boolean>(
    () => !this.selectedType(),
  );

  public isFavourite(pokemonId: string): boolean {
    return this.favouriteService.isFavourite(pokemonId);
  }

  public toggleFavourite(pokemon: PokemonItem): void {
    void this.favouriteService.toggleFavourite(pokemon);
  }

  public async onInfinite(event: InfiniteScrollCustomEvent): Promise<void> {
    await this.pokemonService.loadMorePokemon();
    await event.target.complete();
    if (!this.pokemonService.hasMorePokemon()) {
      event.target.disabled = true;
    }
  }

  public onSearch(event: CustomEvent): void {
    this.searchValue.set((event.detail as { value?: string }).value ?? '');
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
