import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductFormComponent } from '../../components/products-form/products-form.component';
import { ProductSearchComponent } from '../../components/products-search/products-search.component';
import { ProductsTableComponent } from '../../components/products-table/products-table.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { IProduct, IRoleType } from '../../interfaces';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductFormComponent,
    ProductSearchComponent,
    ProductsTableComponent,
    PaginationComponent
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productService: ProductService = inject(ProductService);
  categoryService: CategoryService = inject(CategoryService);
  authService: AuthService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);

  form!: FormGroup;
  isEdit: boolean = false;
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.initForm();
    this.checkUserRole();
    this.productService.getAll();
    this.categoryService.getAll();
  }

  checkUserRole() {
    this.isAdmin = this.authService.hasRole(IRoleType.admin) || 
                   this.authService.hasRole(IRoleType.superAdmin);
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
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
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

  searchProducts(filters: any) {
    console.log('Search filters:', filters);
    
    const isEmpty = !filters.name && 
                    !filters.categoryId && 
                    !filters.minPrice && 
                    !filters.maxPrice;
    
    if (isEmpty) {
      this.productService.clearFilters();
    } else {
      this.productService.filterProducts(filters);
    }
  }
}