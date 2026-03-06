import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';
import { ProductCategory } from '../types';

@Component({
   selector: 'app-product-list-view',
   standalone: true,
   imports: [CommonModule],
   template: `
    <div class="pb-24 view-enter">
      <!-- Search & Filter Area -->
      <div class="sticky top-0 glass-effect z-30 px-6 py-5 border-b border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="max-w-md mx-auto relative mb-5">
           <span class="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#003366] transition-colors">search</span>
           <input type="text" placeholder="搜尋產品名稱、証號..." 
                  class="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:ring-4 focus:ring-[#003366]/5 focus:border-[#003366]/10 transition-all text-sm font-semibold text-gray-800 placeholder:text-gray-400">
        </div>
        
        <div class="flex overflow-x-auto gap-3 pb-1 scrollbar-hide no-scrollbar -mx-2 px-2">
           @for (cat of categories; track cat.id) {
              <button (click)="store.currentCategory.set(cat.id)" 
                      [ngClass]="{
                        'bg-[#003366] text-white shadow-lg shadow-blue-900/20': store.currentCategory() === cat.id,
                        'bg-white text-gray-500 border-gray-100': store.currentCategory() !== cat.id
                      }"
                      class="px-5 py-2.5 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all active:scale-95 border uppercase tracking-wider">
                 {{ cat.label }}
              </button>
           }
        </div>
      </div>

      <!-- Products Grid -->
      <div class="p-6 grid grid-cols-2 gap-5 mt-2">
         @for (p of store.filteredProducts(); track p.id) {
            <div (click)="store.viewProduct(p.id)" 
                 class="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-50 flex flex-col group active:scale-[0.97] transition-all hover:shadow-xl hover:translate-y-[-4px] cursor-pointer">
               <div class="h-44 bg-[#f8fafc] p-6 flex items-center justify-center relative overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img [src]="p.imageUrl" class="max-w-full max-h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" alt="p">
                  
                  <button (click)="$event.stopPropagation(); store.toggleFavorite(p.id)" 
                          class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center shadow-sm border border-white/50 hover:bg-white transition-colors">
                     <span class="material-symbols-rounded text-xl" 
                           [class.text-rose-500]="p.isFavorite" 
                           [class.text-gray-300]="!p.isFavorite" 
                           [class.icon-filled]="p.isFavorite">favorite</span>
                  </button>
               </div>
               
               <div class="p-5 flex-1 flex flex-col">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-blue-50 text-[8px] font-black text-[#003366] uppercase tracking-widest rounded-md border border-blue-100/50">{{ p.categoryLabel }}</span>
                    @if (p.origin) {
                      <span class="text-[8px] font-bold text-gray-400 capitalize">{{ p.origin }}</span>
                    }
                  </div>
                  
                  <h3 class="font-black text-gray-800 text-[13px] line-clamp-2 mb-3 leading-snug flex-1 group-hover:text-[#003366] transition-colors">{{ p.name }}</h3>
                  
                  <div class="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold mb-4">
                     <span class="material-symbols-rounded text-[11px] opacity-70">qr_code_scanner</span>
                     <span class="font-mono tracking-tight">{{ p.barcode || 'NO BARCODE' }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                     <div class="flex flex-col">
                        <span class="text-[8px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Price (TWD)</span>
                        <span class="text-sm font-black text-[#003366]">NT$ {{ p.price }}</span>
                     </div>
                     <div class="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-[#003366] group-hover:text-white transition-all shadow-inner">
                        <span class="material-symbols-rounded text-base">arrow_forward</span>
                     </div>
                  </div>
               </div>
            </div>
         } @empty {
            <div class="col-span-2 py-24 text-center flex flex-col items-center">
               <div class="w-24 h-24 bg-gradient-to-br from-blue-50 to-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,51,102,0.06)] flex items-center justify-center mb-8 border border-blue-100/50 relative">
                 <div class="absolute inset-0 bg-white/40 blur-sm rounded-[2rem]"></div>
                 <span class="material-symbols-rounded text-5xl text-blue-200 relative z-10 drop-shadow-sm">search_off</span>
               </div>
               <h3 class="text-2xl font-black text-[#003366] mb-3 tracking-tight">目前尚無產品</h3>
               <p class="text-[13px] text-gray-400 font-bold tracking-wide max-w-xs leading-relaxed">這個分類目前似乎沒有建立任何商品，或是未開放閱覽。</p>
            </div>
         }
      </div>
    </div>
  `
})
export class ProductListViewComponent {
   store = inject(StoreService);
   categories: { id: ProductCategory; label: string }[] = [
      { id: 'ALL', label: '全部產品' },
      { id: 'DRUG', label: '醫藥服務' },
      { id: 'FOOD', label: '保健食品' },
      { id: 'DEVICE', label: '醫療器材' },
      { id: 'DAILY', label: '一般產品' }
   ];
}
