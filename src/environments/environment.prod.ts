import { AppEnvironmentEnum } from "@core/enums/app-environment.enum";

export const environment = {
  production: true,
  ENVIRONMENT: AppEnvironmentEnum.PRODUCTION,
  BASE_URL: {
    POKEAPI: 'https://pokeapi.co/api/v2',
    SPRITE_IMAGE: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'
  },
};
