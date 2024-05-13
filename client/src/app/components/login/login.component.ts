import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/kanban-api.service';
import { User } from '../../models/users'; // Import the User interface

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: string = ''; // Variable to store error message

  constructor(
    private fb: FormBuilder,
    private router: Router,
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
      return;
    }

    const credentials = this.loginForm.value;
    this.apiService.login(credentials).subscribe(
      (response: User) => {
        // Handle successful login
        console.log('Login successful:', response);
        // Redirect or perform other actions as needed
      },
      (error) => {
        // Handle login error
        console.error('Login error:', error);
        this.error = error.message || 'An error occurred during login.';
      }
    );
  }

  openRegistrationPage() {
    this.router.navigateByUrl("/signup");
  }
}
