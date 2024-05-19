import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/kanban-api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  taskForm: FormGroup;
  showSuccessAlert: boolean = false;
  projects: any[] = []; // Array to hold the list of projects

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.taskForm = this.formBuilder.group({
      task_name: ['', Validators.required],
      description: ['', Validators.required],
      project: ['', Validators.required],
      responsible: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchProjects(); // Fetch projects when the component initializes
  }

  fetchProjects(): void {
    this.apiService.getAllProjects().subscribe(
      (data) => {
        this.projects = data;
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const projectId = this.taskForm.value.project; // Get the selected project ID
      this.apiService.newTask(projectId, this.taskForm.value).subscribe(
        (data) => {
          console.log('Task added successfully:', data);
          this.taskForm.reset();
          this.showSuccessAlert = true; // Show the success alert
          setTimeout(() => {
            this.showSuccessAlert = false; // Hide the success alert after 3 seconds
            window.location.href = '/home'; // Redirect to home after hiding the alert
          }, 3000);
        },
        (error) => {
          console.error('Error adding task:', error);
        }
      );
    }
  }
  
}
