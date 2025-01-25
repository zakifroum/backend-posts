import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// pour ajouter les link pour remplacer les fourmes pas par pas
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenSubjct: Subscription;
  userAuthService = false;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.userAuthService = this.authService.getAuthService();
    this.authListenSubjct = this.authService
      .getAuthServiceListen()
      .subscribe((isAuthService) => {
        this.userAuthService = isAuthService;
      });
    //console.log(this.userAuthService + '°°°°°°');
  }
  Onloginout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.authListenSubjct.unsubscribe();
  }
}
