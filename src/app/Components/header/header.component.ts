import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { AuthService } from '../../Service/auth/auth.service';
import { SearchService } from '../../Service/search/search.service';
import { User } from '../../Service/user/user.i';
import { UserService } from '../../Service/user/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  data!: User;
  accessToken: string;
  searchValue = '';
  name$!: Observable<string>;
  token: string | null = null;
  isDisplaySearch: boolean = false;
  showButtonLogOut: boolean = false;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private searchService: SearchService,
    private location: Location,
  ) {
    this.accessToken = '';
    this.name$ = this.authService.userName$.pipe(
      map((oldName) => `test ${oldName}`),
    );
  }

  exchangeCodeSub!: Subscription;
  handleClick() {
    this.showButtonLogOut = !this.showButtonLogOut;
  }

  onInputChange() {
    this.searchService.setInputValue(this.searchValue);
  }
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.searchService.getSearchBehaviorSubject().subscribe((data) => {
        if (data) {
          this.isDisplaySearch = true;
        } else {
          this.isDisplaySearch = false;
        }
      });
      this.authService.getUserinfo().subscribe({
        next: (dataUser: User) => {
          this.userService.setData(dataUser);
        },
        error: (err) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            this.authService.login();
          }
        },
      });
    }
    this.userService.getData().subscribe((dataUser: User) => {
      this.data = dataUser;
    });
    this.token = localStorage.getItem('token');
  }

  login() {
    this.authService.login();
  }
  logout() {
    localStorage.removeItem('trackCurrent');
    this.authService.logout();
  }

  goBack(): void {
    this.location.back();
  }

  goForward(): void {
    this.location.forward();
  }
}
