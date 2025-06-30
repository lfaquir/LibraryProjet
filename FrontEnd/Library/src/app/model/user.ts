export interface User {
    id : number;
    userName: string;
    role: string;
    userEmail: string;
    passwordHash?: string;
    imageFileName?: string;
  }