import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { PokemonDetail } from '@core/interfaces/pokemon.interface';

type Stat = PokemonDetail['stats'][number];

@Component({
  selector: 'app-pokemon-detail-stats',
  templateUrl: './pokemon-detail-stats.component.html',
  styleUrls: ['./pokemon-detail-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailStatsComponent {
  public readonly stats = input.required<Stat[]>();
  public readonly total = input.required<number>();

  private readonly maxStat = 255;

  public statPercent(value: number): number {
    return Math.min(100, (value / this.maxStat) * 100);
  }
}