import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Task } from '../models/tasks';
import { EMPTY } from 'rxjs';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
 
  private apiUrl = 'http://localhost:5000/';
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private loggedInStatus = new BehaviorSubject<boolean>(this.isLoggedIn());

  loginStatus = this.loggedInStatus.asObservable();

  constructor(private http: HttpClient) {}

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  isLoggedIn(): boolean {
    if (this.isLocalStorageAvailable()) {
      const token = localStorage.getItem('token');
      return !!token && !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }    
  
  getUsername(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem('username');
    }
    return null;
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }  

  getUserIdFromLocalStorage(): string | null {
    if (this.isBrowser() && this.isLocalStorageAvailable()) {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken?.userId || null;
      }
    }
    return null;
  }

  setToken(token: string | null): void {
    if (this.isLocalStorageAvailable()) {
      if (token) {
        localStorage.setItem('token', token);
        const decodedToken = this.jwtHelper.decodeToken(token);
        localStorage.setItem('userId', decodedToken?.userId || '');
        localStorage.setItem('username', decodedToken?.username || '');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
      }
      this.loggedInStatus.next(this.isLoggedIn());
    }
  }
  
  
  private getAuthHeaders(): HttpHeaders {
    const token = this.isLocalStorageAvailable() ? localStorage.getItem('token') : null;
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
  
  

  clearToken(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.loggedInStatus.next(this.isLoggedIn());
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/auth/register`, userData).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(error);
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/auth/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.loggedInStatus.next(true); 
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }  
  
  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/auth/logout`, {}).pipe(
      tap(() => {
        this.clearToken();
      }),
      catchError((error) => {
        console.error('Logout error:', error);
        return throwError(error);
      })
    );
  }

  getUserRole(): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.get<string>(`${this.apiUrl}api/auth/userRole`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user role:', error);
        return throwError(error);
      })
    );
  }
  
  
  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}api/user/getAllUser`, { headers })
      .pipe(
        catchError(error => {
          console.error('Get all users error:', error);
          return throwError(error);
        })
      );
  }  
  

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}users/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching user by ID:', error);
        return throwError('Failed to fetch user. Please try again later.');
      })
    );
}


  createUser(user: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}api/user/createUser`, user, { headers }).pipe(
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

  deleteUser(userId: number): Observable<any> {
    const userIdString = userId.toString(); // Convert userId to string
    return this.http.delete<any>(`${this.apiUrl}users/${userIdString}`).pipe(
      catchError((error) => {
        console.error('Delete user error:', error);
        return throwError(error);
      })
    );
  }

  getAllProjects(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}projectRouter/allprojects`, { headers })
      .pipe(
        catchError(error => {
          console.error('Get all projects error:', error);
          return throwError(error);
        })
      );
  }  

  getAllTasksCurrent(): Observable<Task[]> {
    const userId = this.getUserIdFromLocalStorage();
    if (!userId) {
      return EMPTY; // Return an empty observable instead of throwing an error
    }
  
    const headers = this.getAuthHeaders();
    return this.http.get<Task[]>(`${this.apiUrl}taskRouter/alltasksbyuser/${userId}`, {
      headers,
    }).pipe(
      catchError(error => {
        console.error('Error fetching tasks:', error);
        return throwError(error);
      })
    );
  }
  

  getAllTasks(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}taskRouter/alltasks`, { headers })
      .pipe(
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

  deleteProject(projectId: number): Observable<any> {
    const projectIdString = projectId.toString(); // Convert projectId to string
    return this.http.delete<any>(`${this.apiUrl}projectRouter/deleteproject/${projectIdString}`).pipe(
      catchError((error) => {
        console.error('Delete project error:', error);
        return throwError(error);
      })
    );
  }

  findTasksOfEachProject(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}taskRouter/FTOEP/${id}`).pipe(
      catchError(error => {
        console.error('Find tasks of each project error:', error);
        return throwError(error);
      })
    );
  }

  getTaskById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}taskRouter/getsingletask/${id}`).pipe(
      catchError(error => {
        console.error('Get task by ID error:', error);
        return throwError(error);
      })
    );
  }

  newTask(projectId: string, taskData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}taskRouter/newTask/${projectId}`, taskData, { headers }).pipe(
        catchError(error => {
            console.error('Error creating new task:', error); // Detailed error logging
            return throwError(error);
        })
    );
}

  updateTask(id: string, taskData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}taskRouter/updatetask/${id}`, taskData).pipe(
      catchError((error) => {
        console.error('Update task error:', error);
        return throwError(error);
      })
    );
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}taskRouter/deletetask/${id}`).pipe(
      catchError(error => {
        console.error('Delete task error:', error);
        return throwError(error);
      })
    );
  }

  getCurrentProject(): Observable<any> {
    const userId = this.getUserIdFromLocalStorage();
    if (!userId) {
      return throwError('User ID not found in local storage');
    }
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}projects/current/${userId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching current project:', error);
        return throwError(error);
      })
    );
  }
}
