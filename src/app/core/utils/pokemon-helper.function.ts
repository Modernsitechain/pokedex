import { environment } from '@src/environments/environment';

export function extractPokemonId(url: string): string | undefined {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? match[1] : undefined;
}

export function getBasePokemonImageUrl(id: string | undefined): string {
  if (!id) return '/base-image.png';
  return `${environment.BASE_URL.SPRITE_IMAGE}/${id}.png`;
}
