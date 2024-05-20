import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/kanban-api.service';
import { User } from '../../models/users';
import { Project } from '../../models/projects';
import { take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  taskForm: FormGroup;
  projects: Project[] = [];
  users: User[] = [];
  showSuccessAlert: boolean = false;


  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      project: ['', Validators.required],
      responsible: ['', Validators.required] // Add responsible field to the form
    });
  }

  ngOnInit(): void {
    this.fetchProjects();
    this.fetchUsers(); // Fetch users when component initializes
  }

  fetchProjects(): void {
    this.apiService.getAllProjects().pipe(
      take(1)
    ).subscribe(
      (data: Project[]) => {
        this.projects = data;
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
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

  newTask(): void {
    if (this.taskForm.valid) {
      const projectId = this.taskForm.value.project;
      const userId = this.taskForm.value.responsible; // Get selected user ID
      const taskData = { ...this.taskForm.value, responsible: userId }; // Update task data with user ID
      this.apiService.newTask(projectId, taskData).pipe(
        take(1)
      ).subscribe(
        (data) => {
          console.log('Task added successfully:', data);
          this.taskForm.reset();
          this.showSuccessAlert = true; // Show the success alert
          setTimeout(() => {
            this.showSuccessAlert = false;
            window.location.href = '/board'; // Redirect to home after hiding the alert
            // Hide the success alert after 3 seconds
          }, 1000);
        },
        (error) => {
          console.error('Error adding task:', error);
        }
      );
    }
  }
}
