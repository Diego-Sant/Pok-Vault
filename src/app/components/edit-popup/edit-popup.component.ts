import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';

import { Card } from '../../../types';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [DialogModule, CommonModule, FormsModule, RatingModule],
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss'
})
export class EditPopupComponent {
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();
  @Input() header!: string;

  @Input() card: Card = {
    title: '',
    imageUrl: '',
    price: '',
    rarity: 0,
    createdAt: new Date(),
    userId: '',
  }

  @Output() confirm = new EventEmitter<Card>();

  errorMessage: string = '';

  onConfirm() {
    if (this.validateInputs()) {
      this.confirm.emit(this.card);
      this.display = false;
      this.displayChange.emit(this.display);
    }
  }

  validateInputs(): boolean {
    this.errorMessage = '';

    if (!this.card.title || !this.card.imageUrl || !this.card.price || this.card.rarity === 0) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);

      return false;
    }

    return true;
  }

  onCancel() {
    this.display = false;
    this.display = false;
    this.displayChange.emit(this.display);
  }

  onPriceInput(event: Event) {
    const input = event.target as HTMLInputElement;
    
    const value = input.value.replace(/[^0-9.,]/g, '');
    input.value = value;

    this.card.price = value;
  }
}
