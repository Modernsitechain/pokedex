import { TestBed } from '@angular/core/testing';

import { PokemonV2Service } from './pokemon-v2.service';

describe('PokemonV2Service', () => {
  let service: PokemonV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
