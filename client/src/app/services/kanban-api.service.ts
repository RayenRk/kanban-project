import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private apiUrl = 'http://localhost:5000/';
  private authToken: string | null = null;
  private username: string | null = null;
  private jwtHelper: JwtHelperService = new JwtHelperService();
  loginStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token && !this.jwtHelper.isTokenExpired(token);
    }
    return false; // Default to false if localStorage is not defined
  }

  getUsername(): string | null {
    return this.username;
  }

  setToken(token: string | null): void {
    this.authToken = token;
    if (token) {
      localStorage.setItem('token', token);
      this.username = this.jwtHelper.decodeToken(token)?.username || null;
    } else {
      localStorage.removeItem('token');
      this.username = null;
    }
    // Emit login status change
    this.loginStatus.next(this.isLoggedIn());
  }

  clearToken(): void {
    this.authToken = null;
    localStorage.removeItem('token');
    this.username = null;
    // Emit login status change
    this.loginStatus.next(this.isLoggedIn());
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/auth/login`, credentials).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/auth/register`, userData).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/auth/logout`, {}).pipe(
      catchError((error) => {
        console.error('Logout error:', error);
        return throwError(error);
      })
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}users`).pipe(
      catchError((error) => {
        console.error('Get all users error:', error);
        return throwError(error);
      })
    );
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}users/${id}`).pipe(
      catchError((error) => {
        console.error('Get user by ID error:', error);
        return throwError(error);
      })
    );
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}users`, user).pipe(
      catchError((error) => {
        console.error('Create user error:', error);
        return throwError(error);
      })
    );
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}users/${id}`, user).pipe(
      catchError((error) => {
        console.error('Update user error:', error);
        return throwError(error);
      })
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}users/${id}`).pipe(
      catchError((error) => {
        console.error('Delete user error:', error);
        return throwError(error);
      })
    );
  }

  getAllProjects(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}projectRouter/allprojects`, { headers }).pipe(
      catchError(error => {
        console.error('Get all projects error:', error);
        return throwError(error);
      })
    );
  }
  
  createProject(projectData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}projectRouter/newproject`, projectData, { headers }).pipe(
      catchError(error => {
        console.error('Create project error:', error);
        return throwError(error);
      })
    );
  }
  updateProject(id: string, projectData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}projectRouter/updateproject/${id}`, projectData).pipe(
      catchError(error => {
        console.error('Update project error:', error);
        return throwError(error);
      })
    );
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}projectRouter/deleteproject/${id}`).pipe(
      catchError(error => {
        console.error('Delete project error:', error);
        return throwError(error);
      })
    );
  }

  findTasksOfEachProject(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}FTOEP/${id}`).pipe(
      catchError(error => {
        console.error('Find tasks of each project error:', error);
        return throwError(error);
      })
    );
  }

  getAllTasks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}alltasks`).pipe(
      catchError(error => {
        console.error('Get all tasks error:', error);
        return throwError(error);
      })
    );
  }

  getTaskById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getsingletask/${id}`).pipe(
      catchError(error => {
        console.error('Get task by ID error:', error);
        return throwError(error);
      })
    );
  }

  newTask(projectId: string, taskData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}newTask/${projectId}`, taskData).pipe(
      catchError(error => {
        console.error('Create new task error:', error);
        return throwError(error);
      })
    );
  }

  updateTask(id: string, taskData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}updatetask/${id}`, taskData).pipe(
      catchError(error => {
        console.error('Update task error:', error);
        return throwError(error);
      })
    );
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deletetask/${id}`).pipe(
      catchError(error => {
        console.error('Delete task error:', error);
        return throwError(error);
      })
    );
  }

  
}
