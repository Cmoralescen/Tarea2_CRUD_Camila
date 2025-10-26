import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../interfaces';

@Component({
  selector: 'app-categories-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-table.component.html',
  styleUrl: './categories-table.component.scss'
})
export class CategoriesTableComponent {
  @Input() categories: ICategory[] = [];
  @Input() areActionsAvailable: boolean = false;
  @Output() callEditMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
  @Output() callDeleteMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
}