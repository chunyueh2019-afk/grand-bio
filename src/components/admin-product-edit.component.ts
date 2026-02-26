import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { Product } from '../types';

@Component({
   selector: 'app-admin-product-edit',
   standalone: true,
   imports: [CommonModule, FormsModule],
   template: `
    <div class="min-h-screen bg-gray-50 p-8 text-gray-800" *ngIf="store.selectedProduct() as p">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
           <div class="flex items-center gap-4">
              <button (click)="store.setView('ADMIN')" class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm text-gray-500 hover:text-blue-600 transition-colors">
                 <span class="material-symbols-rounded">arrow_back</span>
              </button>
              <div>
                 <h1 class="text-2xl font-black text-[#003366]">編輯產品詳情</h1>
                 <p class="text-sm text-gray-400 mt-1">您可以隨時預覽變更效果</p>
              </div>
           </div>
           
           <div class="flex gap-3">
              <button (click)="store.setView('ADMIN')" class="px-6 py-2.5 rounded-xl border-2 border-gray-100 font-bold text-gray-600 hover:bg-white transition-colors" [disabled]="isLoading()">取消變更</button>
              <button (click)="save()" [disabled]="isLoading()" class="px-8 py-2.5 bg-[#003366] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center gap-2">
                 <span *ngIf="isLoading()" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 {{ isLoading() ? '儲存中...' : '儲存更改' }}
              </button>
           </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
           <!-- Left Column: Media & Core -->
           <div class="md:col-span-1 space-y-6">
              <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                 <h3 class="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">產品預覽圖</h3>
                 <div class="aspect-square rounded-2xl bg-gray-50 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all group-hover:border-blue-200">
                    <img [src]="p.imageUrl" class="max-w-full max-h-full object-contain drop-shadow-lg" alt="preview">
                    <div class="absolute inset-0 bg-[#003366]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer">
                       <span class="material-symbols-rounded text-white text-3xl">add_photo_alternate</span>
                       <span class="text-white text-[10px] font-bold">點擊更新圖片</span>
                    </div>
                 </div>
                 <div class="mt-4 space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 ml-1">圖片連結 (URL)</label>
                    <input type="text" [(ngModel)]="p.imageUrl" class="w-full text-xs p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="https://...">
                 </div>
              </div>

              <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                 <h3 class="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">快速參數</h3>
                 <div class="space-y-4">
                    <div>
                       <label class="text-[10px] font-bold text-gray-500 ml-1">建議售價 (TWD)</label>
                       <div class="relative mt-1">
                          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#003366] font-bold">$</span>
                          <input type="number" [(ngModel)]="p.price" class="w-full pl-8 p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-[#003366]">
                       </div>
                    </div>
                    <div>
                       <label class="text-[10px] font-bold text-gray-500 ml-1">產品產地</label>
                       <input type="text" [(ngModel)]="p.origin" class="w-full p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 mt-1 text-sm">
                    </div>
                 </div>
              </div>
           </div>

           <!-- Right Column: Content -->
           <div class="md:col-span-2 space-y-6">
              <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                 <div>
                    <h3 class="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">基本資訊</h3>
                    <div class="grid grid-cols-2 gap-4">
                       <div class="col-span-2">
                          <label class="text-[10px] font-bold text-gray-500 ml-1">產品全名</label>
                          <input type="text" [(ngModel)]="p.name" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 text-lg font-bold mt-1 shadow-inner">
                       </div>
                       <div>
                          <label class="text-[10px] font-bold text-gray-500 ml-1">分類標籤</label>
                          <select [(ngModel)]="p.category" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 mt-1 text-sm font-medium">
                             <option value="DRUG">醫藥服務</option>
                             <option value="FOOD">保健食品</option>
                             <option value="DEVICE">醫療器材</option>
                             <option value="DAILY">一般產品</option>
                          </select>
                       </div>
                       <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-2">
                          <div>
                             <label class="text-[10px] font-bold text-gray-500 ml-1">核准字號/証號</label>
                             <input type="text" [(ngModel)]="p.permitNumber" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 mt-1 text-sm">
                          </div>
                          <div>
                             <label class="text-[10px] font-bold text-gray-500 ml-1">產品條碼 (Barcode)</label>
                             <input type="text" [(ngModel)]="p.barcode" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 mt-1 text-sm font-mono" placeholder="請掃描或輸入條碼">
                          </div>
                       </div>
                    </div>
                 </div>

                 <div class="pt-6 border-t border-gray-50">
                    <h3 class="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">產品詳情介面資料 (JSONB)</h3>
                    <div class="grid grid-cols-2 gap-4">
                       <div class="col-span-2">
                          <label class="text-[10px] font-bold text-gray-500 ml-1">產品文案描述</label>
                          <textarea rows="4" [(ngModel)]="p.description" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 mt-1 text-sm leading-relaxed" placeholder="輸入吸引人的產品介紹..."></textarea>
                       </div>
                       <div>
                          <label class="text-[10px] font-bold text-gray-500 ml-1">主要成份</label>
                          <input type="text" [(ngModel)]="p.details!.ingredients" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 mt-1 text-sm">
                       </div>
                       <div>
                          <label class="text-[10px] font-bold text-gray-500 ml-1">包裝規格</label>
                          <input type="text" [(ngModel)]="p.details!.packSize" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 mt-1 text-sm">
                       </div>
                       <div class="col-span-2">
                          <label class="text-[10px] font-bold text-gray-500 ml-1">PDF DM 檔案路徑 (Supabase Storage)</label>
                          <div class="flex gap-2">
                             <input type="text" [(ngModel)]="p.dmImageUrl" class="flex-1 p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 mt-1 text-xs font-mono" placeholder="catalogs/product-dm.pdf">
                             <button class="px-4 py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold mt-1 active:scale-95 transition-transform"><span class="material-symbols-rounded">upload_file</span></button>
                          </div>
                       </div>
                       <div class="col-span-2">
                          <label class="text-[10px] font-bold text-gray-500 ml-1">產品詳細介紹連結 (外部網址)</label>
                          <input type="text" [(ngModel)]="p.productUrl" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 mt-1 text-xs font-mono" placeholder="https://www.example.com/product-details">
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class AdminProductEditComponent {
   store = inject(StoreService);
   isLoading = signal(false);

   async save() {
      const p = this.store.selectedProduct();
      if (!p) return;

      // 基本驗證
      if (!p.name || !p.price) {
         alert('請先填寫產品名稱與價格！');
         return;
      }

      this.isLoading.set(true);
      try {
         // 更新類別標籤 (為了視覺一致性)
         const labels: any = { 'DRUG': '醫藥服務', 'FOOD': '保健食品', 'DEVICE': '醫療器材', 'DAILY': '一般產品' };
         p.categoryLabel = labels[p.category] || '其它';

         // 同步 origin 到 details 作為備份，確保韌性
         if (!p.details) p.details = {};
         p.details['origin'] = p.origin;

         await this.store.updateProduct(p);
      } catch (error: any) {
         alert('系統錯誤：' + (error.message || '無法儲存變更'));
      } finally {
         this.isLoading.set(false);
      }
   }
}
