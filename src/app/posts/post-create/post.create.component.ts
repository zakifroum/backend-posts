import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  /*FormsModule NgForm,*/ FormGroup,
  ReactiveFormsModule,
  RequiredValidator,
  Validators,
} from '@angular/forms';
//pour rentrer les fourms anglaire materiel
import { PostService } from '../post.service';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//Pour resouvoir les donnes de creation route
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimetype } from './mime-type-validation';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
//import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    CommonModule,
    /*FormsModule,*/
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './post.create.component.html',
  styleUrls: ['./post.create.component.css'],
})

// EventEmitter c'est un metohode pour placer les donnes pour transfaire vers un autre emplacement
//Output c'est un mehode qui me donner la posibilite de transfaire les donnes vers un autre emplacement c'est un exemple de transport les donnes : converture vert un event
export class PostCreateComponent implements OnInit, OnDestroy {
  //@Output() postCreated = new EventEmitter<Post>();
  private mode = 'create';
  private PostId: string;
  //creation une subcrition pour ajouter l'inscription de valider le compte de persoone ajooter les posts dans la page d'accuill
  private AuthStatusSub: Subscription;
  post: Post;
  IsLoading = false;
  form: FormGroup;
  ImagePreviw: string;

  constructor(
    public postservice: PostService,
    public route: ActivatedRoute,
    private authservice: AuthService
  ) {}

  ngOnInit() {
    this.AuthStatusSub = this.authservice
      .getAuthServiceListen()
      .subscribe((authService) => {
        this.IsLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimetype],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'Edit';
        this.PostId = paramMap.get('postId') || '';
        //emplacement de debut le spinner laoding
        this.IsLoading = true;
        this.postservice.GetPost(this.PostId).subscribe((postData) => {
          //eMPLACEMENT D'ARRETER LE SPINNER loading
          this.IsLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            PathImage: postData.PathImage,
            creator: postData.creator,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.PathImage,
          });
        });
      } else {
        this.mode = 'create';
        this.PostId = 'null';
      }
    });
  }

  onAddPost(/*form: NgForm*/) {
    if (this.form.invalid) {
      return;
    }
    //emplacement de debut le spinner laoding
    this.IsLoading = true;
    if (this.mode == 'create') {
      this.postservice.AddPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postservice.UpdatePost(
        this.PostId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    /* const post: Post = {
      title: form.value.title,
      content: form.value.content,
    };*/
    //this.postCreated.emit(post);

    //pour vider les case au cas enregistere les donnes
    /*form.resetForm();*/
    this.form.reset();
  }
  //Set fornction pour upload des images de cghaque post ou change imaqge
  OnUploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.ImagePreviw = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  //pour desabondoner d'inscription de validation de compte personnele pour ajouter les posts
  ngOnDestroy() {
    this.AuthStatusSub.unsubscribe();
  }
}
