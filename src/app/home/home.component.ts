import { Component } from '@angular/core';
import { CardsService } from '../services/cards.service';
import { Cards } from '../../types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private cardsService: CardsService) {}

  ngOnInit() {
    this.cardsService.getCards('http://localhost:8080/api/cartas', {page: 0, perPage: 5})
    .subscribe((cards: Cards) => {
      console.log(cards.cards)
    })
  }
}
