import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex h-screen bg-gray-50 overflow-hidden text-gray-800">
      <!-- Sidebar -->
      <aside class="w-64 bg-[#003366] text-white flex flex-col shadow-2xl z-20">
        <div class="p-6 border-b border-white/10">
          <div class="flex items-center gap-3">
             <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span class="material-symbols-rounded text-white">admin_panel_settings</span>
             </div>
             <div>
                <h2 class="font-bold tracking-tight">管理系統</h2>
                <p class="text-[10px] opacity-60 uppercase">Control Center</p>
             </div>
          </div>
        </div>
        
        <nav class="flex-1 p-4 space-y-2 mt-4">
          <button (click)="activeTab.set('PRODUCTS')" [class.bg-white\/10]="activeTab() === 'PRODUCTS'"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group">
            <span class="material-symbols-rounded text-xl opacity-70 group-hover:opacity-100">inventory_2</span>
            <span class="text-sm font-medium">產品管理</span>
          </button>
          <button (click)="activeTab.set('USERS')" [class.bg-white\/10]="activeTab() === 'USERS'"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group">
            <span class="material-symbols-rounded text-xl opacity-70 group-hover:opacity-100">group</span>
            <span class="text-sm font-medium">用戶列表</span>
          </button>
          <button (click)="activeTab.set('SETTINGS')" [class.bg-white\/10]="activeTab() === 'SETTINGS'"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group">
            <span class="material-symbols-rounded text-xl opacity-70 group-hover:opacity-100">settings</span>
            <span class="text-sm font-medium">系統設定</span>
          </button>
        </nav>

        <div class="p-4 mt-auto">
           <button (click)="store.logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-100 hover:bg-red-500/20 transition-colors">
              <span class="material-symbols-rounded">logout</span>
              <span class="text-sm font-bold">登出系統</span>
           </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 bg-gray-50">
        <!-- Top Bar -->
        <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10">
          <div class="flex items-center gap-4">
            <h1 class="text-lg font-bold text-[#003366]">
              {{ activeTab() === 'PRODUCTS' ? '產品列表維護' : activeTab() === 'USERS' ? '管理員列表' : '系統參數設定' }}
            </h1>
            <span class="px-2 py-1 bg-gray-100 text-[10px] font-bold rounded-lg text-gray-400">v2.1.0</span>
          </div>
          
          <div class="flex items-center gap-4">
            <button (click)="store.toggleNotifications()" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 relative hover:bg-gray-200 transition-colors">
               <span class="material-symbols-rounded text-xl">notifications</span>
               @if (store.unreadNotificationsCount() > 0) {
                 <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
               }
            </button>
            
            <!-- Notifications Dropdown -->
            @if (store.showNotifications()) {
              <div class="absolute right-16 top-16 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
                 <div class="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <span class="text-sm font-bold text-[#003366]">系統通知</span>
                    <button (click)="store.toggleNotifications()" class="text-gray-400 hover:text-gray-600 font-bold">
                       <span class="material-symbols-rounded text-sm">close</span>
                    </button>
                 </div>
                 <div class="max-h-[400px] overflow-y-auto">
                    @for (n of store.notifications(); track n.id) {
                      <div class="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
                         <div class="flex justify-between items-start mb-1">
                            <span class="text-sm font-bold text-gray-800">{{ n.title }}</span>
                            <span class="text-[10px] text-gray-400">{{ n.time }}</span>
                         </div>
                         <p class="text-xs text-gray-500 leading-relaxed">{{ n.content }}</p>
                      </div>
                    }
                 </div>
              </div>
            }

            <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
              {{ store.currentUser()?.email?.substring(0,2) || 'AD' }}
            </div>
          </div>
        </header>

        <!-- Dynamic Content -->
        <div class="flex-1 overflow-y-auto p-8">
           @if (activeTab() === 'PRODUCTS') {
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                       <h3 class="font-bold text-gray-800">商品清單</h3>
                       <p class="text-xs text-gray-400 mt-0.5">目前共載入 {{ store.products().length }} 項產品</p>
                    </div>
                    <button class="px-4 py-2 bg-[#003366] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#004488] transition-colors shadow-lg shadow-blue-900/10">
                       <span class="material-symbols-rounded text-lg">add</span> 新增產品
                    </button>
                 </div>
                 <table class="w-full border-collapse">
                    <thead class="bg-gray-50/50">
                       <tr class="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          <th class="px-6 py-4">預覽圖</th>
                          <th class="px-6 py-4">產品名稱</th>
                          <th class="px-6 py-4">類別</th>
                          <th class="px-6 py-4">價格</th>
                          <th class="px-6 py-4">產地</th>
                          <th class="px-6 py-4">更新時間</th>
                          <th class="px-6 py-4 text-center">操作</th>
                       </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                       @for (p of store.products(); track p.id) {
                          <tr class="hover:bg-gray-50/50 transition-colors group">
                             <td class="px-6 py-4">
                                <div class="w-12 h-12 rounded-xl bg-gray-50 p-1 flex items-center justify-center border border-gray-100 overflow-hidden group-hover:border-blue-200 transition-colors">
                                   <img [src]="p.imageUrl" class="max-w-full max-h-full object-contain" alt="t">
                                </div>
                             </td>
                             <td class="px-6 py-4">
                                <div class="text-sm font-bold text-gray-800">{{ p.name }}</div>
                                <div class="text-[10px] text-gray-400 mt-0.5">ID: {{ p.id }}</div>
                             </td>
                             <td class="px-6 py-4">
                                <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg">{{ p.categoryLabel }}</span>
                             </td>
                             <td class="px-6 py-4 font-mono text-sm text-[#003366]">NT$ {{ p.price }}</td>
                             <td class="px-6 py-4 text-sm text-gray-500">{{ p.origin || '台灣' }}</td>
                             <td class="px-6 py-4 text-xs text-gray-400">2026/02/22</td>
                             <td class="px-6 py-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                   <button (click)="store.selectedProductId.set(p.id); store.setView('ADMIN_EDIT')" 
                                           class="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
                                      <span class="material-symbols-rounded text-xl icon-filled">edit</span>
                                   </button>
                                   <button class="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
                                      <span class="material-symbols-rounded text-xl">delete</span>
                                   </button>
                                </div>
                             </td>
                          </tr>
                       }
                    </tbody>
                 </table>
              </div>
           } @else {
              <div class="h-96 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                 <span class="material-symbols-rounded text-6xl opacity-20 mb-4">construction</span>
                 <p class="font-medium text-sm">此功能模組（{{ activeTab() }}）正在維護開發中</p>
              </div>
           }
        </div>
      </main>
    </div>
  `
})
export class AdminDashboardComponent {
    store = inject(StoreService);
    activeTab = signal<'PRODUCTS' | 'USERS' | 'SETTINGS'>('PRODUCTS');
}
