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
    officialArtwork: string;
    front: string | null;
    frontShiny: string | null;
  };
  cryUrl: string | null;
  height: number;
  weight: number;
  baseExperience: number;
  totalStats: number;
  types: string[];
  abilities: { name: string; isHidden: boolean }[];
  stats: { name: string; value: number }[];
}
