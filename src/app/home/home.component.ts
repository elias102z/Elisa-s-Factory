import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GalleryFilterService } from '../gallery-filter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video = this.heroVideo.nativeElement;

    video.playbackRate = 0.5; // Set playback speed (0.5x = half speed)

    video.play().catch(() => {
      console.warn('Autoplay blocked, waiting for user interaction.');
      document.addEventListener('click', () => video.play(), { once: true });
    });
  }
  constructor(
    private filterService: GalleryFilterService,
    private router: Router
  ) {}

  filterGallery(category: string) {
    this.filterService.setCategory(category);
    this.router.navigate(['/gallery']);
  }
}
