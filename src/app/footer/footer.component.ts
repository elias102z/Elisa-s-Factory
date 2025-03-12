import { Component, HostListener, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const button = this.el.nativeElement.querySelector('.scroll-to-top');
    if (window.scrollY > 300) {
      this.renderer.addClass(button, 'visible');
    } else {
      this.renderer.removeClass(button, 'visible');
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}