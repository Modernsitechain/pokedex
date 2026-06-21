import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-pokemon-detail-moves',
  templateUrl: './pokemon-detail-moves.component.html',
  styleUrls: ['./pokemon-detail-moves.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailMovesComponent {
  public readonly moves = input.required<string[]>();

  private readonly displayLimit = 30;

  // moves yang ditampilkan (dibatasi agar tidak membanjiri UI)
  public readonly visibleMoves = computed<string[]>(() =>
    this.moves().slice(0, this.displayLimit),
  );
}