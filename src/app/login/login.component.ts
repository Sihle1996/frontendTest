import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Submitting login form:', { email, password });
      this.authService.login({ email, password }).subscribe(
        (response) => {
          console.log('Login successful:', response);
          console.log('Token:', response.token); // Log the token to the console
          this.authService.saveToken(response.token);
          //this.router.navigate(['/dashboard']); // Replace with a valid route if needed
        },
        (error) => {
          console.error('Login failed:', error);
        }
      );
    } else {
      console.warn('Form is invalid:', this.loginForm.errors);
    }
  }
}
