import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/kanban-api.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatButton,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  projects$!: Observable<any>;
  userRole!: string | null;
  isLoggedIn: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {

    // Check if user is authenticated before fetching projects
    if (this.apiService.isLoggedIn()) {
      this.fetchProjects();
      this.apiService.getUserIdFromLocalStorage();
    } else {
      // Handle unauthenticated user
      // console.error('User is not authenticated.');
    }

    this.userRole = this.apiService.getUserRole();
    this.isLoggedIn = this.apiService.isLoggedIn();
  }

  fetchProjects(): void {
    this.projects$ = this.apiService.getAllProjectsByUser();
  }

  navigateToTaskBoard(projectId: string): void {
    this.router.navigate(['/board', projectId]);
  }

  // In your Angular component class
  removeProject(event: MouseEvent ,projectId: string): void {
  // Prevent event propagation
  event.stopPropagation();
  // convert the project ID to a string
  projectId = String(projectId);
  this.apiService.removeProject(projectId).subscribe(
    () => {
      console.log('Project deleted successfully');
      // Optionally, reload projects or update local list
      this.fetchProjects();
    },
    error => {
      console.error('Error deleting project:', error);
      // Handle error, show toast, etc.
    }
  );
}

}