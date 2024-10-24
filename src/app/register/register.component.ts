import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})

export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;
  
    this.isLoading = true;
    this.error = '';
  
    const { username, email, password } = this.registerForm.value;
  
    this.apiService.post('https://poke-vault-api.vercel.app/api/auth/cadastrar', { username, email, password })
    .subscribe({
      next: (response) => {
        this.router.navigate(['/entrar']);
      },
      error: (error: any) => {
        this.error = error?.error?.message || 'Erro ao registrar!';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}