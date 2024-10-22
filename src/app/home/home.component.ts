import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

import { CardsService } from '../services/cards.service';
import { Card, Cards } from '../../types';
import { CardComponent } from '../components/card/card.component';
import { HeaderComponent } from "../layout/header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, CommonModule, PaginatorModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  cardsPoke: Card[] = [];
  filteredCards: Card[] = [];

  activeFilter: string = 'older';
  searchTerm: string = '';

  totalRecords = 0;
  rows: number = 12;
  rowsPerPageOptions: number[] = [8, 12, 18, 24, 32, 40];

  constructor(private cardsService: CardsService) {}

  onPageChange(event: any) {
    this.fetchCards(event.page, event.rows);
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.fetchCards(0, this.rows);
  }

  fetchCards(page: number, perPage: number) {
    this.cardsService.getCards('http://localhost:8080/api/cartas', {page, perPage, searchTerm: this.searchTerm})
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

  editCard(card: Card, id: number) {
    this.cardsService.editCard(`http://localhost:8080/api/cartas/${id}`, card)
    .subscribe(
      {
        next: (data) => {
          console.log(data);
          this.fetchCards(0, this.rows);
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }

  deleteCard(id: number) {
    this.cardsService.deleteCard(`http://localhost:8080/api/cartas/${id}`)
    .subscribe(
      {
        next: (data) => {
          console.log(data);
          this.fetchCards(0, this.rows);
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }

  addCard(card: Card) {
    this.cardsService.addCard(`http://localhost:8080/api/cartas`, card)
    .subscribe(
      {
        next: (data) => {
          console.log(data);
          this.fetchCards(0, this.rows);
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }

  ngOnInit() {
    this.fetchCards(0, this.rows);
  }
}
