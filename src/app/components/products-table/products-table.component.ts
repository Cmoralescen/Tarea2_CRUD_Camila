import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../interfaces';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent {
  @Input() products: IProduct[] = [];
  @Input() areActionsAvailable: boolean = false;
  @Output() callEditMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Output() callDeleteMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
}