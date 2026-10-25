import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Package, 
  Store, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle, 
  ChevronRight,
  Flame,
  Zap
} from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenPosModal: () => void;
  onSelectOrderForReceipt: (orderId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onNavigateTab, 
  onOpenPosModal,
  onSelectOrderForReceipt 
}) => {
  const { foodItems, orders, timeSlots, updateOrderStatus } = useCanteen();

  // Metrics calculations
  const totalRevenue = orders
    .filter(o => o.status === 'completed' || (o.status !== 'cancelled' && o.isPaid))
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready' || o.status === 'delivering');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const totalOnlineStock = foodItems.reduce((sum, f) => sum + f.onlineStock, 0);
  const totalOfflineStock = foodItems.reduce((sum, f) => sum + f.offlineStock, 0);

  // Critical Low Stock items (onlineStock <= minStock)
  const lowStockItems = foodItems.filter(f => f.onlineStock <= f.minStock && f.active);

  // Peak Capacity warnings (slot load >= 80%)
  const peakSlots = timeSlots.filter(s => (s.currentOrders / s.maxCapacity) >= 0.8 || s.isLocked);

  // Best selling items
  const bestSellers = [...foodItems].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* ShopeeFood Merchant Alert Banner */}
      {pendingOrders.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-[#ee4d2d] text-white p-4 rounded-2xl shadow-md flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
              <Flame className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                Bạn có {pendingOrders.length} đơn hàng sinh viên mới đang chờ tiếp nhận!
              </h3>
              <p className="text-xs text-white/90">
                Hãy xác nhận và chuẩn bị món nhanh để sinh viên kịp nhận trước giờ vào lớp ca học tiếp theo.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2 bg-white text-[#ee4d2d] text-xs font-bold rounded-xl hover:bg-slate-100 transition shadow-sm whitespace-nowrap"
          >
            Xem đơn ngay &rarr;
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Doanh thu hôm nay */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Doanh Thu Hôm Nay</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ee4d2d] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {totalRevenue.toLocaleString('vi-VN')}₫
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% so với ca hôm qua</span>
          </div>
        </div>

        {/* Tổng số đơn & Trạng thái */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Đơn Hàng Hôm Nay</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">{orders.length}</span>
            <span className="text-xs text-slate-500">đơn</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
            <span className="text-amber-600 font-bold">{pendingOrders.length} chờ</span>
            <span>·</span>
            <span className="text-blue-600 font-bold">{preparingOrders.length} nấu</span>
            <span>·</span>
            <span className="text-emerald-600 font-bold">{completedOrders.length} xong</span>
          </div>
        </div>

        {/* Tồn Kho 2 Kênh (Online & Offline) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Tồn Kho 2 Kênh</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-lg font-black text-[#ee4d2d] tabular-nums">{totalOnlineStock} <span className="text-xs font-normal">phần</span></div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Tồn Online (App)</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-amber-600 tabular-nums">{totalOfflineStock} <span className="text-xs font-normal">phần</span></div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Tồn Offline (Quầy)</div>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Tổng khả dụng: <strong className="text-slate-800 tabular-nums">{totalOnlineStock + totalOfflineStock} phần</strong>
          </div>
        </div>

        {/* Năng lực phục vụ khung giờ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Tải Cao Điểm</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {timeSlots[1] ? Math.round((timeSlots[1].currentOrders / timeSlots[1].maxCapacity) * 100) : 85}%
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Khung 11:15-12:00 sắp chạm ngưỡng!</span>
          </div>
        </div>

      </div>

      {/* Quick Action Bar (ShopeeFood Merchant Tools) */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm flex items-center gap-2">
            <Store className="w-4 h-4 text-orange-400" />
            <span>Thao tác nhanh cho quầy thu ngân & Bếp Căn Tin</span>
          </h4>
          <p className="text-xs text-slate-400">
            Cập nhật tức thời bán tại quầy POS, điều chuyển kho hoặc khóa khung giờ khi quá tải.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenPosModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bán Tại Quầy (POS)</span>
          </button>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#ee4d2d] hover:bg-red-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Điều Chuyển Kho (29 Món)</span>
          </button>
          <button
            onClick={() => onNavigateTab('capacity')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold transition"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Quản Lý Công Suất</span>
          </button>
        </div>
      </div>

      {/* Two Column Section: Live Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Real-time Order Processing Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Đơn Hàng Trực Tiếp Cần Xử Lý</h3>
              <p className="text-xs text-slate-500">Cập nhật tức thời đồng bộ với ứng dụng sinh viên đặt món</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-[#ee4d2d] hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả {orders.length} đơn</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">#{order.id}</span>
                    <span className="text-xs font-bold text-slate-700">{order.studentName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({order.studentId})</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      order.paymentMethod === 'ONLINE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {order.paymentMethod}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    {order.items.map(i => `${i.quantity}x ${i.foodName}`).join(', ')}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>📍 {order.deliveryLocation}</span>
                    <span>·</span>
                    <span className="text-indigo-600 font-medium">🕒 {order.timeSlot}</span>
                    <span>·</span>
                    <span className="font-bold text-[#ee4d2d] tabular-nums">{order.total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="px-3 py-1.5 bg-[#ee4d2d] hover:bg-red-600 text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      Tiếp nhận & Nấu
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      Báo Sẵn Sàng
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      Giao Thành Công
                    </button>
                  )}
                  {order.status === 'completed' && (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Đã hoàn tất</span>
                    </span>
                  )}
                  <button
                    onClick={() => onSelectOrderForReceipt(order.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                    title="In phiếu bếp / hóa đơn"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Smart Alerts & Best Sellers */}
        <div className="space-y-6">
          
          {/* Smart Low Stock Alerts (Chương 6.5) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Cảnh Báo Tồn Kho Online</span>
              </h4>
              <button 
                onClick={() => onNavigateTab('inventory')}
                className="text-[11px] font-bold text-[#ee4d2d] hover:underline"
              >
                Điều chuyển
              </button>
            </div>

            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">Tất cả món đều đảm bảo trên ngưỡng tồn tối thiểu an toàn.</p>
            ) : (
              <div className="space-y-2">
                {lowStockItems.slice(0, 4).map(item => (
                  <div key={item.id} className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-amber-700">
                        Online còn: <strong className="text-red-600">{item.onlineStock}</strong> phần (Offline còn: {item.offlineStock})
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateTab('inventory')}
                      className="px-2 py-1 bg-white border border-amber-300 text-amber-800 rounded-md text-[11px] font-bold hover:bg-amber-100 transition"
                    >
                      Bổ sung
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Best-Sellers list */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ee4d2d]" />
              <span>Top Món Bán Chạy Nhất Hôm Nay</span>
            </h4>
            <div className="space-y-3">
              {bestSellers.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 font-bold text-slate-600 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </div>
                  <div className="text-slate-500 font-medium">
                    <strong className="text-slate-900 tabular-nums">{item.salesCount}</strong> đã bán
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
