import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string | null = null; // Placeholder for error messages

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize the login form with email and password validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Submitting login form:', { email, password });
  
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
  
          // Save the token
          this.authService.saveToken(response.token);
  
          // Extract and log userId
          const userId = this.authService.getUserId();
          console.log('Logged-in User ID:', userId);
  
          // Extract roles and redirect based on roles
          const roles = this.authService.getRoles();
          console.log('User roles:', roles);
  
          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin/dashboard']); // Redirect to admin dashboard
          } else if (roles.includes('ROLE_USER')) {
            this.router.navigate(['/menu']); // Redirect to user menu
          } else {
            console.warn('Unknown role, redirecting to default route.');
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.loginError = 'Invalid credentials. Please try again.';
        },
      });
    } else {
      console.warn('Form is invalid:', this.loginForm.errors);
      this.loginError = 'Please fill in all required fields correctly.';
    }
  }
  
}
