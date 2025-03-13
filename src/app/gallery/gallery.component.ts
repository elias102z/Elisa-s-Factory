import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryFilterService } from '../gallery-filter.service';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent implements OnInit {
  images = [
    { url: 'landscape1.jpg', tag: 'landscape' },
    { url: 'wedding1.jpg', tag: 'wedding' },
    { url: 'extreme1.jpg', tag: 'extreme' },
    { url: 'portrait1.jpg', tag: 'portrait' },
    { url: 'vacation1.jpg', tag: 'vacation' },
    { url: 'fineart1.jpg', tag: 'fineart' },
    { url: 'poledance1.jpg', tag: 'poledance' },
    { url: 'animal1.jpg', tag: 'animal' },
    { url: 'science1.jpg', tag: 'science' },
    { url: 'landscape2.jpg', tag: 'landscape' },
    { url: 'wedding2.jpg', tag: 'wedding' },
    { url: 'portrait2.jpg', tag: 'portrait' },
    { url: 'vacation2.jpg', tag: 'vacation' },
    { url: 'fineart2.jpg', tag: 'fineart' },
    { url: 'poledance2.jpg', tag: 'poledance' },
    { url: 'animal2.jpg', tag: 'animal' },
    { url: 'extreme2.jpg', tag: 'extreme' },
    { url: 'science2.jpg', tag: 'science' },
    { url: 'landscape3.jpg', tag: 'landscape' },
    { url: 'wedding3.jpg', tag: 'wedding' },
    { url: 'portrait3.jpg', tag: 'portrait' },
    { url: 'vacation3.jpg', tag: 'vacation' },
    { url: 'fineart3.jpg', tag: 'fineart' },
    { url: 'poledance3.jpg', tag: 'poledance' },
    { url: 'animal3.jpg', tag: 'animal' },
    { url: 'extreme3.jpg', tag: 'extreme' },
    { url: 'science3.jpg', tag: 'science' },
  ];

  // filteredImages = this.images;
  selectedCategory = 'all';

  filteredImages: any[] = [...this.images];

  showAllImages() {
    this.filteredImages = [...this.images];
  }

  constructor(private filterService: GalleryFilterService) {}

  ngOnInit() {
    this.filterService.selectedCategory.subscribe((category) => {
      this.selectedCategory = category;
      this.filterImages();
    });
  }

  filterImages() {
    this.filteredImages =
      this.selectedCategory === 'all'
        ? this.images
        : this.images.filter((img) => img.tag === this.selectedCategory);
  }
}
