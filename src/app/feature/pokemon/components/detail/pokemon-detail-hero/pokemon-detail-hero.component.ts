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

  // expose helper warna ke template
  public readonly getTypeColor = getTypeColor;

  // gambar yang sedang dipilih di galeri
  public readonly selectedImage = signal<string>('');

  // daftar thumbnail galeri yang tersedia
  public readonly gallery = computed<{ label: string; url: string }[]>(() => {
    const p = this.pokemon();
    const items: { label: string; url: string }[] = [];
    if (p.sprites.officialArtwork) {
      items.push({ label: 'Artwork', url: p.sprites.officialArtwork });
    }
    if (p.sprites.front) {
      items.push({ label: 'Normal', url: p.sprites.front });
    }
    if (p.sprites.frontShiny) {
      items.push({ label: 'Shiny', url: p.sprites.frontShiny });
    }
    return items;
  });

  // gambar yang ditampilkan besar: pilihan user, atau default gambar utama
  public readonly displayImage = computed<string>(
    () => this.selectedImage() || this.pokemon().imageUrl,
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