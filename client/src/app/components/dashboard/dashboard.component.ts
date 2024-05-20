import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/kanban-api.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  projects$!: Observable<any>;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Check if user is authenticated before fetching projects
    if (this.apiService.isLoggedIn()) {
      this.fetchProjects();
      this.apiService.getUserIdFromLocalStorage();
    } else {
      // Handle unauthenticated user
      console.error('User is not authenticated.');
    }
  }

  fetchProjects(): void {
    this.projects$ = this.apiService.getAllProjects();
  }

  navigateToTaskBoard(projectId: string): void {
    this.router.navigate(['/board', projectId]);
  }
}