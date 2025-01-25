import {
  Component,
  OnInit,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
} from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RouterOutlet } from '@angular/router';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
//import { PostCreateComponent } from './posts/post-create/post.create.component';
//import { PostListComponent } from './posts/post-list/post.list.component';
//les bibloitiques utilisable pour excutable les traitments de creation les routes au application
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
//import { MatDialogModule } from '@angular/material/dialog';
//import { HTTP_INTERCEPTORS } from '@angular/common/http';
//import { AuthInterceptor } from './auth/auth-interceptor';
//import  { provideHttpClient } from '@angular/common/http';
//import { Post } from './posts/post.model';
//import { PostService } from './posts/post.service';
//pour rentrer les fourms anglaire materiel
//import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    //MatDialogModule,
    /*RouterLink,
    RouterLinkActive,
    PostCreateComponent,
    PostListComponent,*/
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  //pour ajouter intercptor pour resovoir token et verifier a ete enregestrer au la base de donnes
  providers: [],
})
export class AppComponent implements OnInit {
  title = 'Project-GKLMS';
  constructor(private authservice: AuthService) {}
  ngOnInit() {
    this.authservice.autoAuthUser();
  }

  //StoredPosts: Post[] = [];

  /*OnPostCreated(post: Post) {
    this.StoredPosts.push(post);
  }*/
}
