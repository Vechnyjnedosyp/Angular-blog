import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit, OnDestroy {

  form: any;
  createSub!: Subscription;

  constructor(
    private postsService: PostsService,
    private alertService: AlertService
    ) {
    this.form = new FormGroup({
      title: new FormControl("", Validators.required),
      text: new FormControl("", Validators.required),
      author: new FormControl("", Validators.required),
    })
   }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      author: this.form.value.author,
      date: new Date()
    }

    this.postsService.create(post).subscribe(() => {
      this.form.reset();
      this.alertService.success('Post was created')
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.createSub) {
      this.createSub.unsubscribe();
    }
  }

}
