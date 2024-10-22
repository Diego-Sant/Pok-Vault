import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  updateUser(user: any) {
    this.currentUserSubject.next(user);
    localStorage.setItem('username', JSON.stringify(user));
    localStorage.setItem('token', user.token);
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('username');
  }

}
