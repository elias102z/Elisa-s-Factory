import { TestBed } from '@angular/core/testing';

import { GalleryFilterService } from './gallery-filter.service';

describe('GalleryFilterService', () => {
  let service: GalleryFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalleryFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
