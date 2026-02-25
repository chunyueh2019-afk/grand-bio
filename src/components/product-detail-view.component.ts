import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
    selector: 'app-product-detail-view',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-gray-50 pb-24" *ngIf="store.selectedProduct() as p">
      <!-- Top Nav -->
      <div class="sticky top-0 bg-white/80 backdrop-blur-md p-4 flex justify-between items-center z-10 border-b border-gray-100">
        <button (click)="store.setView('LIST')" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100">
          <span class="material-symbols-rounded">arrow_back_ios_new</span>
        </button>
        <span class="font-bold text-gray-800">產品詳情</span>
        <button (click)="store.toggleFavorite(p.id)" class="w-10 h-10 rounded-full flex items-center justify-center" [class.text-red-500]="p.isFavorite" [class.text-gray-400]="!p.isFavorite">
          <span class="material-symbols-rounded" [class.icon-filled]="p.isFavorite">favorite</span>
        </button>
      </div>

      <!-- Image Section -->
      <div class="bg-white p-6 flex justify-center items-center h-80 relative overflow-hidden">
        <div class="absolute inset-0 opacity-5 bg-gradient-to-br from-[#003366] to-transparent"></div>
        <img [src]="p.imageUrl || 'assets/placeholder.png'" class="max-w-full max-h-full object-contain drop-shadow-2xl z-[1]" alt="product">
      </div>

      <!-- Info Section -->
      <div class="px-6 -mt-6 relative z-[2]">
        <div class="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 mb-6">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 bg-[#003366]/10 text-[#003366] text-[10px] font-bold rounded-full uppercase">{{ p.categoryLabel }}</span>
            <span class="text-[10px] text-gray-400">ID: {{ p.id }}</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ p.name }}</h1>
          <div class="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-50">
             <div class="flex items-center gap-1"><span class="material-symbols-rounded text-lg">location_on</span> {{ p.origin || '台灣' }}</div>
             <div class="flex items-center gap-1"><span class="material-symbols-rounded text-lg">inventory_2</span> {{ p.details?.packSize || '規格載入中' }}</div>
          </div>
          <div class="text-2xl font-black text-[#003366] mb-2">NT$ {{ p.price }} <span class="text-xs font-normal text-gray-400 ml-1">建議售價</span></div>
        </div>

        <div class="space-y-4">
          <div class="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-50">
            <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm"><span class="material-symbols-rounded text-blue-500 text-lg">description</span> 產品說明</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ p.description }}</p>
          </div>

          <div class="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-50">
             <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm"><span class="material-symbols-rounded text-blue-500 text-lg">list_alt</span> 詳細資訊</h3>
             <div class="grid grid-cols-1 gap-4 text-sm">
                <div class="flex justify-between border-b border-gray-50 pb-2">
                   <span class="text-gray-400">核准字號</span>
                   <span class="font-medium text-gray-700">{{ p.permitNumber || '無' }}</span>
                </div>
                <div class="flex justify-between border-b border-gray-50 pb-2">
                   <span class="text-gray-400">條碼碼編</span>
                   <span class="font-medium text-gray-700">{{ p.barcode || '無' }}</span>
                </div>
                <div class="pt-2">
                   <span class="text-gray-400 block mb-2">主要成份</span>
                   <p class="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 italic">{{ p.details?.ingredients || '請參閱說明書' }}</p>
                </div>
             </div>
          </div>
        </div>

        <!-- DM Button -->
        <button [class.hidden]="!p.dmImageUrl" (click)="openUrl(p.dmImageUrl)"
                class="w-full mt-6 bg-[#003366] text-white p-5 rounded-2xl flex justify-center items-center gap-2 font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-transform">
          <span class="material-symbols-rounded">picture_as_pdf</span> 查看產品 PDF DM
        </button>
      </div>

      <!-- Bottom bar for actions -->
      <div class="fixed bottom-24 left-6 right-6 z-10 flex gap-4">
        <button (click)="store.addToShareList(p)" class="flex-1 bg-white border-2 border-[#003366] text-[#003366] p-4 rounded-2xl font-bold active:scale-[0.98] transition-transform">
           加入分享清單
        </button>
      </div>
    </div>
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
