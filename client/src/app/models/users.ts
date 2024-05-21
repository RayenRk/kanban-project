export interface User {
  _id?: string; // Optional if you are using MongoDB ObjectID
  username: string;
  password: string;
  email?: string; // Optional email property
  createdAt?: Date; // Optional createdAt property
  role?: string; 
  isAuthenticated?: boolean; 
  token?: string; // Optional token property
}
