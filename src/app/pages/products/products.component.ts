import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductFormComponent } from '../../components/products-form/products-form.component';
import { ProductsTableComponent } from '../../components/products-table/products-table.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { IProduct } from '../../interfaces';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductFormComponent,
    ProductsTableComponent,
    PaginationComponent
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productService: ProductService = inject(ProductService);
  categoryService: CategoryService = inject(CategoryService);
  private fb: FormBuilder = inject(FormBuilder);

  form!: FormGroup;
  isEdit: boolean = false;
  areActionsAvailable: boolean = true; // Cambiar según el rol del usuario

  ngOnInit(): void {
    this.initForm();
    this.productService.getAll();
    this.categoryService.getAll();
  }

  initForm() {
    this.form = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', [Validators.required]]
    });
  }

  save(product: IProduct) {
    if (this.form.valid) {
      const categoryId = this.form.get('categoryId')?.value;
      
      if (this.isEdit) {
        this.productService.update(product, categoryId);
      } else {
        this.productService.save(product, categoryId);
      }
      this.resetForm();
    }
  }

  edit(product: IProduct) {
    this.isEdit = true;
    this.form.patchValue({
      ...product,
      categoryId: product.category?.id
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  delete(product: IProduct) {
    if (confirm(`Are you sure you want to delete the product "${product.name}"?`)) {
      this.productService.delete(product);
    }
  }

  resetForm() {
    this.form.reset();
    this.isEdit = false;
  }
}