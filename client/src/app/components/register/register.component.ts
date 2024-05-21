import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/kanban-api.service';
import { User } from '../../models/users';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',   
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showErrorAlert = false; // Variable for controlling the error alert
  showSuccessAlert = false; // Variable for controlling the success alert

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['user', Validators.required]
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const userData: User = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role 
    };

    this.apiService.register(userData).subscribe(
      (response: User) => {
        // Handle successful registration
        console.log('Registration successful:', response);
        this.showSuccessAlert = true;
        setTimeout(() => {
          this.showSuccessAlert = false;
          this.router.navigate(['/login']);
        }, 1000); // Hide the alert and redirect after 3 seconds
      },
      (error) => {
        // Handle registration error
        console.error('Registration error:', error);
        this.showErrorAlert = true;
        setTimeout(() => this.showErrorAlert = false, 3000); // Hide the alert after 3 seconds
      }
    );
  }

  openLoginPage() {
    this.router.navigateByUrl('/login');
  }
}