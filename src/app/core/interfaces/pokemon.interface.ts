import { DetailResponse } from './pokemon-detail.interface';

export interface PokemonListParams {
  [key: string]: unknown;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export type TypeListResponse = PokemonListResponse;

export type PokemonDetailResponse = DetailResponse;

export interface PokemonTypeResponse {
  pokemon: {
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }[];
}
export interface PokemonItem {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface PokemonDetail {
  id: string;
  name: string;
  imageUrl: string;
  sprites: {
    dream_world: string | null;
    home: string | null;
    official_artwork: string;
    showdown: string | null;
  };
  cryUrl: string | null;
  height: number;
  weight: number;
  baseExperience: number;
  types: string[];
  abilities: PokemonDetailAbility[];
  stats: PokemonDetailStat[];
}

export interface PokemonDetailAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonDetailStat {
  name: string;
  value: number;
}
