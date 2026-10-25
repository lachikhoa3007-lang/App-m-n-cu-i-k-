import React, { useState } from 'react';
import { FoodItem, FoodCategory } from '../../types';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Package, 
  ArrowLeftRight, 
  AlertTriangle, 
  Search, 
  ArrowRight, 
  ArrowLeft, 
  ShoppingBag, 
  History, 
  Check, 
  Sliders, 
  Edit3, 
  Plus, 
  Minus, 
  CheckCircle2, 
  X, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const InventoryDualChannel: React.FC = () => {
  const { 
    foodItems, 
    transferStock, 
    recordDirectOfflineSale, 
    transferLogs,
    updateStockValues 
  } = useCanteen();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal 1: Dual Channel Transfer (Chuyển 5 phần qua lại giữa Online <-> Offline theo BR09)
  const [transferModalItem, setTransferModalItem] = useState<{
    item: FoodItem;
    direction: 'offline_to_online' | 'online_to_offline';
  } | null>(null);
  const [transferAmount, setTransferAmount] = useState<number>(5);
  const [transferReason, setTransferReason] = useState<string>('Điều chuyển phục vụ giờ cao điểm trực tuyến');

  // Modal 2: Custom Individual Stock Adjustment (Tùy chỉnh số lượng tồn riêng từng kênh theo BR08)
  const [adjustModalItem, setAdjustModalItem] = useState<FoodItem | null>(null);
  const [customOnlineStock, setCustomOnlineStock] = useState<number>(0);
  const [customOfflineStock, setCustomOfflineStock] = useState<number>(0);
  const [customMinStock, setCustomMinStock] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Kiểm kê thực tế và điều chỉnh định mức kho');
  const [customReasonText, setCustomReasonText] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string>('');

  // Filter food items
  const filteredItems = foodItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
    
    let matchesStock = true;
    if (stockStatusFilter === 'low') {
      matchesStock = item.onlineStock <= item.minStock && item.onlineStock > 0;
    } else if (stockStatusFilter === 'out') {
      matchesStock = item.onlineStock === 0;
    } else if (stockStatusFilter === 'available') {
      matchesStock = item.onlineStock > item.minStock;
    }

    return matchesCat && matchesSearch && matchesStock;
  });

  // Calculate totals
  const totalOnline = foodItems.reduce((sum, item) => sum + item.onlineStock, 0);
  const totalOffline = foodItems.reduce((sum, item) => sum + item.offlineStock, 0);
  const lowCount = foodItems.filter(item => item.onlineStock <= item.minStock && item.active).length;

  // Handle stock transfer
  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferModalItem) return;

    const ok = transferStock(
      transferModalItem.item.id,
      transferModalItem.direction,
      transferAmount,
      transferReason
    );

    if (ok) {
      setSuccessToast(`Đã điều chuyển ${transferAmount} phần "${transferModalItem.item.name}" thành công!`);
      setTransferModalItem(null);
      setTimeout(() => setSuccessToast(''), 3500);
    } else {
      alert('Không đủ số lượng trong kho nguồn để điều chuyển!');
    }
  };

  // Open Custom Stock Adjustment modal for a specific food item
  const openCustomAdjustModal = (item: FoodItem) => {
    setAdjustModalItem(item);
    setCustomOnlineStock(item.onlineStock);
    setCustomOfflineStock(item.offlineStock);
    setCustomMinStock(item.minStock);
    setAdjustReason('Kiểm kê thực tế và điều chỉnh định mức kho');
    setCustomReasonText('');
  };

  // Handle saving custom individual stock
  const handleSaveCustomStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalItem) return;

    const finalReason = adjustReason === 'Khác' 
      ? (customReasonText.trim() || 'Tùy chỉnh số lượng tồn kho theo yêu cầu quản lý')
      : adjustReason;

    updateStockValues(
      adjustModalItem.id,
      Number(customOnlineStock),
      Number(customOfflineStock),
      Number(customMinStock),
      finalReason
    );

    setSuccessToast(`Đã cập nhật tồn kho riêng cho món "${adjustModalItem.name}" thành công!`);
    setAdjustModalItem(null);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Quản Lý Tồn Kho 2 Kênh & Tùy Chỉnh Kho Riêng
          </h2>
          <p className="text-xs text-slate-500">
            Hỗ trợ cả 2 nghiệp vụ chuẩn theo Báo cáo HUTECH: Điều chuyển qua lại giữa 2 kênh (BR09) và Tùy chỉnh tồn kho riêng lẻ từng món có lưu nhật ký truy vết (BR08).
          </p>
        </div>

        {/* Quick Custom Adjust Modal Trigger from top */}
        <button
          onClick={() => {
            if (filteredItems.length > 0) {
              openCustomAdjustModal(filteredItems[0]);
            } else if (foodItems.length > 0) {
              openCustomAdjustModal(foodItems[0]);
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Tùy Chỉnh Tồn Kho Món Ăn</span>
        </button>
      </div>

      {/* Success Toast Banner */}
      {successToast && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-md text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Tổng Tồn Kho Online (App)</div>
          <div className="text-2xl font-black text-[#ee4d2d] tabular-nums mt-1">
            {totalOnline} <span className="text-xs font-medium text-slate-500">phần</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Dành riêng cho đơn sinh viên đặt trước</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Tổng Tồn Kho Offline (Tại Quầy)</div>
          <div className="text-2xl font-black text-amber-600 tabular-nums mt-1">
            {totalOffline} <span className="text-xs font-medium text-slate-500">phần</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Phục vụ khách xếp hàng mua trực tiếp</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Món Sắp Chạm Tồn Tối Thiểu</div>
          <div className="text-2xl font-black text-rose-600 tabular-nums mt-1">
            {lowCount} <span className="text-xs font-medium text-slate-500">món</span>
          </div>
          <div className="text-[11px] text-rose-500 mt-1">Cần điều chuyển hoặc nấu thêm</div>
        </div>
      </div>

      {/* Control & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category & Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Món chính', 'Nước & Ăn vặt', 'Món thêm'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tất cả danh mục (29 món)' : cat}
            </button>
          ))}

          <span className="text-slate-300 hidden md:inline">|</span>

          {/* Status filter */}
          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="text-xs p-1.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
          >
            <option value="all">Tất cả trạng thái tồn</option>
            <option value="available">Còn hàng an toàn</option>
            <option value="low">Sắp hết Online</option>
            <option value="out">Hết hàng Online</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tên món ăn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
          />
        </div>

      </div>

      {/* 29 Dishes Inventory Dual Channel Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-10 text-center">STT</th>
                <th className="py-3 px-4">Tên Món Ăn</th>
                <th className="py-3 px-3">Danh Mục</th>
                <th className="py-3 px-3 text-center bg-orange-50/50 text-[#ee4d2d]">Tồn Online</th>
                <th className="py-3 px-3 text-center bg-amber-50/50 text-amber-700">Tồn Quầy</th>
                <th className="py-3 px-3 text-center">Tổng Khả Dụng</th>
                <th className="py-3 px-3 text-center">Tồn An Toàn</th>
                <th className="py-3 px-3 text-center">Trạng Thái</th>
                <th className="py-3 px-3 text-center bg-slate-100/60">Tùy Chỉnh Kho (BR08)</th>
                <th className="py-3 px-3 text-center">Điều Chuyển Kênh (BR09)</th>
                <th className="py-3 px-3 text-center">Bán Quầy (BR04)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, index) => {
                const totalAvail = item.onlineStock + item.offlineStock;
                const isLow = item.onlineStock <= item.minStock && item.onlineStock > 0;
                const isOut = item.onlineStock === 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {index + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{item.description}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {item.category}
                    </td>

                    {/* Online Stock */}
                    <td className="py-3 px-3 text-center bg-orange-50/30">
                      <span className={`font-black tabular-nums text-sm ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-[#ee4d2d]'}`}>
                        {item.onlineStock}
                      </span>
                    </td>

                    {/* Offline Stock */}
                    <td className="py-3 px-3 text-center bg-amber-50/30">
                      <span className="font-black tabular-nums text-sm text-slate-800">
                        {item.offlineStock}
                      </span>
                    </td>

                    {/* Total Available */}
                    <td className="py-3 px-3 text-center font-bold text-slate-700 tabular-nums">
                      {totalAvail}
                    </td>

                    {/* Min Safety Stock */}
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {item.minStock}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      {isOut ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded-full text-[10px]">
                          Hết Online
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded-full text-[10px]">
                          Sắp hết
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-[10px]">
                          Còn hàng
                        </span>
                      )}
                    </td>

                    {/* Custom Individual Stock Action Button (BR08) */}
                    <td className="py-3 px-3 text-center bg-slate-50/50">
                      <button
                        onClick={() => openCustomAdjustModal(item)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition flex items-center gap-1 mx-auto shadow-2xs"
                        title="Tùy chỉnh số lượng tồn kho Online, Offline và tồn an toàn riêng cho món này"
                      >
                        <Sliders className="w-3 h-3 text-indigo-600" />
                        <span>Tùy chỉnh kho</span>
                      </button>
                    </td>

                    {/* Dual-Channel Transfer Controls (BR09) */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setTransferModalItem({ item, direction: 'offline_to_online' });
                            setTransferAmount(5);
                          }}
                          disabled={item.offlineStock < 5}
                          className="px-2 py-1 text-[10px] font-bold rounded-md border border-orange-200 text-[#ee4d2d] hover:bg-orange-50 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-0.5"
                          title="Chuyển từ quầy Offline sang App Online"
                        >
                          <ArrowLeft className="w-2.5 h-2.5" />
                          <span>+5 Onl</span>
                        </button>

                        <button
                          onClick={() => {
                            setTransferModalItem({ item, direction: 'online_to_offline' });
                            setTransferAmount(5);
                          }}
                          disabled={item.onlineStock < 5}
                          className="px-2 py-1 text-[10px] font-bold rounded-md border border-amber-200 text-amber-700 hover:bg-amber-50 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-0.5"
                          title="Chuyển từ App Online sang quầy Offline"
                        >
                          <span>+5 Quầy</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </td>

                    {/* Direct Counter Sale (BR04) */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          const ok = recordDirectOfflineSale(item.id, 1);
                          if (!ok) alert('Tồn kho Offline đã hết, không thể bán tại quầy!');
                        }}
                        disabled={item.offlineStock <= 0}
                        className="px-2 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md disabled:opacity-30 transition flex items-center justify-center gap-1 mx-auto"
                        title="Bán nhanh 1 suất trực tiếp tại quầy POS, chỉ trừ tồn Offline"
                      >
                        <ShoppingBag className="w-3 h-3 text-slate-500" />
                        <span>-1</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== MODAL 1: TÙY CHỈNH TỒN KHO RIÊNG (BR08) ===================== */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <form onSubmit={handleSaveCustomStock} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-700">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Tùy Chỉnh Tồn Kho Riêng Món Ăn (BR08)
                  </h3>
                  <p className="text-[11px] text-slate-500">Cập nhật trực tiếp số lượng tồn kho theo kiểm kê thực tế</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setAdjustModalItem(null)} 
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Food Selector (in case opened from top button) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Chọn món ăn cần chỉnh sửa tồn kho:</label>
              <select
                value={adjustModalItem.id}
                onChange={(e) => {
                  const target = foodItems.find(f => f.id === Number(e.target.value));
                  if (target) openCustomAdjustModal(target);
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                {foodItems.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.category}) - Hiện có: Online {f.onlineStock} / Quầy {f.offlineStock} phần
                  </option>
                ))}
              </select>
            </div>

            {/* Current vs New Stock Config Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              
              {/* Field 1: Online Stock */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#ee4d2d]">
                    Tồn Kho Online (App):
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Hiện tại: <strong>{adjustModalItem.onlineStock}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    value={customOnlineStock}
                    onChange={(e) => setCustomOnlineStock(Math.max(0, Number(e.target.value)))}
                    required
                    className="w-full text-sm font-black p-2 border border-slate-300 rounded-xl bg-white text-[#ee4d2d] tabular-nums"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">phần</span>
                </div>

                {/* Quick Online delta adjustment buttons */}
                <div className="flex items-center gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setCustomOnlineStock(prev => Math.max(0, prev - 5))}
                    className="px-2 py-0.5 text-[10px] font-bold bg-white hover:bg-slate-200 border border-slate-300 rounded text-slate-700"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomOnlineStock(prev => prev + 5)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-white hover:bg-slate-200 border border-slate-300 rounded text-slate-700"
                  >
                    +5
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomOnlineStock(prev => prev + 10)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-white hover:bg-slate-200 border border-slate-300 rounded text-slate-700"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomOnlineStock(0)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded text-rose-700"
                  >
                    Báo hết (0)
                  </button>
                </div>
              </div>

              {/* Field 2: Offline Stock */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-700">
                    Tồn Kho Offline (Quầy):
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Hiện tại: <strong>{adjustModalItem.offlineStock}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    value={customOfflineStock}
                    onChange={(e) => setCustomOfflineStock(Math.max(0, Number(e.target.value)))}
                    required
                    className="w-full text-sm font-black p-2 border border-slate-300 rounded-xl bg-white text-slate-800 tabular-nums"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">phần</span>
                </div>

                {/* Quick Offline delta adjustment buttons */}
                <div className="flex items-center gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setCustomOfflineStock(prev => Math.max(0, prev - 5))}
                    className="px-2 py-0.5 text-[10px] font-bold bg-white hover:bg-slate-200 border border-slate-300 rounded text-slate-700"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomOfflineStock(prev => prev + 5)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-white hover:bg-slate-200 border border-slate-300 rounded text-slate-700"
                  >
                    +5
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomOfflineStock(prev => prev + 10)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-white hover:bg-slate-200 border border-slate-300 rounded text-slate-700"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomOfflineStock(0)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded text-rose-700"
                  >
                    Báo hết (0)
                  </button>
                </div>
              </div>

              {/* Field 3: Min Safety Stock */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-200/80 flex items-center justify-between gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">
                    Ngưỡng Tồn An Toàn Cảnh Báo (Tồn tối thiểu):
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Khi tồn Online giảm xuống dưới ngưỡng này, hệ thống sẽ phát cảnh báo màu vàng
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <input
                    type="number"
                    min="1"
                    value={customMinStock}
                    onChange={(e) => setCustomMinStock(Math.max(1, Number(e.target.value)))}
                    required
                    className="w-20 text-xs font-bold p-1.5 border border-slate-300 rounded-lg text-center"
                  />
                  <span className="text-xs text-slate-500">phần</span>
                </div>
              </div>

            </div>

            {/* Reason Selection (Bắt buộc theo BR08) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lý do điều chỉnh (Bắt buộc theo quy định BR08 để lưu nhật ký truy vết):</span>
              </label>
              <select
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="Kiểm kê thực tế và điều chỉnh định mức kho">Kiểm kê thực tế và điều chỉnh định mức kho</option>
                <option value="Nhập thêm nguyên liệu / Nấu bổ sung mẻ mới buổi sáng">Nhập thêm nguyên liệu / Nấu bổ sung mẻ mới buổi sáng</option>
                <option value="Xuất hủy do quá hạn bảo quản / hỏng trong quá trình chế biến">Xuất hủy do quá hạn bảo quản / hỏng trong quá trình chế biến</option>
                <option value="Bù trừ sai lệch bán trực tiếp tại quầy chưa kịp quét mã">Bù trừ sai lệch bán trực tiếp tại quầy chưa kịp quét mã</option>
                <option value="Điều chỉnh phân bổ hạn mức phục vụ theo yêu cầu quản lý">Điều chỉnh phân bổ hạn mức phục vụ theo yêu cầu quản lý</option>
                <option value="Khác">Lý do khác (Nhập chi tiết bên dưới)...</option>
              </select>

              {adjustReason === 'Khác' && (
                <input
                  type="text"
                  placeholder="Ghi rõ lý do điều chỉnh..."
                  value={customReasonText}
                  onChange={(e) => setCustomReasonText(e.target.value)}
                  required
                  className="w-full text-xs p-2 border border-slate-300 rounded-xl mt-1.5"
                />
              )}
            </div>

            {/* Total Change Preview */}
            <div className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-xl border border-amber-200/70">
              Biến động: Online{' '}
              <strong className="text-slate-900">{adjustModalItem.onlineStock} ➔ {customOnlineStock}</strong>
              {' '}({customOnlineStock - adjustModalItem.onlineStock >= 0 ? `+${customOnlineStock - adjustModalItem.onlineStock}` : customOnlineStock - adjustModalItem.onlineStock})
              {' · '}
              Quầy{' '}
              <strong className="text-slate-900">{adjustModalItem.offlineStock} ➔ {customOfflineStock}</strong>
              {' '}({customOfflineStock - adjustModalItem.offlineStock >= 0 ? `+${customOfflineStock - adjustModalItem.offlineStock}` : customOfflineStock - adjustModalItem.offlineStock})
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAdjustModalItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Lưu Tồn Kho Mới (BR08)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================== MODAL 2: ĐIỀU CHUYỂN KHO 2 KÊNH (BR09) ===================== */}
      {transferModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleConfirmTransfer} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <ArrowLeftRight className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">
                Xác Nhận Điều Chuyển Kho 2 Kênh (BR09)
              </h3>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div>Món ăn: <strong className="text-slate-900">{transferModalItem.item.name}</strong></div>
              <div>
                Hướng chuyển:{' '}
                <strong className={transferModalItem.direction === 'offline_to_online' ? 'text-[#ee4d2d]' : 'text-amber-600'}>
                  {transferModalItem.direction === 'offline_to_online' 
                    ? 'Từ Quầy Offline ➔ Sang App Online' 
                    : 'Từ App Online ➔ Sang Quầy Offline'}
                </strong>
              </div>
              <div className="text-slate-500 flex justify-between pt-1">
                <span>Tồn Online hiện tại: {transferModalItem.item.onlineStock} phần</span>
                <span>Tồn Quầy hiện tại: {transferModalItem.item.offlineStock} phần</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Số lượng điều chuyển:</label>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTransferAmount(amt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      transferAmount === amt 
                        ? 'bg-[#ee4d2d] text-white border-[#ee4d2d]' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {amt} phần
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Lý do điều chuyển (Bắt buộc theo quy định):</label>
              <select
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
              >
                <option value="Điều chuyển phục vụ giờ cao điểm trực tuyến">Điều chuyển phục vụ giờ cao điểm trực tuyến</option>
                <option value="Sinh viên đặt trước tăng đột biến giờ tan tiết">Sinh viên đặt trước tăng đột biến giờ tan tiết</option>
                <option value="Khách xếp hàng tại quầy đông, bù trừ kho online">Khách xếp hàng tại quầy đông, bù trừ kho online</option>
                <option value="Cân đối tồn cuối ca trưa">Cân đối tồn cuối ca trưa</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTransferModalItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#ee4d2d] hover:bg-red-600 rounded-xl shadow-xs"
              >
                Xác Nhận & Cập Nhật Kho
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transfer & Adjustment Audit Logs (Chương 5.10 & 6.5) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <span>Nhật Ký Điều Chuyển & Tùy Chỉnh Kho Truy Vết (Audit Trail - BR08 & BR09)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {transferLogs.length} bản ghi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase">
              <tr>
                <th className="py-2 px-3">Thời gian</th>
                <th className="py-2 px-3">Món ăn</th>
                <th className="py-2 px-3">Loại Thao Tác</th>
                <th className="py-2 px-3 text-center">Số lượng</th>
                <th className="py-2 px-3">Lý do điều chỉnh / điều chuyển</th>
                <th className="py-2 px-3">Người phê duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transferLogs.slice(0, 8).map(log => {
                const isCustomAdjust = log.reason.startsWith('Tùy chỉnh');

                return (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{log.foodName}</td>
                    <td className="py-2.5 px-3">
                      {isCustomAdjust ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Tùy chỉnh kho riêng (BR08)
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          log.direction === 'offline_to_online' 
                            ? 'bg-orange-50 text-[#ee4d2d]' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {log.direction === 'offline_to_online' ? 'Quầy ➔ Online' : 'Online ➔ Quầy'}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold tabular-nums">
                      {log.amount} phần
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-sm truncate" title={log.reason}>
                      {log.reason}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{log.authorizedBy}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
