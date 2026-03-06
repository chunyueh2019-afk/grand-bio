import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
   selector: 'app-admin-dashboard',
   standalone: true,
   imports: [CommonModule],
   template: `
    <div class="flex h-screen bg-[#f8fafc] overflow-hidden text-gray-800 view-enter">
      <!-- Sidebar -->
      <aside class="w-72 bg-[#001e3c] text-white flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.05)] z-20">
        <div class="p-8 border-b border-white/5">
          <div class="flex items-center gap-4">
             <div class="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-400/20 shadow-lg shadow-blue-500/10">
                <span class="material-symbols-rounded text-blue-400 icon-filled">admin_panel_settings</span>
             </div>
             <div>
                <h2 class="font-black tracking-tight text-lg">控制中心</h2>
                <p class="text-[9px] opacity-40 uppercase font-black tracking-[0.2em]">Management Suite</p>
             </div>
          </div>
        </div>
        
        <nav class="flex-1 p-6 space-y-3 mt-4">
          <button (click)="activeTab.set('PRODUCTS')" 
                  [class.bg-white]="activeTab() === 'PRODUCTS'" 
                  [class.bg-opacity-5]="activeTab() === 'PRODUCTS'" 
                  [class.shadow-xl]="activeTab() === 'PRODUCTS'"
                  class="w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] hover:bg-white/5 transition-all group relative">
            @if (activeTab() === 'PRODUCTS') {
              <div class="absolute left-0 w-1.5 h-6 bg-blue-500 rounded-full"></div>
            }
            <span class="material-symbols-rounded text-xl opacity-50 group-hover:opacity-100 transition-opacity" [class.opacity-100]="activeTab() === 'PRODUCTS'">inventory_2</span>
            <span class="text-sm font-black tracking-wide" [class.text-blue-100]="activeTab() === 'PRODUCTS'">產品管理</span>
          </button>
          
          <button (click)="activeTab.set('USERS')" 
                  [class.bg-white]="activeTab() === 'USERS'" 
                  [class.bg-opacity-5]="activeTab() === 'USERS'" 
                  class="w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] hover:bg-white/5 transition-all group relative">
            @if (activeTab() === 'USERS') {
               <div class="absolute left-0 w-1.5 h-6 bg-blue-500 rounded-full"></div>
            }
            <span class="material-symbols-rounded text-xl opacity-50 group-hover:opacity-100 transition-opacity" [class.opacity-100]="activeTab() === 'USERS'">group</span>
            <span class="text-sm font-black tracking-wide">用戶列表</span>
          </button>

          <button (click)="activeTab.set('SETTINGS')" 
                  [class.bg-white]="activeTab() === 'SETTINGS'" 
                  [class.bg-opacity-5]="activeTab() === 'SETTINGS'" 
                  class="w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] hover:bg-white/5 transition-all group relative">
            @if (activeTab() === 'SETTINGS') {
               <div class="absolute left-0 w-1.5 h-6 bg-blue-500 rounded-full"></div>
            }
            <span class="material-symbols-rounded text-xl opacity-50 group-hover:opacity-100 transition-opacity" [class.opacity-100]="activeTab() === 'SETTINGS'">settings</span>
            <span class="text-sm font-black tracking-wide">系統設定</span>
          </button>
        </nav>

        <div class="p-6 mt-auto">
           <button (click)="store.logout()" class="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-rose-500/10 text-rose-100 hover:bg-rose-500 transition-all font-black text-sm active:scale-[0.98]">
              <span class="material-symbols-rounded text-lg">logout</span>
              登出系統
           </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        <!-- Top Bar -->
        <header class="h-20 glass-effect flex items-center justify-between px-10 z-10 border-b border-gray-100/50">
          <div class="flex items-center gap-5">
            <h1 class="text-xl font-black text-[#003366] tracking-tight">
              {{ activeTab() === 'PRODUCTS' ? '產品列表維護' : activeTab() === 'USERS' ? '管理員列表' : '系統參數設定' }}
            </h1>
            <span class="px-3 py-1 bg-blue-50 text-[10px] font-black rounded-full text-blue-500 uppercase tracking-widest border border-blue-100/50">Version 2.2.0</span>
          </div>
          
          <div class="flex items-center gap-6">
            <button (click)="store.toggleNotifications()" class="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 relative hover:bg-gray-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm">
               <span class="material-symbols-rounded text-xl icon-filled">notifications</span>
               @if (store.unreadNotificationsCount() > 0) {
                 <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(244,63,94,0.4)]"></span>
               }
            </button>
            
            <!-- Notifications Dropdown -->
            @if (store.showNotifications()) {
              <div class="absolute right-24 top-16 w-80 glass-effect rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                 <div class="p-5 border-b border-gray-100/50 flex justify-between items-center">
                    <span class="text-xs font-black text-[#003366] uppercase tracking-widest">System Alerts</span>
                    <button (click)="store.toggleNotifications()" class="w-6 h-6 rounded-full hover:bg-gray-100 transition-colors">
                       <span class="material-symbols-rounded text-xs">close</span>
                    </button>
                 </div>
                 <div class="max-h-[400px] overflow-y-auto">
                    @for (n of store.notifications(); track n.id) {
                      <div class="p-5 border-b border-gray-50 last:border-0 hover:bg-white/60 transition-colors cursor-pointer group">
                         <div class="flex justify-between items-start mb-1">
                            <span class="text-sm font-black text-gray-800 group-hover:text-blue-600 transition-all">{{ n.title }}</span>
                            <span class="text-[10px] text-gray-400 font-bold uppercase">{{ n.time }}</span>
                         </div>
                         <p class="text-[11px] text-gray-500 leading-relaxed font-medium">{{ n.content }}</p>
                      </div>
                    }
                 </div>
              </div>
            }

            <div class="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl border border-gray-100 shadow-sm">
               <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/20">
                  {{ store.currentUser()?.email?.substring(0,2).toUpperCase() || 'AD' }}
               </div>
               <div class="flex flex-col">
                  <span class="text-[10px] font-black text-gray-800 leading-none">Admin User</span>
                  <span class="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Superuser</span>
               </div>
            </div>
          </div>
        </header>

        <!-- Dynamic Content -->
        <div class="flex-1 overflow-y-auto p-10">
           @if (activeTab() === 'PRODUCTS') {
              <div class="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden">
                 <div class="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div>
                       <h3 class="font-black text-gray-800 text-lg">商品維護中心</h3>
                       <p class="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Found {{ store.products().length }} Premium Products Registered</p>
                    </div>
                    <button (click)="store.selectedProductId.set('NEW'); store.setView('ADMIN_EDIT')" 
                            class="px-6 py-3 bg-[#003366] text-white rounded-2xl text-sm font-black flex items-center gap-3 hover:bg-[#004488] transition-all shadow-xl shadow-blue-900/20 active:scale-[0.97]">
                       <span class="material-symbols-rounded text-xl">add_circle</span> 新增產品
                    </button>
                 </div>
                 
                 <div class="overflow-x-auto">
                    <table class="w-full border-collapse">
                       <thead>
                          <tr class="text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                             <th class="px-8 py-6">預覽圖</th>
                             <th class="px-8 py-6">產品資訊</th>
                             <th class="px-8 py-6">類別</th>
                             <th class="px-8 py-6">價格 (TWD)</th>
                             <th class="px-8 py-6">原始產地</th>
                             <th class="px-8 py-6 text-center">後台操作</th>
                          </tr>
                       </thead>
                       <tbody class="divide-y divide-gray-50/50">
                          @for (p of store.products(); track p.id) {
                             <tr class="hover:bg-blue-50/10 transition-all group">
                                <td class="px-8 py-6">
                                   <div class="w-16 h-16 rounded-2xl bg-gray-50 p-2 flex items-center justify-center border border-gray-100 overflow-hidden group-hover:border-blue-200 group-hover:bg-white transition-all shadow-sm">
                                      <img [src]="p.imageUrl" class="max-w-full max-h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500" alt="t">
                                   </div>
                                </td>
                                <td class="px-8 py-6">
                                   <div class="text-sm font-black text-gray-800 mb-0.5 group-hover:text-blue-600 transition-colors">{{ p.name }}</div>
                                   <div class="text-[10px] text-gray-400 font-mono tracking-tighter">UID: {{ p.id }}</div>
                                </td>
                                <td class="px-8 py-6">
                                   <span class="px-2.5 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg uppercase tracking-wider border border-blue-100/50">{{ p.categoryLabel }}</span>
                                </td>
                                <td class="px-8 py-6">
                                   <div class="text-sm font-black text-[#003366] tracking-tight">NT$ {{ p.price }}</div>
                                </td>
                                <td class="px-8 py-6">
                                   <div class="flex items-center gap-2">
                                      <span class="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-60"></span>
                                      <span class="text-xs font-black text-gray-500">{{ p.origin || '台灣' }}</span>
                                   </div>
                                </td>
                                <td class="px-8 py-6">
                                   <div class="flex items-center justify-center gap-3">
                                      <button (click)="store.selectedProductId.set(p.id); store.setView('ADMIN_EDIT')" 
                                              class="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all active:scale-[0.92] shadow-sm">
                                         <span class="material-symbols-rounded text-xl icon-filled">edit_note</span>
                                      </button>
                                      <button class="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-[0.92] shadow-sm">
                                         <span class="material-symbols-rounded text-xl">delete_sweep</span>
                                      </button>
                                   </div>
                                </td>
                             </tr>
                          }
                       </tbody>
                    </table>
                 </div>
                 
                 <div class="p-8 bg-gray-50/30 border-t border-gray-50 flex justify-center">
                    <p class="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">End of Register List</p>
                 </div>
              </div>
           } @else {
              <div class="h-[60vh] flex flex-col items-center justify-center text-gray-400 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
                 <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <span class="material-symbols-rounded text-5xl opacity-20">construction</span>
                 </div>
                 <h4 class="font-black text-gray-600 text-lg tracking-tight">功能建置中</h4>
                 <p class="font-bold text-xs uppercase tracking-widest mt-2">Section ({{ activeTab() }}) is under active maintenance</p>
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
