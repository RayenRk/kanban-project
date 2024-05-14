import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DragDropComponent } from './components/drag-drop/drag-drop.component';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ApiService } from './services/kanban-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [ApiService],
  imports: [
    RouterOutlet,
    DragDropComponent,
    DashboardComponent,
    UsersComponent,
    TasksComponent,
    CommonModule,
    ProjectsComponent,
    LoginComponent,
    RegisterComponent,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Kanban Board';
  showNavbar: boolean = true;
  isLoggedIn: boolean = false;
  username: string = '';

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.checkLoginStatus();
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkLoginStatus();
      }
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = !['/login', '/register','/home'].includes(event.url);
      }
    });
  }

  checkLoginStatus(): void {
    const token = this.apiService.getToken();
    this.isLoggedIn = !!token;
    if (this.isLoggedIn) {
      this.username = localStorage.getItem('username') || '';
    } else {
      this.username = '';
    }
  }

  logout() {
    this.apiService.logout().subscribe(
      () => {
        this.apiService.clearToken();
        this.isLoggedIn = false;
        this.username = '';
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.error('Logout error:', error);
      }
    );
  }
}