import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Product, ProductCategory, CompanyInfo } from '../types';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  public supabaseService = inject(SupabaseService);

  // Navigation State
  readonly currentView = signal<'HOME' | 'LIST' | 'DETAIL' | 'ADMIN' | 'SHARE' | 'ADMIN_EDIT' | 'CATALOGS' | 'CONTACT' | 'LOGIN'>('HOME');
  readonly currentCategory = signal<ProductCategory | 'ALL' | 'FAVORITES' | 'HISTORY'>('ALL');
  readonly selectedProductId = signal<string | null>(null);

  // Auth State
  readonly isLoggedIn = signal<boolean>(false);
  readonly currentUser = signal<any>(null);

  // Data State
  readonly products = signal<Product[]>([]);
  readonly cart = signal<Product[]>([]);
  readonly history = signal<string[]>([]);
  readonly notifications = signal<{ id: string, title: string, content: string, time: string, read: boolean }[]>([
    { id: '1', title: '系統更新', content: '產品目錄已更新至最新版本', time: '1小時前', read: false },
    { id: '2', title: '推廣活動', content: '維他米系列新產品上線，歡迎查看', time: '3小時前', read: false }
  ]);
  readonly showNotifications = signal<boolean>(false);
  readonly unreadNotificationsCount = computed(() => this.notifications().filter(n => !n.read).length);

  readonly companyInfo = signal<CompanyInfo>({
    name: 'Grand.Bio 廣聯生技',
    slogan: '您專業的醫藥合作夥伴',
    address: '台北市內湖區科技大道123號5樓',
    phone: '0800-888-999',
    email: 'service@grand.bio',
    serviceHours: '週一至週五 09:00-18:00',
    lineUrl: '#'
  });

  constructor() {
    this.init();
    this.checkAuthStatus();
  }

  private async init() {
    try {
      await this.loadProducts();
      await this.loadCompanyInfo();
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  }

  async checkAuthStatus() {
    const user = await this.supabaseService.getCurrentUser();
    if (user) {
      this.isLoggedIn.set(true);
      this.currentUser.set(user);
    }
  }

  async loadProducts() {
    try {
      const data = await this.supabaseService.getProducts();
      const mapped = (data || []).map((p: any) => ({
        ...p,
        categoryLabel: p.category_label,
        permitNumber: p.permit_number,
        imageUrl: p.image_url,
        dmImageUrl: p.dm_image_url,
        manualUrl: p.manual_url,
        productUrl: p.product_url,
        origin: p.origin || p.details?.origin,
        details: p.details || {},
        isFavorite: p.is_favorite
      }));
      this.products.set(mapped);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  async loadCompanyInfo() {
    const data = await this.supabaseService.getCompanyInfo();
    if (data) {
      this.companyInfo.set({
        name: data.name,
        slogan: data.slogan,
        address: data.address,
        phone: data.phone,
        email: data.email,
        serviceHours: data.service_hours,
        lineUrl: data.line_url
      });
    }
  }

  readonly filteredProducts = computed(() => {
    const cat = this.currentCategory();
    if (cat === 'ALL') return this.products();
    if (cat === 'FAVORITES') return this.products().filter(p => p.isFavorite);
    if (cat === 'HISTORY') return this.history().map(id => this.products().find(p => p.id === id)).filter((p): p is Product => !!p);
    return this.products().filter(p => p.category === cat);
  });

  readonly selectedProduct = computed(() => this.products().find(p => p.id === this.selectedProductId()) || null);

  setView(view: any) { this.currentView.set(view); }
  selectCategory(cat: any) { this.currentCategory.set(cat); this.setView('LIST'); }
  viewProduct(id: string) { this.selectedProductId.set(id); this.setView('DETAIL'); this.addToHistory(id); }
  addToHistory(id: string) { if (!this.history().includes(id)) this.history.update(h => [id, ...h.slice(0, 19)]); }
  viewCatalogs() { this.setView('CATALOGS'); }
  viewContact() { this.setView('CONTACT'); }
  toggleNotifications() {
    this.showNotifications.set(!this.showNotifications());
    if (this.showNotifications()) this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  async toggleFavorite(id: string) {
    const p = this.products().find(x => x.id === id);
    if (!p) return;
    const newState = !p.isFavorite;
    await this.supabaseService.updateProduct(id, { is_favorite: newState });
    this.products.update(list => list.map(x => x.id === id ? { ...x, isFavorite: newState } : x));
  }

  addToShareList(p: Product) { if (!this.cart().find(x => x.id === p.id)) this.cart.update(c => [...c, p]); }
  removeFromShareList(id: string) { this.cart.update(c => c.filter(x => x.id !== id)); }

  async updateProduct(updated: Product) {
    // 將前端 camelCase 映射回資料庫 snake_case
    const dbUpdate: any = {
      name: updated.name,
      category: updated.category,
      price: updated.price,
      origin: updated.origin,
      description: updated.description,
      permit_number: updated.permitNumber,
      barcode: updated.barcode,
      image_url: updated.imageUrl,
      dm_image_url: updated.dmImageUrl,
      manual_url: updated.manualUrl,
      product_url: updated.productUrl,
      category_label: updated.categoryLabel,
      is_favorite: updated.isFavorite,
      details: updated.details || {}
    };

    try {
      await this.supabaseService.updateProduct(updated.id, dbUpdate);
      await this.loadProducts();
      this.setView('ADMIN');
    } catch (error: any) {
      alert('儲存失敗：' + error.message);
    }
  }

  async logout() { await this.supabaseService.signOut(); this.isLoggedIn.set(false); this.currentUser.set(null); this.setView('HOME'); }
}
