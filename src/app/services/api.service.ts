import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card, Options } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {}

  get<T>(url: string, options: Options): Observable<T> {
    return this.httpClient.get<T>(url, options) as Observable<T>;
  }

  post<T>(url: string, body: any, options?: Options): Observable<T> {
    return this.httpClient.post<T>(url, body, { ...options, withCredentials: true }) as Observable<T>;
  }

  put<T>(url: string, body: Card, options?: Options): Observable<T> {
    return this.httpClient.put<T>(url, body, { ...options, withCredentials: true }) as Observable<T>;
  }

  delete<T>(url: string, options?: Options): Observable<T> {
    return this.httpClient.delete<T>(url, { ...options, withCredentials: true }) 
  }
}
