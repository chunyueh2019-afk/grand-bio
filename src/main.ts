import { Component, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { StoreService } from './services/store.service';
import { NavBarComponent } from './components/nav-bar.component';
import { HomeViewComponent } from './components/home-view.component';
import { ProductListViewComponent } from './components/product-list-view.component';
import { ProductDetailViewComponent } from './components/product-detail-view.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { AdminProductEditComponent } from './components/admin-product-edit.component';
import { AdminLoginComponent } from './components/admin-login.component';

@Component({
   selector: 'app-root',
   standalone: true,
   imports: [
      CommonModule,
      NavBarComponent,
      HomeViewComponent,
      ProductListViewComponent,
      ProductDetailViewComponent,
      AdminDashboardComponent,
      AdminProductEditComponent,
      AdminLoginComponent
   ],
   template: `
    <div class="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden" [class.max-w-none]="store.currentView().startsWith('ADMIN')">
      
      <!-- Dynamic View Container -->
      <div class="content-container">
        @if (store.currentView() === 'HOME') {
          <app-home-view></app-home-view>
        }
        @if (store.currentView() === 'LIST') {
          <app-product-list-view></app-product-list-view>
        }
        @if (store.currentView() === 'DETAIL') {
          <app-product-detail-view></app-product-detail-view>
        }
        @if (store.currentView() === 'ADMIN') {
          <app-admin-dashboard></app-admin-dashboard>
        }
        @if (store.currentView() === 'ADMIN_EDIT') {
          <app-admin-product-edit></app-admin-product-edit>
        }
        @if (store.currentView() === 'LOGIN') {
          <app-admin-login></app-admin-login>
        }
        @if (store.currentView() === 'SHARE') {
          <div class="p-8 text-center py-20">
             <span class="material-symbols-rounded text-6xl text-gray-200">share</span>
             <h2 class="text-xl font-bold mt-4">分享清單</h2>
             <p class="text-gray-400 mt-2">目前清單內有 {{ store.cart().length }} 項產品</p>
             <button (click)="store.setView('LIST')" class="mt-6 px-6 py-2 bg-[#003366] text-white rounded-full font-bold">去找產品</button>
          </div>
        }
        @if (store.currentView() === 'CATALOGS') {
           <div class="p-8">
              <button (click)="store.setView('HOME')" class="mb-4 text-[#003366] flex items-center gap-1 font-bold">
                 <span class="material-symbols-rounded">arrow_back</span> 返回
              </button>
              <h2 class="text-2xl font-black text-[#003366] mb-6">電子型錄區</h2>
              <div class="space-y-4">
                 <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex justify-between items-center text-gray-800">
                    <div>
                       <h3 class="font-bold">2026 醫藥產品手冊</h3>
                       <p class="text-xs text-gray-400">PDF | 12.5MB</p>
                    </div>
                    <span class="material-symbols-rounded text-[#003366]">download</span>
                 </div>
              </div>
           </div>
        }
        @if (store.currentView() === 'CONTACT') {
           <div class="p-8">
              <button (click)="store.setView('HOME')" class="mb-4 text-[#003366] flex items-center gap-1 font-bold">
                 <span class="material-symbols-rounded">arrow_back</span> 返回
              </button>
              <h1 class="text-2xl font-black text-[#003366] mb-2">{{ store.companyInfo().name }}</h1>
              <p class="text-gray-500 text-sm mb-8">如有任何產品問題，歡迎透過以下方式聯繫我們</p>
              
              <div class="space-y-4">
                 <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                    <span class="material-symbols-rounded text-green-500">call</span>
                    <div>
                       <p class="text-[10px] text-gray-400 font-bold uppercase">電話</p>
                       <p class="font-bold text-gray-700">{{ store.companyInfo().phone }}</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                    <span class="material-symbols-rounded text-blue-500">mail</span>
                    <div>
                       <p class="text-[10px] text-gray-400 font-bold uppercase">信箱</p>
                       <p class="font-bold text-gray-700">{{ store.companyInfo().email }}</p>
                    </div>
                 </div>
              </div>
           </div>
        }
      </div>

      <!-- Static Bottom Nav (Hidden in Admin) -->
      @if (!store.currentView().startsWith('ADMIN') && store.currentView() !== 'DETAIL') {
        <app-nav-bar></app-nav-bar>
      }
    </div>
  `,
})
export class App {
   store = inject(StoreService);
}

bootstrapApplication(App).catch((err) => console.error(err));
