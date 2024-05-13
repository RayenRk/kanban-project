import { Routes } from '@angular/router';
import { DragDropComponent } from './components/drag-drop/drag-drop.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
  { path: 'dashboard', component: DashboardComponent },// Redirect root path to drag-drop
  { path: 'board', component: DragDropComponent }, // Drag & Drop route
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'register', component: RegisterComponent }, // Register route
  { path: 'new-user', component: UsersComponent },
  { path: 'new-project', component: ProjectsComponent },
  { path: 'new-task', component: TasksComponent },
];


export { routes }; 