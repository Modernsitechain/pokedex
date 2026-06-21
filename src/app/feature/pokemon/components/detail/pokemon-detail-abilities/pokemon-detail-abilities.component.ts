import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { PokemonDetail } from '@core/interfaces/pokemon.interface';

type Ability = PokemonDetail['abilities'][number];

@Component({
  selector: 'app-pokemon-detail-abilities',
  templateUrl: './pokemon-detail-abilities.component.html',
  styleUrls: ['./pokemon-detail-abilities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailAbilitiesComponent {
  public readonly abilities = input.required<Ability[]>();
}