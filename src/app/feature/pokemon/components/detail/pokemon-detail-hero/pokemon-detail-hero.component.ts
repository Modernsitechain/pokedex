import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { volumeHighOutline } from 'ionicons/icons';
import { PokemonDetail } from '@core/interfaces/pokemon.interface';
import { ChipComponent } from '@src/app/shared/components/chip/chip.component';
import { getTypeColor } from '@core/utils/pokemon-color.constant';

@Component({
  selector: 'app-pokemon-detail-hero',
  templateUrl: './pokemon-detail-hero.component.html',
  styleUrls: ['./pokemon-detail-hero.component.scss'],
  imports: [IonIcon, ChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailHeroComponent {
  public readonly pokemon = input.required<PokemonDetail>();

  public readonly getTypeColor = getTypeColor;
  public readonly selectedImage = signal<string>('');

  public readonly gallery = computed<{ label: string; url: string }[]>(() => {
    const pokemon = this.pokemon();
    const items: { label: string; url: string }[] = [];
    if (pokemon.sprites.official_artwork) {
      items.push({
        label: 'Official Artwork',
        url: pokemon.sprites.official_artwork,
      });
    }
    if (pokemon.sprites.dream_world) {
      items.push({ label: 'Dream World', url: pokemon.sprites.dream_world });
    }
    if (pokemon.sprites.home) {
      items.push({ label: 'Home', url: pokemon.sprites.home });
    }
    if (pokemon.sprites.showdown) {
      items.push({ label: 'Showdown', url: pokemon.sprites.showdown });
    }
    return items;
  });

  public readonly displayImage = computed<string>(
    () => this.selectedImage() || this.pokemon().sprites.official_artwork,
  );

  constructor() {
    addIcons({ volumeHighOutline });
  }

  public selectImage(url: string): void {
    this.selectedImage.set(url);
  }

  public playCry(): void {
    const url = this.pokemon().cryUrl;
    if (!url) return;
    const audio = new Audio(url);
    audio.volume = 0.4;
    void audio.play().catch(() => undefined);
  }
}
