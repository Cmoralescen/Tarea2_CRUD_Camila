import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesFormComponent } from '../../components/categories-form/categories-form.component';
import { CategoriesTableComponent } from '../../components/categories-table/categories-table.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CategoryService } from '../../services/category.service';
import { ICategory } from '../../interfaces';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesFormComponent,
    CategoriesTableComponent,
    PaginationComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categoryService: CategoryService = inject(CategoryService);
  private fb: FormBuilder = inject(FormBuilder);

  form!: FormGroup;
  isEdit: boolean = false;
  areActionsAvailable: boolean = true;

  ngOnInit(): void {
    this.initForm();
    this.categoryService.getAll();
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
}