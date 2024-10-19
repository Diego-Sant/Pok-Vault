import { Component } from '@angular/core';
import { CardsService } from '../services/cards.service';
import { Card, Cards } from '../../types';
import { CardComponent } from '../components/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  constructor(private cardsService: CardsService) {}

  cardsPoke: Card[] = [];

  ngOnInit() {
    this.cardsService.getCards('http://localhost:8080/api/cartas', {page: 0, perPage: 60})
    .subscribe((cards: Cards) => {
      this.cardsPoke = cards.cards;
    })
  }
}
