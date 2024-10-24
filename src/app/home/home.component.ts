import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Paginator, PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';

import { CardsService } from '../services/cards.service';
import { Card, Cards } from '../../types';
import { CardComponent } from '../components/card/card.component';
import { HeaderComponent } from "../layout/header/header.component";
import { EditPopupComponent } from "../components/edit-popup/edit-popup.component";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, CommonModule, PaginatorModule, HeaderComponent, 
  EditPopupComponent, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  cardsPoke: Card[] = [];
  constructor(private cardsService: CardsService, private authService: AuthService) {}
  isLoggedIn: boolean = false;

  currentUserId: string = '';
  
  // -------------------Adicionar, editar e excluir------------------------------ //

  displayEditPopup: boolean = false;
  displayAddPopup : boolean = false;

  selectedCard: Card = {
    id: '',
    title: '',
    imageUrl: '',
    price: '',
    rarity: 0,
    createdAt: new Date(),
    userId: '',
  }

  toggleEditCard(card: Card) {
    this.selectedCard = card;
    this.displayEditPopup = true;
  }

  toggleDeleteCard(card: Card) {
    if (!card.id) {
      return;
    }

    this.deleteCard(card.id);
  }

  toggleAddCard() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(card: Card) {
    if (!this.selectedCard.id) {
      return;
    }

    this.editCard(card, this.selectedCard.id);
    this.displayEditPopup = false;
  }

  onConfirmAdd(card: Card) {
    this.addCard(card);
    this.displayAddPopup = false;
  }

  editCard(card: Card, id: string) {
    this.cardsService.editCard(`https://poke-vault-api.vercel.app/api/cartas/${id}`, card)
    .subscribe(
      {
        next: (data) => {
          console.log(data);
          this.fetchCards(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }

  deleteCard(id: string) {
    this.cardsService.deleteCard(`https://poke-vault-api.vercel.app/api/cartas/${id}`)
    .subscribe(
      {
        next: (data) => {
          console.log(data);
          this.fetchCards(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }

  addCard(card: Card) {
    this.cardsService.addCard(`https://poke-vault-api.vercel.app/api/cartas`, card)
    .subscribe(
      {
        next: (data) => {
          console.log(data);
          this.fetchCards(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }

  // -------------------------Filtro------------------------------ //

  filteredCards: Card[] = [];
  activeFilter: string = 'older';

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

  onFilterChange(filterValue: string) {
    this.activeFilter = filterValue;
    this.applyFilter();
  }

  // -------------------------Paginação---------------------------------- //
  
  @ViewChild('paginator') paginator: Paginator | undefined;

  totalRecords = 0;
  rows: number = 12;
  rowsPerPageOptions: number[] = [8, 12, 18, 24, 32, 40];

  fetchCards(page: number, perPage: number) {
    this.cardsService.getCards('https://poke-vault-api.vercel.app/api/cartas', {page, perPage, searchTerm: this.searchTerm})
      .subscribe((cards: Cards) => {
        this.cardsPoke = cards.cards;
        this.totalRecords = cards.total;

        if (perPage > 40) {
          perPage = this.totalRecords;
        }

        this.applyFilter();
      });
  }

  onPageChange(event: any) {
    this.fetchCards(event.page, event.rows);
  }

  resetPaginator() {
    this.paginator?.changePage(0);
  }

  getDynamicRowsPerPageOptions(): number[] {
    const options = [...this.rowsPerPageOptions];
    if (this.totalRecords > 40) {
      options.push(this.totalRecords);
    }
    return options;
  }

  // -------------------------Search---------------------------------- //

  searchTerm: string = '';

  onSearch(term: string) {
    this.searchTerm = term;
    this.fetchCards(0, this.rows);
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.fetchCards(0, this.rows);
  }
}
