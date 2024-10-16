import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Cards, PaginationParams } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(private apiService: ApiService) { }

  getCards = (url: string, params: PaginationParams): Observable<Cards> => {
    return this.apiService.get(url, {
      params,
      responseType: 'json',
      withCredentials: true,
    });
  }
}
