import { inject, Injectable, signal } from '@angular/core';
import { IProduct, IResponse, ISearch } from '../interfaces';
import { BaseService } from './base-service';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<IProduct> {
  protected override source: string = 'products';
  private productSignal = signal<IProduct[]>([]);
  private allProducts: IProduct[] = []; 
  
  get products$() {
    return this.productSignal;
  }

  public search: ISearch = { 
    page: 1,
    size: 10
  }
  
  public totalItems: any = [];
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);
  private categoryService: CategoryService = inject(CategoryService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: IResponse<IProduct[]>) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
        
        const productPromises = response.data.map(product => 
          this.getProductById(product.id!).toPromise()
        );
        
        Promise.all(productPromises).then(detailedProducts => {
          const productsWithCategory = detailedProducts.map((detailResponse: any) => {
            const detail = detailResponse.data;
            const category = this.categoryService.categories$().find(
              cat => cat.id === detail.categoryId
            );
            
            return {
              id: detail.id,
              name: detail.name,
              description: detail.description,
              price: detail.price,
              stock: detail.stock,
              category: category
            } as IProduct;
          });
          
          this.allProducts = productsWithCategory;
          this.productSignal.set(productsWithCategory);
        });
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  getProductById(id: number) {
    return this.http.get<IResponse<any>>(`${this.source}/${id}`);
  }

  filterProducts(filters: any) {
    let filteredProducts = [...this.allProducts];

    if (filters.name && filters.name.trim() !== '') {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.categoryId && filters.categoryId !== '') {
      const categoryId = parseInt(filters.categoryId);
      filteredProducts = filteredProducts.filter(product =>
        product.category?.id === categoryId
      );
    }

    if (filters.minPrice && filters.minPrice !== '') {
      const minPrice = parseFloat(filters.minPrice);
      filteredProducts = filteredProducts.filter(product =>
        product.price >= minPrice
      );
    }

    if (filters.maxPrice && filters.maxPrice !== '') {
      const maxPrice = parseFloat(filters.maxPrice);
      filteredProducts = filteredProducts.filter(product =>
        product.price <= maxPrice
      );
    }

    this.productSignal.set(filteredProducts);
  }

  clearFilters() {
    this.productSignal.set(this.allProducts);
  }

  save(item: IProduct, categoryId: number) {
    this.addWithParams({ categoryId }, item).subscribe({
      next: (response: IResponse<IProduct>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred while adding the product!!!!', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(item: IProduct, categoryId: number) {
    const params = this.buildUrlParams({ categoryId });
    this.http.put<IResponse<IProduct>>(`${this.source}/${item.id}`, item, { params }).subscribe({
      next: (response: IResponse<IProduct>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred while updating the product!!!!', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  delete(item: IProduct) {
    this.del(item.id).subscribe({
      next: (response: IResponse<IProduct>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred while deleting the product!!!!', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }
}