export interface User {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface FbAuthResponse {
  idToken: string;
  expiresIn?: string;
  displayName: string;
  email: string;
  kind: string;
  localId: string;
  registered: boolean;
}

export interface Post {
  id?: string;
  title: string;
  text: string;
  author: string;
  date: Date;
}

export interface FbCreateResponse {
  name: string;
}
