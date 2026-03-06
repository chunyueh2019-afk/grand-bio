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
    @let p = store.selectedProduct();
    @if (p) {
    <div class="min-h-screen bg-[#f8fafc] p-10 text-gray-800 view-enter">
      <div class="max-w-5xl mx-auto">
        <!-- Breadcrumbs / Top Navbar -->
        <div class="flex items-center justify-between mb-10 overflow-visible">
           <div class="flex items-center gap-5">
              <button (click)="store.setView('ADMIN')" 
                      class="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-90">
                 <span class="material-symbols-rounded">arrow_back</span>
              </button>
               <div>
                  <h1 class="text-3xl font-black text-[#003366] tracking-tight">{{ store.selectedProductId() === 'NEW' ? '建立新產品' : '產品規格維護' }}</h1>
                  <p class="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{{ store.selectedProductId() === 'NEW' ? 'Register New Medical Inventory' : 'Manage Specification & Identity' }}</p>
               </div>
           </div>
           
           <div class="flex gap-4">
              <button (click)="store.setView('ADMIN')" 
                      class="px-7 py-3 rounded-2xl border-2 border-gray-100 font-black text-gray-500 hover:bg-white hover:text-gray-800 transition-all active:scale-[0.97]" 
                      [disabled]="isLoading()">放棄變更</button>
              <button (click)="save()" [disabled]="isLoading()" 
                      class="px-10 py-3 bg-[#003366] text-white rounded-2xl font-black shadow-2xl shadow-blue-900/40 active:scale-[0.97] transition-all flex items-center gap-3 relative overflow-hidden group">
                 <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 @if (isLoading()) {<span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                 {{ isLoading() ? '處理中...' : '提交變更' }}
              </button>
           </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <!-- Left Column: Media & Core -->
           <div class="lg:col-span-4 space-y-8">
              <div class="bg-white p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden group">
                 <h3 class="text-[10px] font-black uppercase text-blue-500 mb-5 tracking-[0.2em] flex items-center gap-2">
                    <span class="w-1 h-1 rounded-full bg-blue-500"></span>
                    媒體資產管理
                 </h3>
                 <div class="aspect-square rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-all group-hover:border-blue-400 group-hover:bg-blue-50/10">
                    <img [src]="p.imageUrl" class="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105" alt="preview">
                    <div class="absolute inset-0 bg-[#003366]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 cursor-pointer backdrop-blur-sm">
                       <div class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                         <span class="material-symbols-rounded text-white text-3xl">cloud_upload</span>
                       </div>
                       <span class="text-white text-xs font-black tracking-wide">更換圖片 (URL)</span>
                    </div>
                 </div>
                 <div class="mt-6 space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IMAGE SOURCE URL</label>
                    <input type="text" [(ngModel)]="p.imageUrl" 
                           class="w-full text-xs p-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-700 font-mono" 
                           placeholder="https://static.grand.bio/images/...">
                 </div>
              </div>

              <div class="bg-white p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-100">
                 <h3 class="text-[10px] font-black uppercase text-blue-500 mb-5 tracking-[0.2em] flex items-center gap-2">
                    <span class="w-1 h-1 rounded-full bg-blue-500"></span>
                    核心商務指標
                 </h3>
                 <div class="space-y-6">
                    <div>
                       <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">RETAIL PRICE (TWD)</label>
                       <div class="relative mt-2">
                          <span class="absolute left-5 top-1/2 -translate-y-1/2 text-[#003366] font-black opacity-30">$</span>
                          <input type="number" [(ngModel)]="p.price" 
                                 class="w-full pl-10 p-4 bg-[#f1f5f9]/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all font-black text-lg text-[#003366]">
                       </div>
                    </div>
                    <div>
                       <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ORIGIN / COUNTRY</label>
                       <div class="relative mt-2 group">
                          <span class="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg group-focus-within:text-blue-500 transition-colors">public</span>
                          <input type="text" [(ngModel)]="p.origin" 
                                 class="w-full pl-12 p-4 bg-[#f1f5f9]/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold"
                                 placeholder="e.g. Taiwan, Germany">
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Right Column: Content -->
           <div class="lg:col-span-8 space-y-8">
              <div class="bg-white p-10 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-gray-100 space-y-10">
                 <div>
                    <h3 class="text-[10px] font-black uppercase text-blue-500 mb-6 tracking-[0.2em] flex items-center gap-2">
                       <span class="w-1 h-1 rounded-full bg-blue-500"></span>
                       基本識別資訊 IDENTITIES
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div class="md:col-span-2">
                          <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PRODUCT FULL NAME / 產品名稱</label>
                          <input type="text" [(ngModel)]="p.name" 
                                 class="w-full p-5 bg-[#f1f5f9]/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 text-xl font-black mt-2 transition-all"
                                 placeholder="請輸入產品正式名稱...">
                       </div>
                       <div>
                          <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SYSTEM CATEGORY / 分類</label>
                          <select [(ngModel)]="p.category" 
                                  class="w-full p-5 bg-[#f1f5f9]/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 mt-2 text-sm font-black transition-all appearance-none">
                             <option value="DRUG">醫藥服務 (Drug & Services)</option>
                             <option value="FOOD">保健食品 (Health Supplements)</option>
                             <option value="DEVICE">醫療器材 (Medical Devices)</option>
                             <option value="DAILY">一般產品 (Daily Products)</option>
                          </select>
                       </div>
                       <div class="grid grid-cols-1 sm:grid-cols-1 gap-6 col-span-2 md:col-span-1">
                          <div>
                             <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PERMIT NO. / 証號</label>
                             <input type="text" [(ngModel)]="p.permitNumber" 
                                    class="w-full p-5 bg-[#f1f5f9]/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 mt-2 text-sm font-bold transition-all">
                          </div>
                       </div>
                       <div class="md:col-span-2">
                          <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">UPC/EAN BARCODE / 條碼</label>
                          <div class="relative mt-2">
                              <span class="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">qr_code_scanner</span>
                              <input type="text" [(ngModel)]="p.barcode" 
                                     class="w-full pl-12 p-5 bg-[#f1f5f9]/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 text-sm font-mono font-bold transition-all" 
                                     placeholder="掃描或手動輸入產品條碼">
                          </div>
                       </div>
                    </div>
                 </div>

                 <div class="pt-8 border-t border-gray-100/50">
                    <h3 class="text-[10px] font-black uppercase text-blue-500 mb-6 tracking-[0.2em] flex items-center gap-2">
                       <span class="w-1 h-1 rounded-full bg-blue-500"></span>
                       詳細規格與擴充 SPECIFICATIONS
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div class="md:col-span-2">
                          <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">COPYWRITING / 產品文案描述</label>
                          <textarea rows="4" [(ngModel)]="p.description" 
                                    class="w-full p-5 bg-[#f1f5f9]/50 rounded-[2rem] border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 mt-2 text-sm font-medium leading-relaxed transition-all" 
                                    placeholder="描述產品的核心優向、適應症或特色..."></textarea>
                       </div>
                       <div>
                          <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">INGREDIENTS / 主要成份</label>
                          <input type="text" [(ngModel)]="p.details!.ingredients" 
                                 class="w-full p-5 bg-[#f1f5f9]/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 mt-2 text-sm font-bold transition-all">
                       </div>
                       <div>
                          <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PACKAGING / 包裝規格</label>
                          <input type="text" [(ngModel)]="p.details!.packSize" 
                                 class="w-full p-5 bg-[#f1f5f9]/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 mt-2 text-sm font-bold transition-all">
                       </div>
                       <div class="md:col-span-2">
                          <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ASSET PATH / PDF DM 檔案路徑</label>
                          <div class="flex gap-3 mt-2">
                             <input type="text" [(ngModel)]="p.dmImageUrl" 
                                    class="flex-1 p-5 bg-[#f1f5f9]/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 text-xs font-mono font-bold transition-all" 
                                    placeholder="catalogs/medical-device-spec.pdf">
                             <button class="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all active:scale-[0.92] shadow-sm shadow-blue-500/10">
                                <span class="material-symbols-rounded">attachment</span>
                             </button>
                          </div>
                       </div>
                       <div class="md:col-span-2">
                          <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">EXTERNAL SITE / 官方詳細連結</label>
                          <input type="text" [(ngModel)]="p.productUrl" 
                                 class="w-full p-5 bg-[#f1f5f9]/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 mt-2 text-xs font-mono font-bold transition-all" 
                                 placeholder="https://grand.bio/products/detail/123">
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
    }
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

         if (this.store.selectedProductId() === 'NEW') {
            await this.store.createProduct(p);
         } else {
            await this.store.updateProduct(p);
         }
      } catch (error: any) {
         console.error('Save failed:', error);
         let errorMsg = error.message || '無法儲存變更';
         if (errorMsg.includes('fetch')) {
            errorMsg = '網路連線錯誤或 API URL 設定不正確';
         } else if (errorMsg.includes('JWT')) {
            errorMsg = '登入已過期或權限不足';
         }
         alert('系統錯誤：' + errorMsg + '\n\n請檢查 Vercel 環境變數與 Supabase RLS 設定。');
      } finally {
         this.isLoading.set(false);
      }
   }
}
