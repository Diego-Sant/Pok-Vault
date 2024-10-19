import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

import { CardsService } from '../services/cards.service';
import { Card, Cards } from '../../types';
import { CardComponent } from '../components/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, CommonModule, PaginatorModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  constructor(private cardsService: CardsService) {}

  cardsPoke: Card[] = [];

  totalRecords = 0;
  rows: number = 12;
  rowsPerPageOptions = [8, 12, 18, 24];

  onPageChange(event: any) {
    this.fetchCards(event.page, event.rows);
  }

  fetchCards(page: number, perPage: number) {
    this.cardsService.getCards('http://localhost:8080/api/cartas', {page, perPage})
    .subscribe((cards: Cards) => {
      this.cardsPoke = cards.cards;
      this.totalRecords = cards.total;
    })
  }

  ngOnInit() {
    this.fetchCards(0, this.rows);
  }
}
