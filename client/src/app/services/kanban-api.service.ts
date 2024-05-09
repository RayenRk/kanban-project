import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  // Authentication Routes
  login(credentials: any): Observable<any> {
      return this.http.post(`${this.apiUrl}login`, credentials);
  }

  register(userData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}register`, userData);
  }

  logout(): Observable<any> {
      return this.http.post(`${this.apiUrl}logout`, {});
  }

  // Project Routes
  getAllProjects(): Observable<any> {
      return this.http.get(`${this.apiUrl}allprojects`);
  }

  getProjectById(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}getsingleproject/${id}`);
  }

  createProject(projectData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}newproject`, projectData);
  }

  updateProject(id: string, projectData: any): Observable<any> {
      return this.http.patch(`${this.apiUrl}updateproject/${id}`, projectData);
  }

  deleteProject(id: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}deleteproject/${id}`);
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
