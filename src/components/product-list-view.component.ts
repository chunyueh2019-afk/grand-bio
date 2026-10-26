import { Component, computed, inject, signal } from '@angular/core';

import { StoreService } from '../services/store.service';
import { ProductCategory } from '../types';

@Component({
    selector: 'app-product-list-view',
    imports: [],
    template: `
    <div class="pb-24">
      <!-- Search & Filter Area -->
      <div class="sticky top-0 bg-white shadow-sm z-30 p-4 border-b border-gray-100">
        <div class="max-w-md mx-auto relative mb-4">
           <span class="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
           <input type="text" placeholder="搜尋產品名稱、証號..." 
                  [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)"
                  class="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#003366]/20 transition-all text-sm font-medium">
        </div>
        
        <div class="flex overflow-x-auto gap-2 pb-2 scrollbar-hide no-scrollbar">
           @for (cat of categories; track cat.id) {
              <button (click)="store.currentCategory.set(cat.id)" [class.bg-[#003366]]="store.currentCategory() === cat.id" [class.text-white]="store.currentCategory() === cat.id" [class.bg-gray-100]="store.currentCategory() !== cat.id" [class.text-gray-500]="store.currentCategory() !== cat.id" class="px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95">
                 {{ cat.label }}
              </button>
           }
        </div>
      </div>

      <!-- Products Grid -->
      <div class="p-4 grid grid-cols-2 gap-4 mt-2">
         @for (p of visibleProducts(); track p.id) {
            <div (click)="store.viewProduct(p.id)" class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 flex flex-col group active:scale-[0.98] transition-all">
               <div class="h-40 bg-gray-50 p-4 flex items-center justify-center relative">
                  <img [src]="p.imageUrl" class="max-w-full max-h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" alt="p">
                  <button (click)="$event.stopPropagation(); store.toggleFavorite(p.id)" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                     <span class="material-symbols-rounded text-lg" [class.text-red-500]="p.isFavorite" [class.text-gray-300]="!p.isFavorite" [class.icon-filled]="p.isFavorite">favorite</span>
                  </button>
               </div>
               <div class="p-4 flex-1 flex flex-col">
                  <span class="text-[9px] font-black text-[#003366] uppercase opacity-60 tracking-tighter mb-1">{{ p.categoryLabel }}</span>
                  <h3 class="font-bold text-gray-800 text-sm line-clamp-2 mb-2 leading-tight flex-1">{{ p.name }}</h3>
                  <div class="flex items-center justify-between mt-auto">
                     <span class="text-sm font-black text-[#003366]">NT$ {{ p.price }}</span>
                     <span class="w-6 h-6 rounded-lg bg-[#003366]/5 text-[#003366] flex items-center justify-center">
                        <span class="material-symbols-rounded text-sm">chevron_right</span>
                     </span>
                  </div>
               </div>
            </div>
         } @empty {
            <div class="col-span-2 py-20 text-center space-y-4">
               <span class="material-symbols-rounded text-6xl text-gray-200">{{ store.isLoading() ? 'progress_activity' : 'inventory_2' }}</span>
               <p class="text-gray-400 font-medium">{{ emptyMessage() }}</p>
               @if (!store.isOnline()) {
                 <p class="text-xs text-amber-600">恢復連線後將自動同步最新產品</p>
               }
            </div>
         }
      </div>
    </div>
  `
})
export class ProductListViewComponent {
   store = inject(StoreService);
   searchQuery = signal('');
   visibleProducts = computed(() => {
      const query = this.searchQuery().trim().toLocaleLowerCase('zh-Hant');
      if (!query) return this.store.filteredProducts();
      return this.store.filteredProducts().filter(product =>
         [product.name, product.permitNumber, product.categoryLabel, product.origin]
            .filter(Boolean)
            .some(value => value!.toLocaleLowerCase('zh-Hant').includes(query))
      );
   });
   emptyMessage = computed(() => {
      if (this.store.isLoading()) return '正在同步產品資料…';
      if (this.searchQuery().trim()) return '找不到符合搜尋條件的產品';
      if (!this.store.isOnline()) return '尚無可用的離線產品資料';
      return '目前分類尚無項目';
   });
   categories: { id: ProductCategory; label: string }[] = [
      { id: 'ALL', label: '全部產品' },
      { id: 'DRUG', label: '醫藥服務' },
      { id: 'FOOD', label: '保健食品' },
      { id: 'DEVICE', label: '醫療器材' },
      { id: 'DAILY', label: '一般產品' }
   ];
}
