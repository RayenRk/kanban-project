import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/kanban-api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/users';
import { take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projectForm: FormGroup;
  showSuccessAlert: boolean = false;
  users: User[] = [];

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      owner: [this.apiService.getUserIdFromLocalStorage(), Validators.required],
      responsible: ['', Validators.required] // Add responsible field to the form
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }
  fetchUsers(): void {
    this.apiService.getAllUsers().pipe(
      take(1)
    ).subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  

  addProject(): void {
    if (this.projectForm.valid) {
      this.apiService.createProject(this.projectForm.value).subscribe(
        (data) => {
          console.log('Project added successfully:', data);
          this.projectForm.reset();
          this.showSuccessAlert = true; // Show the success alert
          setTimeout(() => {
            this.showSuccessAlert = false; // Hide the success alert after 3 seconds
            window.location.href = '/home'; // Redirect to home after hiding the alert
          }, 1000);
        },
        (error) => {
          console.error('Error adding project:', error);
        }
      );
    }
  }
}
