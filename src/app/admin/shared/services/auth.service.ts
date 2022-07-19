import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {

  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token(): string | null {
    const currentToken = localStorage.getItem('fb-token-exp');
    if (currentToken) {
      const expDate = new Date(currentToken);
      if (new Date() > expDate) {
        this.logout();
        return null;
      }
      return localStorage.getItem('fb-token');
    }
    return null;
  }

  login(user: User): Observable<any> {
    const newUser = {
      ...user,
      returnSecureToken: true,
    };
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        newUser
      )
      .pipe(
        map((res: any) => {
          this.setToken(res.idToken, res.expiresIn);
          return res;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  handleError(error: HttpErrorResponse) {
    const { message } = error.error.error;

    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email not found');
        break;
      case 'INVALID_EMAIL':
        this.error$.next('Invalid email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Invalid password');
        break;
    }

    return throwError(() => (error));
  }

  private setToken(idToken: string | null, expiresIn?: string) {
    if (idToken) {
      if (expiresIn) {
        const expDate = new Date(new Date().getTime() + +expiresIn * 1000);
        localStorage.setItem('fb-token-exp', expDate.toString());
      } else {
        const expDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('fb-token-exp', expDate.toString());
      }
      localStorage.setItem('fb-token', idToken);
    } else {
      localStorage.clear();
    }
  }
}
