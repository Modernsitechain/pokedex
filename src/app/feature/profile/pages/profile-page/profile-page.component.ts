import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logoGithub,
  logoLinkedin,
  logoInstagram,
  mailOutline,
  globeOutline,
  logoAngular,
  videocamOutline,
  codeSlashOutline,
} from 'ionicons/icons';

interface ContactLink {
  label: string;
  value: string;
  icon: string;
  url: string;
}

interface TechItem {
  label: string;
  version: string;
}

interface ProjectLink {
  label: string;
  description: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  public readonly name = 'Axel Eldrian Hadiwibowo';
  public readonly role = 'Angular Frontend Developer';
  public readonly bio =
    'A Pokédex app built with Ionic & Angular, powered by PokeAPI.';
  public readonly avatarUrl = 'assets/axel.jpg';

  public readonly techStack: TechItem[] = [
    { label: 'Angular', version: '20' },
    { label: 'Ionic', version: '8' },
    { label: 'Capacitor', version: '8' },
  ];

  public readonly projectLinks: ProjectLink[] = [
    {
      label: 'Source code',
      description: 'View on GitHub',
      icon: 'code-slash-outline',
      url: 'https://github.com/Modernsitechain/pokedex',
    },
    {
      label: 'Demo video',
      description: 'Watch how to use the app',
      icon: 'videocam-outline',
      url: 'https://drive.google.com/drive/folders/1zjSnVZhCmCgL9zMJ9uuantSEY2YyD452?usp=sharing',
    },
  ];

  public readonly contacts: ContactLink[] = [
    {
      label: 'GitHub',
      value: '@modernsitechain',
      icon: 'logo-github',
      url: 'https://github.com/Modernsitechain',
    },
    {
      label: 'LinkedIn',
      value: 'Axel Hadiwibowo',
      icon: 'logo-linkedin',
      url: 'https://www.linkedin.com/in/axeleldrian/',
    },
    {
      label: 'Email',
      value: 'eldrianaxel1@gmail.com',
      icon: 'mail-outline',
      url: 'https://mail.google.com/mail/?view=cm&fs=1&to=eldrianaxel1@gmail.com',
    },
  ];

  constructor() {
    addIcons({
      logoGithub,
      logoLinkedin,
      logoInstagram,
      mailOutline,
      globeOutline,
      logoAngular,
      videocamOutline,
      codeSlashOutline,
    });
  }
}