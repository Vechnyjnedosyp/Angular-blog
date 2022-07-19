import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FbCreateResponse, Post } from './interfaces';

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient) {}

  create(post: Post): Observable<Post> {
    return this.http
      .post<FbCreateResponse>(`${environment.fbDatabaseUrl}/posts.json`, post)
      .pipe(
        map((response: FbCreateResponse) => {
          const newPost: Post = {
            ...post,
            id: response.name,
            date: new Date(post.date),
          };
          return newPost;
        })
      );
  }

  getAll(): Observable<Post[]> {
    return this.http.get(`${environment.fbDatabaseUrl}/posts.json`).pipe(
      map((response: { [key: string]: any }) => {
        return Object.keys(response).map((key) => ({
          ...response[key],
          id: key,
          date: new Date(response[key].date),
        }));
      })
    );
  }

  getById(id: string): Observable<Post> {
    return this.http
      .get<Post>(`${environment.fbDatabaseUrl}/posts/${id}.json`)
      .pipe(
        map((post: Post) => {
          return {
            ...post,
            id,
            date: new Date(post.date),
          };
        })
      );
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(
      `${environment.fbDatabaseUrl}/posts/${post.id}.json`,
      post
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.fbDatabaseUrl}/posts/${id}.json`
    );
  }
}
