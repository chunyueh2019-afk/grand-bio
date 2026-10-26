import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Product, ProductCategory, CompanyInfo } from '../types';
import { SupabaseService } from './supabase.service';

const CACHE_KEYS = {
  products: 'grand-bio.products.v1',
  company: 'grand-bio.company.v1',
  cart: 'grand-bio.cart.v1',
  history: 'grand-bio.history.v1',
  syncedAt: 'grand-bio.synced-at.v1'
} as const;

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  public supabaseService = inject(SupabaseService);

  // Navigation State
  readonly currentView = signal<'HOME' | 'LIST' | 'DETAIL' | 'ADMIN' | 'SHARE' | 'ADMIN_EDIT' | 'CATALOGS' | 'CONTACT' | 'LOGIN'>('HOME');
  readonly currentCategory = signal<ProductCategory | 'ALL' | 'FAVORITES' | 'HISTORY'>('ALL');
  readonly selectedProductId = signal<string | null>(null);

  // Connectivity & offline state
  readonly isOnline = signal(typeof navigator === 'undefined' ? true : navigator.onLine);
  readonly usingOfflineData = signal(false);
  readonly isLoading = signal(true);
  readonly lastSyncedAt = signal<string | null>(this.readCache<string>(CACHE_KEYS.syncedAt));
  readonly lastSyncedLabel = computed(() => {
    const value = this.lastSyncedAt();
    if (!value) return '尚未同步';
    return new Intl.DateTimeFormat('zh-TW', {
      month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(value));
  });

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
    this.restoreCachedState();
    this.bindConnectivityEvents();
    effect(() => this.writeCache(CACHE_KEYS.cart, this.cart()));
    effect(() => this.writeCache(CACHE_KEYS.history, this.history()));
    this.init();
    this.checkAuthStatus();
  }

  private async init() {
    await Promise.allSettled([this.loadProducts(), this.loadCompanyInfo()]);
    this.isLoading.set(false);
  }

  async checkAuthStatus() {
    try {
      const user = await this.supabaseService.getCurrentUser();
      if (user) {
        this.isLoggedIn.set(true);
        this.currentUser.set(user);
      }
    } catch {
      // Authentication is online-only; catalog browsing remains available offline.
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
      this.writeCache(CACHE_KEYS.products, mapped);
      this.usingOfflineData.set(false);
      this.markSyncComplete();
    } catch (error) {
      console.error('Error loading products:', error);
      this.usingOfflineData.set(true);
    }
  }

  async loadCompanyInfo() {
    try {
      const data = await this.supabaseService.getCompanyInfo();
      if (data) {
        const mapped = {
          name: data.name,
          slogan: data.slogan,
          address: data.address,
          phone: data.phone,
          email: data.email,
          serviceHours: data.service_hours,
          lineUrl: data.line_url
        };
        this.companyInfo.set(mapped);
        this.writeCache(CACHE_KEYS.company, mapped);
        this.markSyncComplete();
      }
    } catch (error) {
      console.error('Error loading company information:', error);
      this.usingOfflineData.set(true);
    }
  }

  private restoreCachedState() {
    const products = this.readCache<Product[]>(CACHE_KEYS.products);
    const company = this.readCache<CompanyInfo>(CACHE_KEYS.company);
    const cart = this.readCache<Product[]>(CACHE_KEYS.cart);
    const history = this.readCache<string[]>(CACHE_KEYS.history);

    if (products?.length) this.products.set(products);
    if (company) this.companyInfo.set(company);
    if (cart) this.cart.set(cart);
    if (history) this.history.set(history);
    if (!this.isOnline() && (products?.length || company)) this.usingOfflineData.set(true);
  }

  private bindConnectivityEvents() {
    if (typeof window === 'undefined') return;
    window.addEventListener('offline', () => {
      this.isOnline.set(false);
      this.usingOfflineData.set(true);
    });
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      void Promise.allSettled([this.loadProducts(), this.loadCompanyInfo()]);
    });
  }

  private markSyncComplete() {
    const now = new Date().toISOString();
    this.lastSyncedAt.set(now);
    this.writeCache(CACHE_KEYS.syncedAt, now);
  }

  private readCache<T>(key: string): T | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) as T : null;
    } catch {
      return null;
    }
  }

  private writeCache(key: string, value: unknown) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Browsing should continue even if storage is unavailable or full.
    }
  }

  readonly filteredProducts = computed(() => {
    const cat = this.currentCategory();
    if (cat === 'ALL') return this.products();
    if (cat === 'FAVORITES') return this.products().filter(p => p.isFavorite);
    if (cat === 'HISTORY') return this.history().map(id => this.products().find(p => p.id === id)).filter((p): p is Product => !!p);
    return this.products().filter(p => p.category === cat);
  });

  readonly selectedProduct = computed(() => {
    const id = this.selectedProductId();
    if (id === 'NEW') {
      return {
        id: 'NEW',
        name: '',
        category: 'DRUG',
        categoryLabel: '醫藥服務',
        price: 0,
        description: '',
        imageUrl: 'https://placehold.co/400x400/f3f4f6/003366?text=New+Product',
        origin: '台灣',
        details: {
          ingredients: '',
          packSize: ''
        },
        isFavorite: false
      } as Product;
    }
    return this.products().find(p => p.id === id) || null;
  });

  setView(view: 'HOME' | 'LIST' | 'DETAIL' | 'ADMIN' | 'SHARE' | 'ADMIN_EDIT' | 'CATALOGS' | 'CONTACT' | 'LOGIN') {
    // 導航守衛：進入管理頁面必須已登入
    if ((view === 'ADMIN' || view === 'ADMIN_EDIT') && !this.isLoggedIn()) {
      this.currentView.set('LOGIN');
      return;
    }
    this.currentView.set(view);
  }
  selectCategory(cat: any) { this.currentCategory.set(cat); this.setView('LIST'); }
  viewProduct(id: string) { this.selectedProductId.set(id); this.setView('DETAIL'); this.addToHistory(id); }
  addToHistory(id: string) { if (!this.history().includes(id)) this.history.update(h => [id, ...h.slice(0, 19)]); }
  viewCatalogs() { this.setView('CATALOGS'); }
  viewContact() { this.setView('CONTACT'); }

  async createProduct(product: Product) {
    const { id, ...newProduct } = product;

    // 基礎資料 (確保產地資訊存在於 details 中以防主欄位缺失)
    const dbBaseData: any = {
      name: newProduct.name,
      category: newProduct.category,
      category_label: newProduct.categoryLabel,
      price: newProduct.price,
      description: newProduct.description,
      image_url: newProduct.imageUrl,
      permit_number: newProduct.permitNumber,
      barcode: newProduct.barcode,
      details: {
        ...(newProduct.details || {}),
        origin: newProduct.origin
      }
    };

    try {
      // 嘗試完整新增（包含 origin 欄位）
      const fullData = { ...dbBaseData, origin: newProduct.origin };
      await this.supabaseService.addProduct(fullData);
      await this.loadProducts();
      this.setView('ADMIN');
    } catch (error: any) {
      // 如果報錯包含 origin，則嘗試不帶 origin 欄位的備份方案
      if (error.message?.includes('origin')) {
        try {
          await this.supabaseService.addProduct(dbBaseData);
          await this.loadProducts();
          this.setView('ADMIN');
          return;
        } catch (retryError: any) {
          throw retryError;
        }
      }
      throw error;
    }
  }

  toggleNotifications() {
    this.showNotifications.set(!this.showNotifications());
    if (this.showNotifications()) this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  async toggleFavorite(id: string) {
    const p = this.products().find(x => x.id === id);
    if (!p) return;
    const newState = !p.isFavorite;
    this.products.update(list => list.map(x => x.id === id ? { ...x, isFavorite: newState } : x));
    this.writeCache(CACHE_KEYS.products, this.products());
    if (!this.isOnline()) return;
    try {
      await this.supabaseService.updateProduct(id, { is_favorite: newState });
    } catch {
      this.usingOfflineData.set(true);
    }
  }

  addToShareList(p: Product) { if (!this.cart().find(x => x.id === p.id)) this.cart.update(c => [...c, p]); }
  removeFromShareList(id: string) { this.cart.update(c => c.filter(x => x.id !== id)); }
  isInCart(id: string) { return !!this.cart().find(x => x.id === id); }
  toggleCart(p: Product) { if (this.isInCart(p.id)) this.removeFromShareList(p.id); else this.addToShareList(p); }
  clearCart() { this.cart.set([]); }

  async updateProduct(updated: Product) {
    // 建立基礎更新物件
    const dbUpdate: any = {
      name: updated.name,
      category: updated.category,
      price: updated.price,
      description: updated.description,
      permit_number: updated.permitNumber,
      barcode: updated.barcode,
      image_url: updated.imageUrl,
      dm_image_url: updated.dmImageUrl,
      manual_url: updated.manualUrl,
      product_url: updated.productUrl,
      is_favorite: updated.isFavorite,
      // 將產地資訊優先存入 details JSON 中以維護韌性
      details: {
        ...(updated.details || {}),
        origin: updated.origin
      }
    };

    try {
      // 嘗試完整更新（包含 origin 欄位，以防資料庫已補齊）
      const fullUpdate = { ...dbUpdate, origin: updated.origin };
      await this.supabaseService.updateProduct(updated.id, fullUpdate);
      await this.loadProducts();
      this.setView('ADMIN');
    } catch (error: any) {
      // 如果 origin 欄位報錯，則使用不含 origin 欄位的備份方案
      if (error.message?.includes('origin')) {
        try {
          await this.supabaseService.updateProduct(updated.id, dbUpdate);
          await this.loadProducts();
          this.setView('ADMIN');
          return;
        } catch (retryError: any) {
          alert('儲存失敗 : ' + retryError.message);
          return;
        }
      }
      alert('儲存失敗 : ' + error.message);
    }
  }

  async logout() { await this.supabaseService.signOut(); this.isLoggedIn.set(false); this.currentUser.set(null); this.setView('HOME'); }
}
