import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
    selector: 'app-nav-bar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-6 flex justify-between items-center z-50">
      <button (click)="store.setView('HOME')" [class.text-[#003366]]="store.currentView() === 'HOME'" class="flex flex-col items-center gap-1 text-gray-400">
        <span class="material-symbols-rounded" [class.icon-filled]="store.currentView() === 'HOME'">home</span>
        <span class="text-[10px] font-medium">首頁</span>
      </button>
      <button (click)="store.setView('LIST')" [class.text-[#003366]]="store.currentView() === 'LIST'" class="flex flex-col items-center gap-1 text-gray-400">
        <span class="material-symbols-rounded" [class.icon-filled]="store.currentView() === 'LIST'">grid_view</span>
        <span class="text-[10px] font-medium">產品</span>
      </button>
      <button (click)="store.setView('SHARE')" [class.text-[#003366]]="store.currentView() === 'SHARE'" class="flex flex-col items-center gap-1 text-gray-400 relative">
        <span class="material-symbols-rounded" [class.icon-filled]="store.currentView() === 'SHARE'">share</span>
        <span class="text-[10px] font-medium">分享清單</span>
        @if (store.cart().length > 0) {
          <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full">{{ store.cart().length }}</span>
        }
      </button>
      <button (click)="store.setView('ADMIN')" [class.text-[#003366]]="store.currentView() === 'ADMIN' || store.currentView() === 'ADMIN_EDIT'" class="flex flex-col items-center gap-1 text-gray-400">
        <span class="material-symbols-rounded" [class.icon-filled]="store.currentView() === 'ADMIN' || store.currentView() === 'ADMIN_EDIT'">admin_panel_settings</span>
        <span class="text-[10px] font-medium">管理</span>
      </button>
    </nav>
  `
})
export class NavBarComponent {
    store = inject(StoreService);
}
