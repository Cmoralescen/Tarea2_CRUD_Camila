import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesFormComponent } from '../../components/categories-form/categories-form.component';
import { CategoriesSearchComponent } from '../../components/categories-search/categories-search.component';
import { CategoriesTableComponent } from '../../components/categories-table/categories-table.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { ICategory, IRoleType } from '../../interfaces';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesFormComponent,
    CategoriesSearchComponent,
    CategoriesTableComponent,
    PaginationComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categoryService: CategoryService = inject(CategoryService);
  authService: AuthService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);
  form!: FormGroup;
  isEdit: boolean = false;
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.initForm();
    this.checkUserRole();
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
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  save(category: ICategory) {
    if (this.form.valid) {
      if (this.isEdit) {
        this.categoryService.update(category);
      } else {
        this.categoryService.save(category);
      }
      this.resetForm();
    }
  }

  edit(category: ICategory) {
    this.isEdit = true;
    this.form.patchValue(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  delete(category: ICategory) {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      this.categoryService.delete(category);
    }
  }

  resetForm() {
    this.form.reset();
    this.isEdit = false;
  }

  searchCategories(filters: any) {
    console.log('Search filters:', filters);
   
    const isEmpty = !filters.name &&
                    !filters.description;
   
    if (isEmpty) {
      this.categoryService.clearFilters();
    } else {
      this.categoryService.filterCategories(filters);
    }
  }
}