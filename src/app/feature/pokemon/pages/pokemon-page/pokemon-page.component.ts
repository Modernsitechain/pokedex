import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { PokemonService } from '@core/services/pokemon/pokemon.service';
import { PokemonItem } from '@core/interfaces/pokemon.interface';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonIcon,
  IonButton,
  IonSearchbar,
  IonSpinner,
  IonButtons,
  IonPopover,
} from '@ionic/angular/standalone';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronForward,
  heart,
  heartOutline,
  filter as filterIcon,
} from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonSpinner,
    RouterLink,
    IonButtons, IonPopover,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonPageComponent {
  public readonly pokemonService = inject(PokemonService);

  public readonly types = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ];

  private readonly searchTerm = signal<string>('');
  private readonly selectedType = signal<string>('');
  private readonly typeResults = signal<PokemonItem[]>([]);
  public readonly typeLoading = signal<boolean>(false);

  // sumber data: hasil type saat filter aktif, else infinite-scroll list
  private readonly source = computed<PokemonItem[]>(() =>
    this.selectedType() ? this.typeResults() : this.pokemonService.items(),
  );

  // search by name diterapkan di atas sumber data
  public readonly visiblePokemons = computed<PokemonItem[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.source();
    return term
      ? list.filter((p) => p.name.toLowerCase().includes(term))
      : list;
  });

  // infinite scroll hanya saat tidak memfilter type
  public readonly showInfiniteScroll = computed<boolean>(
    () => !this.selectedType(),
  );

  constructor() {
    addIcons({ heart, heartOutline, chevronForward, filter: filterIcon });
    if (this.pokemonService.items().length === 0) {
      this.pokemonService.loadMore();
    }
  }

  public onSearch(event: CustomEvent): void {
    this.searchTerm.set((event.detail as { value?: string }).value ?? '');
  }

  public async onTypeChange(event: CustomEvent): Promise<void> {
    const type = (event.detail as { value?: string }).value ?? '';
    this.selectedType.set(type);

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

  public async onInfinite(event: InfiniteScrollCustomEvent): Promise<void> {
    await this.pokemonService.loadMore();
    await event.target.complete();
    if (!this.pokemonService.hasMore()) {
      event.target.disabled = true;
    }
  }

  public async selectType(type: string): Promise<void> {
    this.selectedType.set(type);

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
