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