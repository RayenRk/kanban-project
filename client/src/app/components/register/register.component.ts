import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/kanban-api.service';
import { User } from '../../models/users'; // Import the User interface

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',   
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  error: string = '';

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
        // Redirect or perform other actions as needed
        this.router.navigate(['/login']);

      },
      (error) => {
        // Handle registration error
        console.error('Registration error:', error);
        this.error = error.message || 'An error occurred during registration.';
      }
    );
  }

  openLoginPage() {
    this.router.navigateByUrl('/login');
  }
}
