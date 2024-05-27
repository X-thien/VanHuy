import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioComponent } from './Components/play/audio/audio.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { AuthService } from './Service/auth/auth.service';
import { DataService } from './Service/data/data.service';
import { MusicService } from './Service/music/music.service';
import { UserService } from './Service/user/user.service';
import { HomeComponent } from './page/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    SidebarComponent,
    HttpClientModule,
    AudioComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AuthService, MusicService, DataService, UserService],
})
export class AppComponent {
  title = 'web__nhac';

  constructor(private autService: AuthService) {}
}
