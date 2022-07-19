import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Post } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {
  form: any;
  post!: Post;
  submitted = false;
  uSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private alertService: AlertService
  ) { }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    const editedPost = {
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title,
    }

    this.uSub = this.postsService.update(editedPost).subscribe(() => {
      this.submitted = false;
      this.alertService.success('Post was edited')
    })
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap((params: Params) => {
      return this.postsService.getById(params['id']);
    })
    ).subscribe((post: Post) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required),
      })
    })
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
  }

}
