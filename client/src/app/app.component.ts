import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropComponent } from './components/drag-drop/drag-drop.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProjectsComponent } from './components/projects/projects.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DragDropComponent, RegisterComponent,
    LoginComponent,DashboardComponent,UsersComponent,TasksComponent,ProjectsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Kanban Board';
}
