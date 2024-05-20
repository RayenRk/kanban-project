import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/kanban-api.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // Import Router
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

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

  constructor(private apiService: ApiService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.projects$ = this.apiService.getAllProjects();
  }

  navigateToTasks(projectId: string): void {
    this.router.navigate(['/board', projectId]);
  }
  
}
