import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';
import { ProductCategory } from '../types';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pb-24">
      <!-- Header -->
      <div class="bg-[#003366] text-white p-6 rounded-b-[2.5rem] shadow-lg relative">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                <span class="material-symbols-rounded text-2xl text-white icon-filled">medical_services</span>
             </div>
             <h1 class="text-xl font-bold tracking-wide">Grand.Bio <span class="text-xs font-normal opacity-80 block -mt-1">廣聯生技</span></h1>
          </div>
          <button (click)="store.toggleNotifications()" class="relative p-2">
            <span class="material-symbols-rounded">notifications</span>
            @if (store.unreadNotificationsCount() > 0) {
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#003366]"></span>
            }
          </button>
          
          <!-- Notifications Dropdown -->
          @if (store.showNotifications()) {
            <div class="absolute right-4 top-16 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
               <div class="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center text-gray-800">
                  <span class="text-xs font-bold text-[#003366]">最近通知</span>
                  <button (click)="store.toggleNotifications()" class="text-gray-400 hover:text-gray-600"><span class="material-symbols-rounded text-sm">close</span></button>
               </div>
               <div class="max-h-64 overflow-y-auto">
                  @for (n of store.notifications(); track n.id) {
                    <div class="p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                       <div class="flex justify-between items-start mb-1 text-gray-800">
                          <span class="text-xs font-bold">{{ n.title }}</span>
                          <span class="text-[10px] text-gray-400">{{ n.time }}</span>
                       </div>
                       <p class="text-[11px] text-gray-500 leading-normal">{{ n.content }}</p>
                    </div>
                  }
               </div>
            </div>
          }
        </div>

        <div class="mb-2">
          <h2 class="text-2xl font-bold mb-1">{{ store.companyInfo().slogan }}</h2>
          <p class="text-blue-100 text-sm opacity-80">專業代理高品質醫療器材與保健食品</p>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="px-6 -mt-8 grid grid-cols-2 gap-4">
        @for (cat of categories; track cat.id) {
          <div (click)="store.selectCategory(cat.id)" 
               class="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center gap-3 transition-all hover:shadow-md active:scale-95">
             <div class="w-12 h-12 rounded-2xl flex items-center justify-center" [style.background-color]="cat.color + '10'">
                <span class="material-symbols-rounded text-2xl icon-filled" [style.color]="cat.color">{{ cat.icon }}</span>
             </div>
             <div class="text-center">
                <span class="block text-sm font-bold text-gray-800">{{ cat.label }}</span>
                <span class="block text-[10px] text-gray-400 uppercase tracking-tighter">{{ cat.id }}</span>
             </div>
          </div>
        }
      </div>

      <!-- Quick Sections -->
      <div class="px-6 mt-8 space-y-4">
        <div (click)="store.setView('CATALOGS')" class="bg-gradient-to-r from-[#003366] to-[#004d99] p-6 rounded-3xl text-white flex justify-between items-center shadow-lg active:scale-[0.98] transition-transform">
          <div>
            <h3 class="font-bold text-lg">電子型錄索取</h3>
            <p class="text-xs opacity-80">下載最新醫藥產品手冊</p>
          </div>
          <span class="material-symbols-rounded text-3xl">download_for_offline</span>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
           <div (click)="store.selectCategory('FAVORITES')" class="bg-[#4CAF50]/10 p-5 rounded-3xl flex items-center gap-3 border border-[#4CAF50]/20 active:scale-95 transition-transform">
              <span class="material-symbols-rounded text-[#4CAF50] icon-filled">star</span>
              <span class="text-sm font-bold text-gray-700">我的收藏</span>
           </div>
           <div (click)="store.viewContact()" class="bg-[#00ACEE]/10 p-5 rounded-3xl flex items-center gap-3 border border-[#00ACEE]/20 active:scale-95 transition-transform">
              <span class="material-symbols-rounded text-[#00ACEE]">contact_support</span>
              <span class="text-sm font-bold text-gray-700">與我聯繫</span>
           </div>
        </div>
      </div>
    </div>
  `
})
export class HomeViewComponent {
  store = inject(StoreService);
  categories: { id: ProductCategory; label: string; icon: string; color: string }[] = [
    { id: 'DRUG', label: '醫藥服務', icon: 'pill', color: '#003366' },
    { id: 'FOOD', label: '保健食品', icon: 'potted_plant', color: '#4CAF50' },
    { id: 'DEVICE', label: '醫療器材', icon: 'monitor_heart', color: '#FF9800' },
    { id: 'DAILY', label: '一般產品', icon: 'shopping_basket', color: '#9C27B0' }
  ];
}
