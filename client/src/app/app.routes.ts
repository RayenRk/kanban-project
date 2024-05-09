import { Routes } from '@angular/router';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { TasksComponent } from './tasks/tasks.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: 'dashboard', component: DashboardComponent },// Redirect root path to drag-drop
  { path: 'board', component: DragDropComponent }, // Drag & Drop route
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'register', component: RegisterComponent }, // Register route
  { path: 'new-user', component: UsersComponent },
  { path: 'new-project', component: ProjectsComponent },
  { path: 'new-task', component: TasksComponent },
];


export { routes }; 