import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GalleryFilterService {
  private categorySource = new BehaviorSubject<string>('all');
  selectedCategory = this.categorySource.asObservable();

  setCategory(category: string) {
    this.categorySource.next(category);
  }
}
