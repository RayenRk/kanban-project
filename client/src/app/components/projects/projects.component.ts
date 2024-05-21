import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/kanban-api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projectForm!: FormGroup;
  showSuccessAlert: boolean = false;
  users: any[] = [];

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      owner: ['', Validators.required],
    });

    // check if user is authenticated before fetching users
    if (this.apiService.isLoggedIn()) {
      this.apiService.getAllUsers().subscribe((users:any[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      });
      
    } else {
      console.error('User is not authenticated.');
    }
    
    
  }

  addProject(): void {
    if (this.projectForm.invalid) {
      return;
    }

    // Extract userId from the selected option
    const userId = this.projectForm.value.owner;

    // Create project object with userId
    const projectData = {
      name: this.projectForm.value.name,
      description: this.projectForm.value.description,
      owner: userId
    };

    // Call your service method to add the project
    this.apiService.createProject(projectData).subscribe(
      (response) => {
        // Reset form and show success alert
        this.projectForm.reset();
        this.showSuccessAlert = true;
        setTimeout(() => {
          this.showSuccessAlert = false;
          window.location.href = '/home';
        }, 1000); // Hide success alert after 5 seconds
      },
      (error) => {
        console.error('Error adding project:', error);
      }
    );
  }

  // addProject(): void {
  //   if (this.projectForm.valid) {
  //     this.apiService.createProject(this.projectForm.value).subscribe(
  //       (data) => {
  //         console.log('Project added successfully:', data);
  //         this.projectForm.reset();
  //         this.showSuccessAlert = true; // Show the success alert
  //         setTimeout(() => {
  //           this.showSuccessAlert = false; // Hide the success alert after 3 seconds
  //           window.location.href = '/home'; // Redirect to home after hiding the alert
  //         }, 1000);
  //       },
  //       (error) => {
  //         console.error('Error adding project:', error);
  //       }
  //     );
  //   }     
  // }
  
}
