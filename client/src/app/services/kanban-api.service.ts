import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/';
  private authToken: string | null = null;

  constructor(private http: HttpClient) {}

  setToken(token: string): void {
    this.authToken = token;
  }

  getToken(): string | null {
    return this.authToken;
  }

  clearToken(): void {
    this.authToken = null;
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
        // Handle registration error
        console.error('Registration error:', error);
        return throwError(error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/auth/logout`, {}).pipe(
      catchError((error) => {
        // Handle logout error
        console.error('Logout error:', error);
        return throwError(error);
      })
    );
  }

  getAllProjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}projectRouter/allprojects`).pipe(
      catchError(error => {
        console.error('Get all projects error:', error);
        return throwError(error);
      })
    );
  }

  createProject(projectData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}projectRouter/newproject`, projectData).pipe(
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

  // User Routes

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}allusers`).pipe(
      catchError(error => {
        console.error('Get all users error:', error);
        return throwError(error);
      })
    );
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}user/${id}`).pipe(
      catchError(error => {
        console.error('Get user by ID error:', error);
        return throwError(error);
      })
    );
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}createuser`, userData).pipe(
      catchError(error => {
        console.error('Create user error:', error);
        return throwError(error);
      })
    );
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}updateuser/${id}`, userData).pipe(
      catchError(error => {
        console.error('Update user error:', error);
        return throwError(error);
      })
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deleteuser/${id}`).pipe(
      catchError(error => {
        console.error('Delete user error:', error);
        return throwError(error);
      })
    );
  }

  getProtectedData(): Observable<any> {
    const headers = this.getAuthHeaders(); // Use getAuthHeaders to include the authorization token
    return this.http.get<any>(`${this.apiUrl}protectedData`, { headers }).pipe(
      catchError(error => {
        console.error('Get protected data error:', error);
        return throwError(error);
      })
    );
  }

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.authToken) {
      headers = headers.set('Authorization', `Bearer ${this.authToken}`);
    }
    return headers;
  }
}

