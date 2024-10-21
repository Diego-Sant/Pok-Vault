import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username: string | null = null;
  currentUser$: Observable<any>;

  @Output() searchEvent = new EventEmitter<string>();

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.searchEvent.emit(searchTerm);
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      this.username = user ? user.username : 'Usuário não logado';
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
