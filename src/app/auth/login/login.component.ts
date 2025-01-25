import { Component, OnDestroy, OnInit } from '@angular/core';
//Pourv utilisaqtion lestratement de ngModule comme *ngif ....ngmodule
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponenet implements OnInit, OnDestroy {
  constructor(public authService: AuthService) {}
  IsLoading = false;

  private authStatusSub: Subscription;

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthServiceListen()
      .subscribe((authStatus) => {
        this.IsLoading = false;
      });
  }

  OnLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.IsLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
