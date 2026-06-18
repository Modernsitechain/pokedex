export interface PokemonListParams {
  offset?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface PokemonListItem {
  name: string;
  url: string;
}
