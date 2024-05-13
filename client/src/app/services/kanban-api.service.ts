import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { register } from 'module';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/'; 
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}


  setIsLoggedIn(loggedIn: boolean) {
    this.isLoggedInSubject.next(loggedIn);
  }

  // Authentication Routes
  login(credentials: any): Observable<any> {
      return this.http.post(`${this.apiUrl}api/auth/login`, credentials);
  }

  register(userData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}api/auth/register`, userData);
  }

  logout(): Observable<any> {
      return this.http.post(`${this.apiUrl}api/auth/logout`, {});
  }

  // Project Routes

   getAllProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}projectRouter/allprojects`);
  }

  createProject(projectData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}projectRouter/newproject`, projectData);
  }

  updateProject(id: string, projectData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}projectRouter/updateproject/${id}`, projectData);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}projectRouter/deleteproject/${id}`);
  }

  findTasksOfEachProject(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}FTOEP/${id}`);
  }

  // Task Routes
  getAllTasks(): Observable<any> {
      return this.http.get(`${this.apiUrl}alltasks`);
  }

  getTaskById(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}getsingletask/${id}`);
  }

  newTask(projectId: string, taskData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}newTask/${projectId}`, taskData);
  }

  updateTask(id: string, taskData: any): Observable<any> {
      return this.http.patch(`${this.apiUrl}updatetask/${id}`, taskData);
  }

  deleteTask(id: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}deletetask/${id}`);
  }

  createTask(taskData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}createTask`, taskData);
  }

  // User Routes
  getAllUsers(): Observable<any> {
      return this.http.get(`${this.apiUrl}`);
  }

  getUserById(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}${id}`);
  }

  createUser(userData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}create`, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
      return this.http.put(`${this.apiUrl}${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}${id}`);
  }
}
