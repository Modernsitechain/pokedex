export interface TypeColor {
  bg: string;
  text: string;
}

const DEFAULT_TYPE_COLOR: TypeColor = { bg: '#9099a1', text: '#fff' };

const POKEMON_TYPE_COLORS: Record<string, TypeColor> = {
  grass: { bg: '#5fbd58', text: '#fff' },
  poison: { bg: '#a95fa9', text: '#fff' },
  fire: { bg: '#f08030', text: '#fff' },
  water: { bg: '#4f90d5', text: '#fff' },
  electric: { bg: '#f4d23c', text: '#333' },
  bug: { bg: '#91c12f', text: '#fff' },
  normal: { bg: '#9099a1', text: '#fff' },
  flying: { bg: '#8fa8dd', text: '#fff' },
  ground: { bg: '#d97746', text: '#fff' },
  psychic: { bg: '#f85888', text: '#fff' },
  rock: { bg: '#c5b78c', text: '#fff' },
  ice: { bg: '#74cec0', text: '#fff' },
  dragon: { bg: '#0b6dc3', text: '#fff' },
  dark: { bg: '#5a5366', text: '#fff' },
  fairy: { bg: '#ec8fe6', text: '#fff' },
  fighting: { bg: '#ce4069', text: '#fff' },
  ghost: { bg: '#5269ad', text: '#fff' },
  steel: { bg: '#5a8ea1', text: '#fff' },
};

export function getTypeColor(type: string): TypeColor {
  return POKEMON_TYPE_COLORS[type] ?? DEFAULT_TYPE_COLOR;
}