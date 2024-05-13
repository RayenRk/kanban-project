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
  imports: [RouterOutlet, DragDropComponent,CommonModule,
    DashboardComponent,UsersComponent,TasksComponent,
    ProjectsComponent,LoginComponent,RegisterComponent,HttpClientModule],
    
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title= 'Kanban Board';
  showNavbar: boolean = true;
  isLoggedIn$ = this.apiService.isLoggedIn$;

  constructor(private apiService: ApiService, private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login', '/register'].includes(event.url);
      }
    });
  }

  logout() {
    this.apiService.logout().subscribe(() => {
      this.apiService.setIsLoggedIn(false);
      this.router.navigate(['/login']);
    });
  }
}
