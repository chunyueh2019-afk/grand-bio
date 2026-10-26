import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../services/store.service';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pb-32">
       <div class="w-full max-w-sm space-y-8">
          <div class="text-center">
             <div class="w-20 h-20 bg-[#003366] rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-6 rotate-3">
                <span class="material-symbols-rounded text-white text-4xl">admin_panel_settings</span>
             </div>
             <h1 class="text-3xl font-black text-[#003366] tracking-tight">管理員登入</h1>
             <p class="text-gray-400 mt-2 text-sm font-medium">請輸入您的帳號密碼以進入管理系統</p>
          </div>

          <div class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 space-y-6">
             <div class="space-y-4">
                <div>
                   <label class="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">電子郵件 / 帳號</label>
                   <div class="relative mt-1">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-gray-400 text-lg">mail</span>
                      <input type="email" [(ngModel)]="email" class="w-full pl-12 p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-gray-700" placeholder="admin@example.com">
                   </div>
                </div>
                <div>
                   <label class="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">登入密碼</label>
                   <div class="relative mt-1">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-gray-400 text-lg">lock</span>
                      <input type="password" [(ngModel)]="password" class="w-full pl-12 p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-gray-700" placeholder="••••••••">
                   </div>
                </div>
             </div>

             <div class="pt-2">
                <button (click)="login()" [disabled]="loading()" class="w-full bg-[#003366] text-white p-5 rounded-2xl font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                   @if (loading()) {
                      <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>驗證中...</span>
                   } @else {
                      <span class="material-symbols-rounded text-xl">login</span>
                      <span>進入管理後台</span>
                   }
                </button>
                
                <button (click)="store.setView('HOME')" [disabled]="loading()" class="w-full mt-4 text-gray-400 p-2 text-xs font-bold hover:text-[#003366] transition-colors">
                   暫不登入，返回首頁
                </button>
             </div>
          </div>
       </div>
    </div>
  `
})
export class AdminLoginComponent {
    store = inject(StoreService);

    email = '';
    password = '';
    loading = signal(false);

    async login() {
        if (!this.email || !this.password) {
            alert('請輸入帳輸入帳號與密碼');
            return;
        }

        this.loading.set(true);
        const { data, error } = await this.store.supabaseService.signIn(this.email, this.password);

        if (error) {
            alert('登入失敗：' + error.message);
            this.loading.set(false);
        } else {
            this.store.isLoggedIn.set(true);
            this.store.currentUser.set(data.user);
            this.store.setView('ADMIN');
            this.loading.set(false);
        }
    }
}
