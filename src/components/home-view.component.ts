import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';
import { ProductCategory } from '../types';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pb-24 view-enter">
      <!-- Header -->
      <div class="bg-gradient-to-br from-[#003366] via-[#004d99] to-[#012a52] text-white p-8 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <!-- Background decorative circles -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute top-20 -left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>

        <div class="flex justify-between items-center mb-8 relative z-10">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                <span class="material-symbols-rounded text-2xl text-white icon-filled">medical_services</span>
             </div>
             <div>
                <h1 class="text-2xl font-black tracking-tight leading-none">Grand.Bio</h1>
                <span class="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em]">廣聯生技專業代理</span>
             </div>
          </div>
          <button (click)="store.toggleNotifications()" class="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all active:scale-95">
            <span class="material-symbols-rounded text-xl">notifications</span>
            @if (store.unreadNotificationsCount() > 0) {
              <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-[#003366] shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
            }
          </button>
          
          <!-- Notifications Dropdown -->
          @if (store.showNotifications()) {
            <div class="absolute right-0 top-14 w-72 glass-effect rounded-2xl shadow-2xl border border-white/40 overflow-hidden z-[100] animate-in fade-in zoom-in duration-300">
               <div class="p-4 border-b border-gray-100 flex justify-between items-center text-gray-800">
                  <span class="text-sm font-black text-[#003366]">系統通知</span>
                  <button (click)="store.toggleNotifications()" class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <span class="material-symbols-rounded text-sm">close</span>
                  </button>
               </div>
               <div class="max-h-80 overflow-y-auto">
                  @for (n of store.notifications(); track n.id) {
                    <div class="p-4 border-b border-gray-50 last:border-0 hover:bg-white/50 transition-colors cursor-pointer group">
                       <div class="flex justify-between items-start mb-1 text-gray-800">
                          <span class="text-xs font-bold group-hover:text-blue-600 transition-colors">{{ n.title }}</span>
                          <span class="text-[10px] text-gray-400 font-medium">{{ n.time }}</span>
                       </div>
                       <p class="text-[11px] text-gray-500 leading-relaxed">{{ n.content }}</p>
                    </div>
                  }
               </div>
            </div>
          }
        </div>

        <div class="relative z-10 py-2">
          <h2 class="text-3xl font-black mb-2 leading-tight">{{ store.companyInfo().slogan }}</h2>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <p class="text-blue-50 text-xs font-medium tracking-wide opacity-90">高品質醫療器材與保健食品專業服務商</p>
          </div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="px-6 -mt-10 grid grid-cols-2 gap-5 relative z-20">
        @for (cat of categories; track cat.id) {
          <div (click)="store.selectCategory(cat.id)" 
               class="bg-white p-6 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-white/50 flex flex-col items-center gap-4 transition-all hover:shadow-xl hover:translate-y-[-6px] active:scale-[0.96] cursor-pointer group overflow-hidden relative">
             <!-- Card shadow glow -->
             <div class="absolute -bottom-10 -right-10 w-24 h-24 rounded-full opacity-20 group-hover:opacity-30 transition-opacity blur-2xl" [style.background-color]="cat.color"></div>
             
             <div class="w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:rotate-6 duration-300" [style.background-color]="cat.color + '08'">
                <span class="material-symbols-rounded text-3xl icon-filled transition-all group-hover:scale-110" [style.color]="cat.color">{{ cat.icon }}</span>
             </div>
             <div class="text-center">
                <span class="block text-base font-black text-gray-800 tracking-tight">{{ cat.label }}</span>
                <span class="block text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-0.5">{{ cat.id }}</span>
             </div>
          </div>
        }
      </div>

      <!-- Quick Sections -->
      <div class="px-6 mt-10 space-y-6">
        <div (click)="store.setView('CATALOGS')" 
             class="group bg-gradient-to-r from-[#003366] via-[#004d99] to-[#012a52] p-7 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden">
          <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative z-10">
            <h3 class="font-black text-xl tracking-tight">電子型錄索取</h3>
            <p class="text-xs font-bold text-blue-100/70 mt-1 uppercase tracking-wider">Download Latest Brochures</p>
          </div>
          <div class="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 transition-transform group-hover:rotate-12">
            <span class="material-symbols-rounded text-3xl text-white">download</span>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-5">
           <div (click)="store.selectCategory('FAVORITES')" 
                class="bg-white p-5 rounded-[2rem] flex flex-col gap-3 border border-gray-100 shadow-sm active:scale-[0.96] transition-all hover:shadow-md cursor-pointer group">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                <span class="material-symbols-rounded text-xl icon-filled">star</span>
              </div>
              <span class="text-sm font-black text-gray-700">我的收藏</span>
           </div>
           <div (click)="store.viewContact()" 
                class="bg-white p-5 rounded-[2rem] flex flex-col gap-3 border border-gray-100 shadow-sm active:scale-[0.96] transition-all hover:shadow-md cursor-pointer group">
              <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <span class="material-symbols-rounded text-xl">contact_support</span>
              </div>
              <span class="text-sm font-black text-gray-700">與我聯繫</span>
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
