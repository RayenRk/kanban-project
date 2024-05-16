import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/kanban-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: string | null = null;

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
      (response) => {
        console.log('Login successful:', response);
        this.apiService.setToken(response.token); // Set the token after successful login
        localStorage.setItem('username', response.username);
        this.router.navigate(['/board']);
      },
      (error) => {
        console.error('Login error:', error);
        this.error = error?.error?.message || 'An error occurred during login.';
      }
    );
  }
}