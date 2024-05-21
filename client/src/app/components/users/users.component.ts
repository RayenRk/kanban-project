import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/kanban-api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userForm: FormGroup;
  showSuccessAlert: boolean = false;
username: any;

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });
  }

  ngOnInit(): void {}

  createUser(): void {
    if (this.userForm.valid) {
      this.apiService.createUser(this.userForm.value).subscribe(
        (data) => {
          console.log('User added successfully:', data);
          this.userForm.reset();
          this.showSuccessAlert = true; // Show the success alert
          setTimeout(() => {
            this.showSuccessAlert = false; // Hide the success alert after 3 seconds
            window.location.href = '/home'; // Redirect to the home page
          }, 1000);
        },
        (error) => {
          console.error('Error adding user:', error);
        }
      );
    }
  }
}
