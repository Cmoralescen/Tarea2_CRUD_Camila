import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories-search.component.html',
  styleUrl: './categories-search.component.scss'
})
export class CategoriesSearchComponent {
  @Output() callSearchMethod: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      description: ['']
    });
  }

  search() {
    this.callSearchMethod.emit(this.form.value);
  }
}