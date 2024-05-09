import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProjectsComponent } from './projects/projects.component';


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
