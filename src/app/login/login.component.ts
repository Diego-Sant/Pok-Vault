import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})

export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;
  
    this.isLoading = true;
    this.error = '';
  
    const { username, password } = this.loginForm.value;
  
    this.apiService.post('http://localhost:8080/api/auth/entrar', { username, password })
    .subscribe({
      next: (response) => {
        this.authService.updateUser(response);
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        this.error = error?.error?.message || 'Erro ao autenticar!';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}