import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
//import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// pour resovoire le lien pour transfaire les donnes au la base de donnes pour eviter le doublont utilisation
import { environment } from '../../environment/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private PostsUpdated = new Subject<{ posts: Post[]; maxPosts: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  GetPosts(PostParPage: number, currentPage: number) {
    const QueryPost = `?pagesize=${PostParPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + QueryPost
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                PathImage: post.PathImage,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((TransformPostsData) => {
        this.posts = TransformPostsData.posts;
        this.PostsUpdated.next({
          posts: [...this.posts],
          maxPosts: TransformPostsData.maxPosts,
        });
      });
    //return [...this.Posts];
  }
  GetPostsUpdatedistenr() {
    return this.PostsUpdated.asObservable();
  }
  //UTILISATION POUR EXCUTION LE BUTTON DE MODIFIER DE POST
  GetPost(Id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      PathImage: string;
      creator: string;
    }>(BACKEND_URL + Id);

    /*{
      ...this.posts.find((p) => p.id == Id),
    };*/
  }

  AddPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    /*const post: Post = {
      id: 'null',
      title: title,
      content: content,
    };*/
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((reponseData) => {
        /*const post: Post = {
          id: reponseData.post.id,
          title: title,
          content: content,
          PathImage: reponseData.post.PathImage,
        };*/
        /*const Id = reponseData.PostId;
        post.id = Id;*/
        /*this.posts.push(post);
        this.PostsUpdated.next([...this.posts]);*/
        //Pour recevoir vers la page a'accuiel page d'afficher le contenu des oposts enregestrer au la base ded donnes
        this.router.navigate(['/']);
      });
  }
  //utilisation la fonction pour excuter le traitment de modification les donnes de cahque post
  UpdatePost(id: string, title: string, content: string, image: any | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id),
        postData.append('title', title),
        postData.append('content', content),
        postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        PathImage: image,
        creator: '',
      };
    }
    this.http.put(BACKEND_URL + id, postData).subscribe((reponse) => {
      /*const OldPost = [...this.posts];
        const OldIndexPost = OldPost.findIndex((p) => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          PathImage: '',
        };
        OldPost[OldIndexPost] = post;
        this.posts = OldPost;
        this.PostsUpdated.next([...this.posts]);
        //Pour recevoir vers la page a'accuiel page d'afficher le contenu des oposts enregestrer au la base ded donnes*/
      this.router.navigate(['/']);
      console.log(reponse);
    });
  }
  //set fonction de traitement de suprimer un post au le backend de mongodb
  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
    /*.subscribe(() => {
        const updateposts = this.posts.filter((post) => post.id !== postId);
        this.posts = updateposts;
        this.PostsUpdated.next([...this.posts]);
      });*/
  }
}
