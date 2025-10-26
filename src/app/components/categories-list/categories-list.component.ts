import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../interfaces';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent {
  @Input() categories: ICategory[] = [];
  @Output() edit = new EventEmitter<ICategory>();
  @Output() delete = new EventEmitter<ICategory>();

  onEdit(category: ICategory) {
    this.edit.emit(category);
  }

  onDelete(category: ICategory) {
    this.delete.emit(category);
  }
}