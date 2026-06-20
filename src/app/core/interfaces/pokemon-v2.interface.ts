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

export interface PokemonItem {
  id: string;
  name: string;
  imageUrl: string | null;
}
