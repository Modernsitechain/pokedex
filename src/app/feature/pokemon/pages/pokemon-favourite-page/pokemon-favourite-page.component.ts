import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pokemon-favourite-page',
  templateUrl: './pokemon-favourite-page.component.html',
  styleUrls: ['./pokemon-favourite-page.component.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonFavouritePageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
