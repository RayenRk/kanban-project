import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  imports: [RouterOutlet, DragDropComponent,CommonModule,
    DashboardComponent,UsersComponent,TasksComponent,
    ProjectsComponent,LoginComponent,RegisterComponent,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'Kanban Board';
  isLoggedIn: boolean = false; // Initially set logged in to false

  constructor(private router: Router, private apiService: ApiService) {}

  ngAfterViewInit() {
    // Check for existing login on app load
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    // Replace with your specific logic to check for a stored token
    const storedToken = localStorage.getItem('userToken');
    this.isLoggedIn = !!storedToken;  // Set isLoggedIn based on token presence
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = !['/login', '/register'].includes(event.url);
      }
    });

    // Check for existing login on app load (optional)
    this.checkLoginStatus();
  }

  logout() {
    this.apiService.logout().subscribe(response => {
      // Handle successful logout response (optional)
      console.log('Logout successful:', response);
      localStorage.removeItem('userToken'); // Example: remove stored token

      // Redirect to login page after logout
      this.router.navigate(['/login']);
    }, error => {
      // Handle logout error (optional)
      console.error('Logout error:', error);
    });
  }
}