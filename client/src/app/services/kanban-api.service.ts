import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Task } from '../models/tasks';
import e from 'express';

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

  getUserRole(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem('role');
    }
    return null;
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }  

  // New method to get the user ID from localStorage
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
        localStorage.setItem('role', decodedToken?.role || '');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
      }
      this.loggedInStatus.next(this.isLoggedIn());
    }
  }

  clearToken(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
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
  
  getAllUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}api/user/getAllUser`, { headers })
      .pipe(
        catchError(error => {
          console.error('Get all users error:', error);
          return throwError(error);
        })
      );
  }

  getUserById(): Observable<any> {
    const headers = this.getAuthHeaders();
    const userId = this.getUserIdFromLocalStorage();
    return this.http.get<any>(`${this.apiUrl}api/user/getuser/${userId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Get user by ID error:', error);
        return throwError(error);
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

  getAllProjectsByUser(): Observable<any> {
    const headers = this.getAuthHeaders();
    const userId = this.getUserIdFromLocalStorage();
    return this.http.get<any>(`${this.apiUrl}projectRouter/allprojectsbyuser/${userId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Get all projects error:', error);
          return throwError(error);
        })
      );
  }

  getAllTasksCurrent(): Observable<any[]> {
    const userId = this.getUserIdFromLocalStorage();
    if (!userId) {
      return throwError('User ID not found in local storage');
    }

    return this.http.get<any[]>(`${this.apiUrl}taskRouter/alltasksbyuser/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      //map(tasks => tasks.filter(task => task.responsible === userId)),
      catchError(error => {
        console.error('Error fetching tasks:', error);
        return throwError(error);
      })
    );
  }

  getAllTasksCurrentWithProject(projectId: string): Observable<any[]> {
    const userId = this.getUserIdFromLocalStorage();
    if (!userId) {
      return throwError('User ID not found in local storage');
    }
  
    return this.http.get<any[]>(`${this.apiUrl}taskRouter/alltasksbyuserandproject/${projectId}/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching tasks:', error);
        return throwError(error);
      })
    );
  }
  

  newTask(taskData: any): Observable<any> {
    const userId = this.getUserIdFromLocalStorage();
    if (!userId) {
      return throwError('User ID not found in local storage');
    }
    return this.http.post<any>(`${this.apiUrl}taskRouter/newtask/${userId}`, taskData,
    { headers : this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Create new task error:', error);
        return throwError(error);
      })
    );
  }

  newTaskWithProject(projectId: string, taskData: any): Observable<any> {
    const userId = this.getUserIdFromLocalStorage();
    if (!userId) {
      return throwError('User ID not found in local storage');
    }
  
    return this.http.post<any>(`${this.apiUrl}taskRouter/newtaskwithproject/${projectId}/${userId}`, taskData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Create new task error:', error);
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
    return this.http.get<any>(`${this.apiUrl}FTOEP/${id}`).pipe(
      catchError(error => {
        console.error('Find tasks of each project error:', error);
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

  updateTask(id: string, taskData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}taskRouter/updateTask/${id}`, taskData).pipe(
      catchError(error => {
        console.error('Update task error:', error);
        return throwError(error);
      })
    );
  }

  // New method to delete a task by curent task ID
  deleteTask(taskId: string): Observable<any> {
    const taskIdString = taskId.toString(); // Convert taskId to string
    return this.http.delete<any>(`${this.apiUrl}taskRouter/deleteTask/${taskIdString}`).pipe(
      catchError((error) => {
        console.error('Delete task error:', error);
        return throwError(error);
      })
    );
  }

  // get project name
  getProjectNameById(projectId: string): Observable<string> {
    return this.http.get<{ projectName: string }>(`${this.apiUrl}projectRouter/getprojectname/${projectId}`)
      .pipe(
        map(response => response.projectName),
        catchError(error => {
          console.error('Error fetching project name:', error);
          return throwError(error);
        })
      );
  }

  // In your Angular service (e.g., project.service.ts)
removeProject(projectId: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}projectRouter/removeproject/${projectId}`, {
    headers: this.getAuthHeaders()
  }).pipe(
    catchError(error => {
      console.error('Error deleting project:', error);
      return throwError(error);
    })
  );
}


  
}
