import { Routes } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post.create.component';
import { PostListComponent } from './posts/post-list/post.list.component';
import { LoginComponenet } from './auth/login/login.component';
import { SignupComponenet } from './auth/signup/signup.component';
import { AuthGard } from './auth/auth-guard';

export const routes: Routes = [
  { path: '', component: PostListComponent },
  {
    path: 'create',
    component: PostCreateComponent,
    canActivate: [AuthGard],
    providers: [AuthGard],
  },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [AuthGard],
    providers: [AuthGard],
  },
  { path: 'login', component: LoginComponenet },
  { path: 'signup', component: SignupComponenet },
];
