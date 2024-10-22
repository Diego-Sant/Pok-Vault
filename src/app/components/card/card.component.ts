import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { Card } from '../../../types';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RatingModule, FormsModule, CommonModule, ButtonModule, ConfirmPopupModule],
  providers: [ConfirmationService],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CardComponent {
  @Input() card!: Card;
  @Output() edit: EventEmitter<Card> = new EventEmitter<Card>();
  @Output() delete: EventEmitter<Card> = new EventEmitter<Card>();

  constructor( private authService: AuthService,
  private confirmationService: ConfirmationService, 
  private el: ElementRef) {}

  // ----------------------------Auth, Editar e Excluir------------------------------------ //

  @ViewChild('deleteButton') deleteButton: any;
  currentUserId: string | null = null;
  private userSubscription: Subscription | undefined;

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.id || null;
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  editCard() {
    this.edit.emit(this.card);
  }

  confirmDelete() {
    this.confirmationService.confirm({
      target: this.deleteButton.nativeElement,
      message: "Tem certeza que deseja excluir essa carta?",
      acceptLabel: "Excluir",
      rejectLabel: "Voltar",
      accept: () => {
        this.deleteCard();
      }
    })
  }

  deleteCard() {
    this.delete.emit(this.card);
  }

  // ----------------------------Modal------------------------------------ //

  isModalOpen: boolean = false;

  openModal() {
    this.isModalOpen = true;
    this.cards.forEach(card => card.classList.remove('animated'));
  }

  closeModal() {
    this.isModalOpen = false;
    this.cards.forEach(card => card.classList.add('animated'));
  }

  // ----------------------------Estilos------------------------------------ //
  
  x: any;
  cards: HTMLElement[] = [];

  ngAfterViewInit() {
    this.cards = Array.from(this.el.nativeElement.querySelectorAll('.card'));
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.handleMouseMove(event);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    this.handleMouseMove(event);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd() {
    this.resetStyles();
  }

  private handleMouseMove(event: MouseEvent | TouchEvent) {
    if (this.isModalOpen) {
      return;
    }

    const pos = event instanceof MouseEvent
      ? [event.offsetX, event.offsetY]
      : [event.touches[0].clientX, event.touches[0].clientY];
    
    event.preventDefault();

    this.cards.forEach(card => {
      const l = pos[0];
      const t = pos[1];
      const h = card.clientHeight;
      const w = card.clientWidth;
      const px = Math.abs(Math.floor(100 / w * l) - 100);
      const py = Math.abs(Math.floor(100 / h * t) - 100);
      
      const pa = (50 - px) + (50 - py);
      
      const lp = (50 + (px - 50) / 1.5);
      const tp = (50 + (py - 50) / 1.5);
      const px_spark = (50 + (px - 50) / 7);
      const py_spark = (50 + (py - 50) / 7);
      const p_opc = 20 + (Math.abs(pa) * 1.5);
      const ty = ((tp - 50) / 2) * -1;
      const tx = ((lp - 50) / 1.5) * 0.5;

      const gradPos = `${(l / w) * 100}% ${(t / h) * 100}%`;
      const sprkPos = `${px_spark}% ${py_spark}%`;
      const opc = p_opc / 100;
      const tf = `rotateX(${ty}deg) rotateY(${tx}deg)`;

      card.style.setProperty('--grad-pos', gradPos);
      card.classList.add('active');

      card.style.transform = tf;
      card.classList.remove('active');
      card.classList.remove('animated');

      const style = `
        .card:hover:before { background-position: ${gradPos}; }
        .card:hover:after { background-position: ${sprkPos}; opacity: ${opc}; }
      `;
      this.setHoverStyles(style);
    });
    
    clearTimeout(this.x);
  }

  private resetStyles() {
    this.cards.forEach(card => {
      card.removeAttribute('style');
      card.classList.remove('active');
      this.x = setTimeout(() => {
        card.classList.add('animated');
      }, 2500);
    });
  }

  private setHoverStyles(style: string) {
    const styleTag = this.el.nativeElement.querySelector('.hover');
    if (styleTag) {
      styleTag.innerHTML = style;
    }
  }
}
