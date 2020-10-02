import { TestBed } from '@angular/core/testing';
import { GeoapiService } from '../geo-service/geoapi.service';

describe('GeoapiService', () => {
  let service: GeoapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
