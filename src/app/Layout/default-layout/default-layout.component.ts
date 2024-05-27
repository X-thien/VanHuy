import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../Components/header/header.component';
import { AudioComponent } from '../../Components/play/audio/audio.component';
import { SidebarComponent } from '../../Components/sidebar/sidebar.component';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterOutlet,
    AudioComponent,
    HeaderComponent,
    CommonModule,
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
})
export class DefaultLayoutComponent {
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const headerElement = document.querySelector('.top-bar');
    const main = document.querySelector('.main');
    if (main?.scrollTop && main?.scrollTop > 0) {
      headerElement?.classList.add('scrolled');
    } else headerElement?.classList.remove('scrolled');
  }
}
