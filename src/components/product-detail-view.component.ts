import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-product-detail-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (store.selectedProduct(); as p) {
    <div class="min-h-screen bg-[#fcfdfe] pb-24 view-enter">
      <!-- Top Nav -->
      <div class="sticky top-0 glass-effect p-6 flex justify-between items-center z-20 border-b border-gray-100/50">
        <button (click)="store.setView('LIST')" class="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#003366] transition-all active:scale-90">
          <span class="material-symbols-rounded">arrow_back_ios_new</span>
        </button>
        <span class="font-black text-[#003366] tracking-tight">產品規格詳情</span>
        <button (click)="store.toggleFavorite(p.id)" class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90" [class.text-rose-500]="p.isFavorite" [class.text-gray-300]="!p.isFavorite">
          <span class="material-symbols-rounded text-2xl" [class.icon-filled]="p.isFavorite">favorite</span>
        </button>
      </div>

      <!-- Main Content Container -->
      <div class="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        <!-- Hero Section: Image & Basic Info -->
        <div class="bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <!-- Image Side -->
            <div class="bg-gray-50/50 p-10 flex justify-center items-center aspect-square relative group">
              <div class="absolute inset-0 bg-gradient-to-tr from-[#003366]/5 to-transparent"></div>
              <img [src]="p.imageUrl || 'assets/placeholder.png'" 
                   class="max-w-full max-h-full object-contain drop-shadow-2xl z-[1] group-hover:scale-105 transition-transform duration-1000" alt="product">
            </div>
            
            <!-- Basic Info Side -->
            <div class="p-10 flex flex-col justify-center">
              <div class="flex items-center gap-3 mb-6">
                 <span class="px-4 py-1.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-full uppercase tracking-widest border border-blue-100/50">{{ p.categoryLabel }}</span>
                 <span class="text-[9px] font-bold text-gray-300 tracking-tighter uppercase">UID: {{ p.id }}</span>
              </div>
              
              <h1 class="text-3xl font-black text-gray-800 mb-4 tracking-tight leading-tight">{{ p.name }}</h1>
              
              <div class="flex flex-wrap items-center gap-6 mb-8">
                 <div class="flex items-center gap-2 group">
                    <div class="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                       <span class="material-symbols-rounded text-lg">public</span>
                    </div>
                    <div class="flex flex-col">
                       <span class="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Origin</span>
                       <span class="text-sm font-bold text-gray-600">{{ p.origin || '台灣' }}</span>
                    </div>
                 </div>
                 <div class="flex items-center gap-2 group">
                    <div class="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                       <span class="material-symbols-rounded text-lg">inventory_2</span>
                    </div>
                    <div class="flex flex-col">
                       <span class="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Spec</span>
                       <span class="text-sm font-bold text-gray-600">{{ p.details?.packSize || '標準包裝' }}</span>
                    </div>
                 </div>
              </div>

              <div class="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                 <div>
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Recommended Price</span>
                    <div class="text-3xl font-black text-[#003366] tracking-tighter">NT$ {{ p.price }}</div>
                 </div>
                 <div class="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-200">
                    <span class="material-symbols-rounded text-2xl">verified</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <!-- Description -->
           <div class="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 h-full">
              <h3 class="text-[11px] font-black text-blue-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                 <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                 產品文案描述
              </h3>
              <p class="text-[13px] text-gray-500 font-medium leading-[1.8]">{{ p.description }}</p>
           </div>

           <!-- Specs Table -->
           <div class="bg-[#003366] p-10 rounded-[2.5rem] shadow-xl text-white h-full relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h3 class="text-[11px] font-black text-blue-300 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                 <span class="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                 臨床規格概要
              </h3>
              <div class="space-y-6">
                 <div>
                    <span class="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">核准許可字號</span>
                    <span class="text-xs font-black tracking-wide">{{ p.permitNumber || 'N/A' }}</span>
                 </div>
                 <div>
                    <span class="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">全球商品條碼</span>
                    <span class="text-xs font-mono font-bold">{{ p.barcode || 'N/A' }}</span>
                 </div>
                 <div class="pt-4 border-t border-white/10">
                    <span class="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">主成份與配方</span>
                    <p class="text-xs font-medium leading-relaxed text-white/80 p-4 bg-white/5 rounded-2xl italic">
                       {{ p.details?.ingredients || '請參閱說明書記載之配方' }}
                    </p>
                 </div>
              </div>
           </div>
        </div>

        <!-- Bottom Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 pt-10 border-t border-gray-100">
          <button (click)="store.toggleCart(p)" 
                  class="md:col-span-1 p-6 rounded-[2rem] flex justify-center items-center gap-3 font-black text-xs transition-all active:scale-[0.95] shadow-xl"
                  [class.bg-rose-50]="store.isInCart(p.id)"
                  [class.text-rose-600]="store.isInCart(p.id)"
                  [class.border]="store.isInCart(p.id)"
                  [class.border-rose-100]="store.isInCart(p.id)"
                  [class.bg-[#003366]]="!store.isInCart(p.id)"
                  [class.text-white]="!store.isInCart(p.id)">
            <span class="material-symbols-rounded text-xl" [class.icon-filled]="store.isInCart(p.id)">
              {{ store.isInCart(p.id) ? 'do_not_disturb_on' : 'add_circle' }}
            </span> 
            {{ store.isInCart(p.id) ? '從分享清單移除' : '加入分享清單' }}
          </button>

          @if (p.productUrl) {
            <button (click)="openUrl(p.productUrl)" class="md:col-span-1 bg-white text-gray-700 p-6 rounded-[2rem] border border-gray-100 flex justify-center items-center gap-3 font-black text-xs shadow-lg hover:bg-gray-50 transition-all active:scale-[0.97]">
              <span class="material-symbols-rounded text-xl text-blue-500">public</span> 預覽官方介紹
            </button>
          }

          @if (p.dmImageUrl) {
            <button (click)="openUrl(p.dmImageUrl)" class="md:col-span-1 bg-emerald-50 text-emerald-700 p-6 rounded-[2rem] border border-emerald-100 flex justify-center items-center gap-3 font-black text-xs shadow-lg shadow-emerald-900/5 hover:bg-emerald-100 transition-all active:scale-[0.97]">
              <span class="material-symbols-rounded text-xl">picture_as_pdf</span> 下載產品內容 DM
            </button>
          }
        </div>
      </div>
    </div>
    }
  `,
  styles: [`
    .shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05); }
  `]
})
export class ProductDetailViewComponent {
  store = inject(StoreService);

  openUrl(url: any) {
    if (url) window.open(url, '_blank');
  }
}
