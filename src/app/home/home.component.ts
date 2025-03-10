import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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
}

