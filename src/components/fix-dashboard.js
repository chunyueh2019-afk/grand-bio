const fs = require('fs');
const file = 'c:/Users/SamWu/Downloads/grand.bio-e-catalog/src/components/admin-dashboard.component.ts';

let content = fs.readFileSync(file, 'utf8');
if (content.charCodeAt(0) === 0xFEFF || content.indexOf('\0') !== -1) {
    content = fs.readFileSync(file, 'utf16le');
}

const replacementText = `                           } @empty {
                              <tr>
                                 <td colspan="6" class="px-8 py-20 text-center">
                                    <div class="flex flex-col items-center justify-center">
                                       <div class="w-20 h-20 bg-blue-50/50 rounded-[2rem] flex items-center justify-center text-blue-400 mb-6 border border-blue-100/50">
                                          <span class="material-symbols-rounded text-4xl">inventory_2</span>
                                       </div>
                                       <h4 class="text-lg font-black text-[#003366] tracking-tight">目前資料庫尚無產品</h4>
                                       <p class="text-[11px] font-bold text-gray-400 mt-2 mb-8 max-w-sm leading-relaxed">您可以手動一筆筆建立，或是讓系統自動為您填入測試用的展示資料。</p>
                                       
                                       <button (click)="store.generateMockProducts()" class="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[13px] hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10 active:scale-[0.97] flex items-center gap-3 border border-emerald-100/50 group">
                                          <span class="material-symbols-rounded text-xl group-hover:rotate-12 transition-transform">auto_awesome</span>
                                          一鍵產生 3 筆測試用假資料
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           }
                        </tbody>`;

// Replace specifically at the end of the products loop
content = content.replace(/                           \}\r?\n                        <\/tbody>/, replacementText);

fs.writeFileSync(file, content, 'utf8');
