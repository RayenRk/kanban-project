import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/kanban-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showErrorAlert = false; // Variable for controlling the error alert
  showSuccessAlert = false; // Variable for controlling the success alert

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.value;
    this.apiService.login(credentials).subscribe(
      (response) => {
        // Handle successful login
        console.log('Login successful:', response);
        this.showSuccessAlert = true;
        setTimeout(() => {
          this.showSuccessAlert = false;
          window.location.href = '/home'; // Redirect after showing the success alert
        }, 1000); // Hide the alert after 3 seconds
      },
      (error) => {
        // Handle login error
        console.error('Login error:', error);
        this.showErrorAlert = true;
        setTimeout(() => this.showErrorAlert = false, 3000); // Hide the alert after 3 seconds
      }
    );
  }
}
