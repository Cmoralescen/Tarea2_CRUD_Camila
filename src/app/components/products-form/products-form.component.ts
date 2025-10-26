import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IProduct, ICategory } from '../../interfaces';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductFormComponent {
  @Input() form!: FormGroup;
  @Input() isEdit: boolean = false;
  @Input() categories: ICategory[] = [];
  @Output() callSaveMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
}