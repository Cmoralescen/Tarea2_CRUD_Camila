import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICategory } from '../../interfaces';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-search.component.html',
  styleUrls: ['./products-search.component.scss']
})
export class ProductSearchComponent {
  @Input() categories: ICategory[] = [];
  @Output() callSearchMethod: EventEmitter<any> = new EventEmitter<any>();

  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      name: [''],
      categoryId: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  search() {
    const filters = this.searchForm.value;
    this.callSearchMethod.emit(filters);
  }

  clearSearch() {
    this.searchForm.reset();
    this.callSearchMethod.emit({});
  }
}