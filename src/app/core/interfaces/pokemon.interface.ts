// NEW INTERFACE

export interface PokemonListParams {
  offset?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface PokemonList {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonItem {
  name: string;
  imageUrl: string | null;
}

// NEW INTERFACE

// ---- Detail ----
export interface NamedResource {
  name: string;
  url: string;
}

export interface PokemonAbility {
  ability: NamedResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedResource;
}

export interface PokemonType {
  slot: number;
  type: NamedResource;
}

export interface PokemonMove {
  move: NamedResource;
  // version_group_details diabaikan untuk tampilan ringkas
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

// Raw response dari /pokemon/{id}
export interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  types: PokemonType[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
}

// Model yang sudah dirapikan untuk dipakai di UI
export interface PokemonDetail {
  id: number;
  name: string;
  imageUrl: string;
  height: number; // dalam meter
  weight: number; // dalam kg
  baseExperience: number;
  types: string[];
  abilities: { name: string; isHidden: boolean }[];
  stats: { name: string; value: number }[];
  moves: string[];
}

// pokemon.interface.ts
export interface TypePokemonEntry {
  pokemon: PokemonListItem; // { name, url }
  slot: number;
}

export interface TypeResponse {
  pokemon: TypePokemonEntry[];
}
