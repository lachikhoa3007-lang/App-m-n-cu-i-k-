import React, { useState } from 'react';
import { CanteenProvider, useCanteen } from './context/CanteenContext';
import { ShopeeHeader } from './components/admin/ShopeeHeader';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { OrderManagement } from './components/admin/OrderManagement';
import { InventoryDualChannel } from './components/admin/InventoryDualChannel';
import { MenuManagement } from './components/admin/MenuManagement';
import { CapacityManagement } from './components/admin/CapacityManagement';
import { DemandForecastView } from './components/admin/DemandForecastView';
import { IncidentCenter } from './components/admin/IncidentCenter';
import { VoucherTab } from './components/admin/VoucherTab';
import { ReceiptModal } from './components/admin/ReceiptModal';
import { PosModal } from './components/admin/PosModal';
import { CustomerApp } from './components/customer/CustomerApp';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  UtensilsCrossed, 
  Clock, 
  TrendingUp, 
  AlertOctagon, 
  Tag,
  Smartphone,
  SplitSquareVertical,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const AdminPortalContent: React.FC = () => {
  const { orders } = useCanteen();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedReceiptOrderId, setSelectedReceiptOrderId] = useState<string | null>(null);
  const [isPosOpen, setIsPosOpen] = useState<boolean>(false);

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const targetReceiptOrder = orders.find(o => o.id === selectedReceiptOrderId) || null;

  const navTabs = [
    { id: 'dashboard', label: 'Tổng Quan & Thống Kê', icon: LayoutDashboard },
    { id: 'orders', label: 'Quản Lý Đơn Hàng', icon: ShoppingBag, badge: pendingCount },
    { id: 'inventory', label: 'Tồn Kho 2 Kênh (29 Món)', icon: Package },
    { id: 'menu', label: 'Quản Lý Thực Đơn', icon: UtensilsCrossed },
    { id: 'capacity', label: 'Công Suất & Khung Giờ', icon: Clock },
    { id: 'forecast', label: 'Dự Báo Nhu Cầu', icon: TrendingUp },
    { id: 'incidents', label: 'Sự Cố & Khiếu Nại', icon: AlertOctagon },
    { id: 'vouchers', label: 'Mã Giảm Giá', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Sub-navigation Tabs (ShopeeFood Merchant Tab Bar) */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#ee4d2d] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-[#ee4d2d]' : 'bg-[#ee4d2d] text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab View Port */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardOverview 
            onNavigateTab={(tab) => setCurrentTab(tab)} 
            onOpenPosModal={() => setIsPosOpen(true)}
            onSelectOrderForReceipt={(id) => setSelectedReceiptOrderId(id)}
          />
        )}
        {currentTab === 'orders' && (
          <OrderManagement 
            onSelectOrderForReceipt={(id) => setSelectedReceiptOrderId(id)} 
          />
        )}
        {currentTab === 'inventory' && <InventoryDualChannel />}
        {currentTab === 'menu' && <MenuManagement />}
        {currentTab === 'capacity' && <CapacityManagement />}
        {currentTab === 'forecast' && <DemandForecastView />}
        {currentTab === 'incidents' && <IncidentCenter />}
        {currentTab === 'vouchers' && <VoucherTab />}
      </main>

      {/* Print Kitchen Receipt Modal */}
      <ReceiptModal
        order={targetReceiptOrder}
        onClose={() => setSelectedReceiptOrderId(null)}
      />

      {/* Cashier Direct POS Modal */}
      <PosModal
        isOpen={isPosOpen}
        onClose={() => setIsPosOpen(false)}
      />

      {/* Footer Info */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Hệ thống Quản Trị Căn Tin Khu E · Trường Đại học Công nghệ TP.HCM (HUTECH) · Nghiên cứu bởi La Chí Khoa & Bùi Thành Đạt (24DTMA1)
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<'admin' | 'customer' | 'dual'>('admin');

  return (
    <CanteenProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        
        {/* Top Shopee Header */}
        <ShopeeHeader
          currentView={currentView}
          setCurrentView={setCurrentView}
          pendingCount={0}
        />

        {/* View Routing */}
        {currentView === 'admin' && <AdminPortalContent />}
        
        {currentView === 'customer' && (
          <CustomerApp onSwitchToAdmin={() => setCurrentView('admin')} />
        )}

        {currentView === 'dual' && (
          <div className="max-w-[1700px] mx-auto p-4">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl mb-4 text-xs font-semibold text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SplitSquareVertical className="w-4 h-4 text-[#ee4d2d]" />
                <span>
                  <strong>CHẾ ĐỘ XEM SONG SONG (LIVE TEST):</strong> Đặt món bên tay phải (App Sinh Viên) và quan sát ngay đơn hàng đổ về tức thì bên tay trái (Trang Quản Trị Căn Tin) cùng tồn kho Online giảm tự động!
                </span>
              </div>
              <button
                onClick={() => setCurrentView('admin')}
                className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-amber-800 font-bold hover:bg-amber-100"
              >
                Trở về Quản Trị Toàn Màn Hình
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Left Column: Admin Portal (7 cols on large desktop) */}
              <div className="xl:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 overflow-hidden">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                  <h3 className="font-black text-sm text-[#ee4d2d] uppercase tracking-wide">
                    Màn Hình Quản Trị Căn Tin (Khu E HUTECH)
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">Real-time sync</span>
                </div>
                <AdminPortalContent />
              </div>

              {/* Right Column: Customer App (5 cols on large desktop) */}
              <div className="xl:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-20">
                <div className="flex items-center justify-between p-3 bg-slate-900 text-white">
                  <h3 className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#ee4d2d]" />
                    <span>App Đặt Món Sinh Viên (HUTECH Campus E)</span>
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">● Đang kết nối kho</span>
                </div>
                <div className="max-h-[85vh] overflow-y-auto">
                  <CustomerApp />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </CanteenProvider>
  );
}
