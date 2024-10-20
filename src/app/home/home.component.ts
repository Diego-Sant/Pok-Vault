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
  cardsPoke: Card[] = [];
  filteredCards: Card[] = [];
  activeFilter: string = 'older';

  totalRecords = 0;
  rows: number = 12;
  rowsPerPageOptions: number[] = [8, 12, 18, 24, 32, 40];

  constructor(private cardsService: CardsService) {}

  onPageChange(event: any) {
    this.fetchCards(event.page, event.rows);
  }

  fetchCards(page: number, perPage: number) {
    this.cardsService.getCards('http://localhost:8080/api/cartas', {page, perPage})
      .subscribe((cards: Cards) => {
        this.cardsPoke = cards.cards;
        this.totalRecords = cards.total;

        if (perPage > 40) {
          perPage = this.totalRecords;
        }

        this.applyFilter();
      });
  }

  onFilterChange(filterValue: string) {
    this.activeFilter = filterValue;
    this.applyFilter();
  }

  applyFilter() {
    const parseBrazilianCurrency = (value: string) => {
      return parseFloat(value.replace(/\./g, '').replace(',', '.'));
    };

    switch (this.activeFilter) {
      case 'lowPrice':
        this.filteredCards = this.cardsPoke.sort((a, b) => parseBrazilianCurrency(a.price) - parseBrazilianCurrency(b.price));
        break;
      case 'highPrice':
        this.filteredCards = this.cardsPoke.sort((a, b) => parseBrazilianCurrency(b.price) - parseBrazilianCurrency(a.price));
        break;
      case 'recent':
        this.filteredCards = this.cardsPoke.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'older':
        this.filteredCards = this.cardsPoke.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'alphabetical':
        this.filteredCards = this.cardsPoke.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        this.filteredCards = [...this.cardsPoke];
        break;
    }
  }

  getDynamicRowsPerPageOptions(): number[] {
    const options = [...this.rowsPerPageOptions];
    if (this.totalRecords > 40) {
      options.push(this.totalRecords);
    }
    return options;
  }

  ngOnInit() {
    this.fetchCards(0, this.rows);
  }
}
