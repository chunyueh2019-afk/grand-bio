import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
    selector: 'app-share-list-view',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="pb-24">
      <div class="sticky top-0 bg-white/90 backdrop-blur-md p-6 border-b border-gray-100 z-10 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-black text-[#003366]">分享清單</h2>
          <p class="text-xs text-gray-400 font-medium">共 {{ store.cart().length }} 項產品</p>
        </div>
        <button *ngIf="store.cart().length > 0" (click)="store.clearCart()" class="text-xs font-bold text-red-400 bg-red-50 px-3 py-1 rounded-full">清空全部</button>
      </div>

      <div class="p-6">
        @if (store.cart().length > 0) {
          <div class="space-y-4 mb-8">
            @for (p of store.cart(); track p.id) {
              <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center">
                <div class="w-16 h-16 bg-gray-50 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                  <img [src]="p.imageUrl" class="max-w-full max-h-full object-contain" alt="p">
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-800 text-sm truncate">{{ p.name }}</h3>
                  <p class="text-[10px] text-gray-400 truncate">{{ p.permitNumber }}</p>
                  <p class="text-sm font-black text-[#003366] mt-1">NT$ {{ p.price }}</p>
                </div>
                <button (click)="store.removeFromShareList(p.id)" class="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center active:bg-gray-100 transition-colors">
                  <span class="material-symbols-rounded text-lg">delete</span>
                </button>
              </div>
            }
          </div>

          <div class="sticky bottom-24 left-0 right-0 px-6 animate-slide-up">
            <button (click)="shareList()" class="w-full bg-[#003366] text-white p-5 rounded-2xl flex justify-center items-center gap-3 font-bold shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-transform">
              <span class="material-symbols-rounded">content_copy</span>
              複製清單文字並分享
            </button>
            <p class="text-center text-[10px] text-gray-400 mt-3 italic">點擊複製後，可直接貼上至 LINE 或郵件</p>
          </div>
        } @else {
          <div class="py-32 text-center">
            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="material-symbols-rounded text-4xl text-gray-200">add_shopping_cart</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">清單目前是空的</h3>
            <p class="text-sm text-gray-400 px-10 mb-8">瀏覽產品目錄並將感興趣的項目加入清單，方便一次分享給您的客戶。</p>
            <button (click)="store.setView('LIST')" class="px-8 py-3 bg-[#003366] text-white rounded-full font-bold shadow-lg active:scale-95 transition-all">去找產品</button>
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    @keyframes slide-up {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up { animation: slide-up 0.5s ease-out; }
  `]
})
export class ShareListViewComponent {
    store = inject(StoreService);

    async shareList() {
        const items = this.store.cart();
        if (items.length === 0) return;

        let text = `【${this.store.companyInfo().name} 產品清單分享】\n\n`;
        items.forEach((p, i) => {
            text += `${i + 1}. ${p.name}\n`;
            text += `   規格：${p.details?.packSize || '見包裝'}\n`;
            text += `   証號：${p.permitNumber || '無'}\n`;
            if (p.barcode) text += `   條碼：${p.barcode}\n`;
            text += `   建議售價：NT$ ${p.price}\n\n`;
        });

        text += `更多資訊，請聯繫我們：\n`;
        text += `電話：${this.store.companyInfo().phone}\n`;
        text += `信箱：${this.store.companyInfo().email}\n`;
        text += `(本訊息由 Grand.Bio E-Catalog 自動生成)`;

        try {
            await navigator.clipboard.writeText(text);
            alert('清單已成功複製到剪貼簿！您可以點擊其他 APP 進行貼上分享。');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('複製失敗，請手動選取或重試。');
        }
    }
}
