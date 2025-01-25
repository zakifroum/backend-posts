import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-list-component',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  templateUrl: './post.list.component.html',
  styleUrls: ['./post.list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  /*posts = [
    {
      title: 'Premier Article',
      content: 'le premeir article pour presenter le type de contret',
    },
    {
      title: 'Dexieme Article',
      content: 'le dexieme article pour presenter la loi de employer',
    },
    {
      title: 'Troisiem Article',
      content:
        'le Troisiem article pour presenter le salaire et les horaire de travaille',
    },
  ];*/
  // input c'est un mehode d'enregetrer les donnes au cas stoker ver la mehode output
  posts: Post[] = [];
  IsLoading = false;
  TotalPost = 0;
  NbrPostPrPage = 2;
  curentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  IsAuthValidService = false;
  //pour objet de stoket ID utilisateur de connecter pour donnes les droit des
  userId: string;
  private _PostsSub: Subscription;
  private IsAuthService: Subscription;

  constructor(
    public _postservice: PostService,
    private authservice: AuthService
  ) {}
  ngOnInit() {
    this.IsLoading = true;
    this._postservice.GetPosts(this.NbrPostPrPage, this.curentPage);
    // resouvoir ID DE recuperation d'utilisateur connecter reels
    this.userId = this.authservice.getUserId();
    this._PostsSub = this._postservice
      .GetPostsUpdatedistenr()
      .subscribe((postData: { posts: Post[]; maxPosts: number }) => {
        this.IsLoading = false;
        this.TotalPost = postData.maxPosts;
        this.posts = postData.posts;
      });
    this.IsAuthValidService = this.authservice.getAuthService();
    this.IsAuthService = this.authservice
      .getAuthServiceListen()
      .subscribe((isAuthService) => {
        this.IsAuthValidService = isAuthService;
        // resouvoir ID DE recuperation d'utilisateur connecter reels
        this.userId = this.authservice.getUserId();
      });
  }

  OnChangePage(postData: PageEvent) {
    this.curentPage = postData.pageIndex + 1;
    this.NbrPostPrPage = postData.pageSize;
    this._postservice.GetPosts(this.NbrPostPrPage, this.curentPage);
  }

  OnDeletePost(PostId: string) {
    this.IsLoading = true;
    this._postservice.deletePost(PostId).subscribe(
      () => {
        this._postservice.GetPosts(this.NbrPostPrPage, this.curentPage);
      },
      () => {
        this.IsLoading = false;
      }
    );
  }
  ngOnDestroy() {
    this._PostsSub.unsubscribe();
    this.IsAuthService.unsubscribe();
  }
}
