import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  resizeOutline,
  scaleOutline,
  flashOutline,
} from 'ionicons/icons';
import { PokemonDetail } from '@core/interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-detail-info',
  templateUrl: './pokemon-detail-info.component.html',
  styleUrls: ['./pokemon-detail-info.component.scss'],
  imports: [IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailInfoComponent {
  public readonly pokemon = input.required<PokemonDetail>();

  constructor() {
    addIcons({ resizeOutline, scaleOutline, flashOutline });
  }
}