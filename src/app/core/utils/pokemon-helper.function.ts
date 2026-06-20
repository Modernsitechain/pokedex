import { environment } from '@src/environments/environment';

export function extractPokemonId(url: string): string | undefined {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? match[1] : undefined;
}

export function getBasePokemonImageUrl(id: string | undefined): string | null {
  if (!id) return null;
  return `${environment.BASE_URL.SPRITE_IMAGE}/${id}.png`;
}

export function formatPokemonName(slug: string): string {
  if (!slug) return '';

  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
