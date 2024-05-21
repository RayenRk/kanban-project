import { Routes } from '@angular/router';
import { DragDropComponent } from './components/drag-drop/drag-drop.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { UsersComponent } from './components/users/users.component';
import { AuthGuard } from './auth.guard';
import { LoginAuthGuard } from './loginAuth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: DashboardComponent },// Redirect root path to drag-drop
  { path: 'board', component: DragDropComponent }, // Drag & Drop route
  { path: 'login', component: LoginComponent,canActivate: [LoginAuthGuard],data:{ refresh:true }}, // Login route
  { path: 'register', component: RegisterComponent }, // Register route
  { path: 'new-user', component: UsersComponent ,canActivate: [AuthGuard],data: { roles: ['po','admin'] }},
  { path: 'new-project', component: ProjectsComponent,canActivate: [AuthGuard],data: { roles: ['po','admin'] } },
  { path: 'new-task', component: TasksComponent,canActivate: [AuthGuard],data: { roles: ['po','admin'] } },
  { path: 'board/:projectId', component: DragDropComponent },
];


export { routes }; 