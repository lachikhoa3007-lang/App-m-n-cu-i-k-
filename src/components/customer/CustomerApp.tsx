import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { FoodItem, FoodCategory, PaymentMethod } from '../../types';
import { HUTECH_LOCATIONS } from '../../data/initialData';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  ChevronRight, 
  ArrowLeft,
  UtensilsCrossed,
  Phone,
  User,
  CreditCard,
  QrCode,
  Lock,
  Sparkles
} from 'lucide-react';

interface CustomerAppProps {
  onSwitchToAdmin?: () => void;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({ onSwitchToAdmin }) => {
  const { 
    foodItems, 
    orders, 
    timeSlots, 
    vouchers, 
    placeOrder, 
    updateOrderStatus,
    isStoreOpen 
  } = useCanteen();

  // Student details
  const [studentId, setStudentId] = useState<string>('24808900033');
  const [studentName, setStudentName] = useState<string>('La Chí Khoa');
  const [studentPhone, setStudentPhone] = useState<string>('0908123456');

  // Order config
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(timeSlots[0]?.timeRange || '11:15 - 12:00');
  const [deliveryLocation, setDeliveryLocation] = useState<string>(HUTECH_LOCATIONS[1]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ONLINE');

  // Filter & Search
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart: foodId -> { quantity, notes }
  const [cart, setCart] = useState<{ [foodId: number]: { quantity: number; notes: string } }>({
    1: { quantity: 1, notes: 'Ít hành lá' },
    20: { quantity: 1, notes: 'Nhiều đá, ít ngọt' }
  });

  // Voucher
  const [voucherInput, setVoucherInput] = useState<string>('HUTECHSTART');
  const [appliedVoucher, setAppliedVoucher] = useState<string>('HUTECHSTART');

  // View state: 'menu' | 'cart' | 'tracking'
  const [viewState, setViewState] = useState<'menu' | 'cart' | 'tracking'>('menu');
  const [trackedOrderId, setTrackedOrderId] = useState<string>(orders[0]?.id || '');
  const [orderNotification, setOrderNotification] = useState<string>('');

  // Filtered menu
  const filteredFoods = foodItems.filter(food => {
    const matchesCat = activeCategory === 'all' || food.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = food.name.toLowerCase().includes(query) || food.description.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  // Cart operations
  const addToCart = (food: FoodItem) => {
    const existing = cart[food.id];
    const currentQty = existing ? existing.quantity : 0;
    if (currentQty + 1 > food.onlineStock) {
      alert(`Món "${food.name}" chỉ còn ${food.onlineStock} phần trong kho Online!`);
      return;
    }
    setCart(prev => ({
      ...prev,
      [food.id]: {
        quantity: currentQty + 1,
        notes: existing ? existing.notes : ''
      }
    }));
  };

  const updateCartQty = (foodId: number, delta: number) => {
    const food = foodItems.find(f => f.id === foodId);
    if (!food) return;

    const current = cart[foodId];
    if (!current) return;

    const newQty = current.quantity + delta;
    if (newQty <= 0) {
      const copy = { ...cart };
      delete copy[foodId];
      setCart(copy);
      return;
    }

    if (newQty > food.onlineStock) {
      alert(`Món "${food.name}" chỉ còn ${food.onlineStock} phần tồn Online!`);
      return;
    }

    setCart(prev => ({
      ...prev,
      [foodId]: { ...prev[foodId], quantity: newQty }
    }));
  };

  const updateCartNotes = (foodId: number, notes: string) => {
    setCart(prev => ({
      ...prev,
      [foodId]: { ...prev[foodId], notes }
    }));
  };

  // Pricing
  const subtotal = Object.entries(cart).reduce((sum, [id, data]) => {
    const food = foodItems.find(f => f.id === Number(id));
    return sum + (food ? food.price * data.quantity : 0);
  }, 0);

  let discount = 0;
  if (appliedVoucher) {
    const vc = vouchers.find(v => v.code === appliedVoucher);
    if (vc && subtotal >= vc.minSpend) {
      if (vc.discountAmount) {
        discount = vc.discountAmount;
      } else if (vc.discountPercent) {
        discount = Math.min(15000, Math.round((subtotal * vc.discountPercent) / 100));
      }
    }
  }
  const total = Math.max(0, subtotal - discount);

  // Submit Order
  const handlePlaceOrder = () => {
    const cartEntries = Object.entries(cart);
    if (cartEntries.length === 0) {
      alert('Giỏ hàng trống! Vui lòng chọn món trước.');
      return;
    }

    const items = cartEntries.map(([id, data]) => {
      const food = foodItems.find(f => f.id === Number(id))!;
      return {
        foodId: Number(id),
        foodName: food.name,
        quantity: data.quantity,
        price: food.price,
        notes: data.notes
      };
    });

    const res = placeOrder({
      studentId,
      studentName,
      studentPhone,
      deliveryLocation,
      timeSlot: selectedTimeSlot,
      paymentMethod,
      isPaid: paymentMethod === 'ONLINE',
      items,
      subtotal,
      discount,
      voucherCode: appliedVoucher || undefined,
      total
    });

    if (res.success && res.orderId) {
      setCart({});
      setTrackedOrderId(res.orderId);
      setViewState('tracking');
      setOrderNotification(res.message);
      setTimeout(() => setOrderNotification(''), 5000);
    } else {
      alert(res.message);
    }
  };

  const trackedOrder = orders.find(o => o.id === trackedOrderId) || orders[0];

  const cartTotalCount = Object.values(cart).reduce((s, it) => s + it.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Student App Navigation Bar */}
      <div className="bg-[#ee4d2d] text-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight leading-tight">CĂN TIN KHU E · HUTECH</h1>
              <p className="text-[11px] text-white/80">Đặt món trực tuyến - Giảm thời gian xếp hàng</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSwitchToAdmin && (
              <button
                onClick={onSwitchToAdmin}
                className="px-2.5 py-1 bg-black/20 hover:bg-black/30 rounded-lg text-xs font-semibold text-white/90"
              >
                Vào Quản Trị &rarr;
              </button>
            )}

            <button
              onClick={() => setViewState(viewState === 'cart' ? 'menu' : 'cart')}
              className="relative p-2 bg-white text-[#ee4d2d] rounded-xl font-bold shadow-xs flex items-center gap-1.5 text-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {cartTotalCount > 0 && (
                <span className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {cartTotalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner with Food Image */}
      <div className="max-w-4xl mx-auto px-4 mt-3">
        <div className="relative rounded-2xl overflow-hidden shadow-md bg-slate-900 h-44 sm:h-52">
          <img
            src="/src/assets/images/shopeefood_canteen_hero_1792849836340.jpg"
            alt="Căn Tin Khu E HUTECH Món Ngon"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Khu Công Nghệ Cao · TP. Thủ Đức
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Cơm Trưa & Món Nóng Sinh Viên HUTECH
            </h2>
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
              29 món ăn chất lượng: Phở bò, Cơm sườn nướng, Bún bò, Cafe sữa - Giao tận cửa phòng học
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-4 space-y-4">
        
        {/* Success Alert Banner */}
        {orderNotification && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-md text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{orderNotification}</span>
          </div>
        )}

        {/* View Tabs */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold">
          <button
            onClick={() => setViewState('menu')}
            className={`flex-1 py-2 text-center rounded-xl transition ${
              viewState === 'menu' ? 'bg-[#ee4d2d] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            🍔 Chọn Món ({foodItems.length} Món)
          </button>
          <button
            onClick={() => setViewState('cart')}
            className={`flex-1 py-2 text-center rounded-xl transition flex items-center justify-center gap-1.5 ${
              viewState === 'cart' ? 'bg-[#ee4d2d] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>🛒 Giỏ Hàng & Thanh Toán</span>
            {cartTotalCount > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-[#ee4d2d] rounded-full text-[10px]">
                {cartTotalCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setViewState('tracking')}
            className={`flex-1 py-2 text-center rounded-xl transition ${
              viewState === 'tracking' ? 'bg-[#ee4d2d] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            📍 Theo Dõi Đơn Hàng
          </button>
        </div>

        {/* ===================== VIEW 1: MENU SELECTION ===================== */}
        {viewState === 'menu' && (
          <div className="space-y-4">
            
            {/* Student Info & Slot Selector Header Strip */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#ee4d2d]" />
                  <span>Sinh viên: <strong>{studentName}</strong> (MSSV: <span className="font-mono">{studentId}</span>)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{studentPhone}</span>
                </div>
              </div>

              {/* Time slot selector with Capacity feedback (BR06) */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#ee4d2d]" />
                  <span>Chọn Khung giờ nhận đồ ăn:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map(slot => {
                    const isFull = slot.currentOrders >= slot.maxCapacity || slot.isLocked;
                    const isSelected = selectedTimeSlot === slot.timeRange;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => {
                          if (!isFull) setSelectedTimeSlot(slot.timeRange);
                        }}
                        disabled={isFull}
                        className={`p-2.5 rounded-xl border text-left text-xs transition flex flex-col justify-between ${
                          isSelected 
                            ? 'border-[#ee4d2d] bg-orange-50/70 text-slate-900 ring-1 ring-[#ee4d2d]' 
                            : isFull 
                              ? 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed' 
                              : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold">{slot.timeRange}</div>
                        <div className="text-[10px] mt-1">
                          {slot.isLocked ? (
                            <span className="text-rose-600 font-bold flex items-center gap-0.5">
                              <Lock className="w-3 h-3" /> Đã tạm khóa
                            </span>
                          ) : isFull ? (
                            <span className="text-rose-600 font-bold">Đầy công suất</span>
                          ) : (
                            <span className="text-emerald-700">Còn {slot.maxCapacity - slot.currentOrders} chỗ</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delivery location selector */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#ee4d2d]" />
                  <span>Địa điểm nhận món tại Khu E:</span>
                </div>
                <select
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  {HUTECH_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Category Filter & Search */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['all', 'Món chính', 'Nước & Ăn vặt', 'Món thêm'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition ${
                      activeCategory === cat 
                        ? 'bg-[#ee4d2d] text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả (29 món)' : cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm món ngon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredFoods.map(food => {
                const inCartQty = cart[food.id]?.quantity || 0;
                const isOutOfStock = food.onlineStock <= 0 || !food.active;

                return (
                  <div 
                    key={food.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{food.name}</h4>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">{food.category}</span>
                        </div>
                        <span className="font-black text-slate-900 tabular-nums text-sm">
                          {food.price.toLocaleString('vi-VN')}₫
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {food.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div>
                        {isOutOfStock ? (
                          <span className="text-rose-600 font-bold text-[11px]">Hết hàng Online</span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">
                            Kho Online: <strong className="text-emerald-600 font-bold">{food.onlineStock} phần</strong>
                          </span>
                        )}
                      </div>

                      {inCartQty > 0 ? (
                        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateCartQty(food.id, -1)}
                            className="text-[#ee4d2d] hover:bg-white rounded p-0.5"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-[#ee4d2d] tabular-nums text-xs min-w-4 text-center">
                            {inCartQty}
                          </span>
                          <button
                            onClick={() => updateCartQty(food.id, 1)}
                            disabled={inCartQty >= food.onlineStock}
                            className="text-[#ee4d2d] hover:bg-white rounded p-0.5 disabled:opacity-30"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(food)}
                          disabled={isOutOfStock}
                          className="px-3 py-1.5 bg-[#ee4d2d] hover:bg-red-600 text-white rounded-xl font-bold text-xs disabled:opacity-30 disabled:pointer-events-none transition shadow-xs flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom floating Checkout Strip if cart has items */}
            {cartTotalCount > 0 && (
              <div className="fixed bottom-3 left-4 right-4 max-w-4xl mx-auto z-40">
                <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Đã chọn {cartTotalCount} món:</div>
                    <div className="text-base font-black text-amber-400 tabular-nums">
                      {total.toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                  <button
                    onClick={() => setViewState('cart')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#ee4d2d] hover:bg-red-600 text-white font-bold text-xs rounded-xl transition shadow-md"
                  >
                    <span>Xem Giỏ Hàng & Đặt Món</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ===================== VIEW 2: CART & CHECKOUT ===================== */}
        {viewState === 'cart' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#ee4d2d]" />
                  <h3 className="font-bold text-base text-slate-900">Chi Tiết Giỏ Hàng Sinh Viên</h3>
                </div>
                <button
                  onClick={() => setViewState('menu')}
                  className="text-xs font-semibold text-[#ee4d2d] hover:underline"
                >
                  + Thêm món khác
                </button>
              </div>

              {Object.keys(cart).length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <p>Giỏ hàng của bạn đang trống.</p>
                  <button
                    onClick={() => setViewState('menu')}
                    className="mt-3 px-4 py-2 bg-[#ee4d2d] text-white rounded-xl font-bold text-xs"
                  >
                    Quay lại chọn món
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {Object.entries(cart).map(([id, data]) => {
                    const food = foodItems.find(f => f.id === Number(id));
                    if (!food) return null;

                    return (
                      <div key={id} className="py-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{food.name}</div>
                            <div className="text-xs text-slate-500 tabular-nums">
                              {food.price.toLocaleString('vi-VN')}₫ / phần
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                              <button
                                onClick={() => updateCartQty(food.id, -1)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-600"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-bold text-xs min-w-5 text-center tabular-nums">
                                {data.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQty(food.id, 1)}
                                disabled={data.quantity >= food.onlineStock}
                                className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="font-bold text-slate-900 text-xs tabular-nums min-w-16 text-right">
                              {(data.quantity * food.price).toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        </div>

                        {/* Special instructions / notes */}
                        <input
                          type="text"
                          placeholder="Ghi chú khẩu vị (VD: không hành, nhiều ớt, ít ngọt...)"
                          value={data.notes}
                          onChange={(e) => updateCartNotes(food.id, e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Voucher Code Box */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#ee4d2d]" />
                  <span className="text-xs font-bold text-slate-700">Mã giảm giá sinh viên:</span>
                </div>
                <div className="flex gap-2 mt-1.5">
                  <input
                    type="text"
                    placeholder="Nhập mã: HUTECHSTART hoặc FREESHIPKHUE"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl font-mono uppercase"
                  />
                  <button
                    onClick={() => {
                      setAppliedVoucher(voucherInput.trim());
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    Áp dụng
                  </button>
                </div>
                {appliedVoucher && discount > 0 && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ✓ Đã áp dụng mã {appliedVoucher}: Giảm {discount.toLocaleString('vi-VN')}₫
                  </p>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-700">Hình thức thanh toán:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-3 rounded-xl border text-left font-bold transition flex items-center gap-2 ${
                      paymentMethod === 'ONLINE' 
                        ? 'border-[#ee4d2d] bg-orange-50 text-[#ee4d2d]' 
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Chuyển Khoản QR Online</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-xl border text-left font-bold transition flex items-center gap-2 ${
                      paymentMethod === 'COD' 
                        ? 'border-[#ee4d2d] bg-orange-50 text-[#ee4d2d]' 
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Tiền Mặt COD (Khi Nhận)</span>
                  </button>
                </div>
              </div>

              {/* Summary Calculations */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Tạm tính tiền món:</span>
                  <span className="tabular-nums font-semibold">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Giảm giá Voucher:</span>
                    <span className="tabular-nums">-{discount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí giao nội khu HUTECH:</span>
                  <span className="text-emerald-600 font-bold">0₫ (Miễn phí)</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                  <span>Tổng thanh toán:</span>
                  <span className="text-[#ee4d2d] tabular-nums">{total.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={Object.keys(cart).length === 0}
                className="w-full py-3.5 bg-[#ee4d2d] hover:bg-red-600 text-white font-bold text-sm rounded-xl transition shadow-md disabled:opacity-40"
              >
                Xác Nhận Đặt Món Ngay ({total.toLocaleString('vi-VN')}₫)
              </button>

            </div>
          </div>
        )}

        {/* ===================== VIEW 3: ORDER TRACKING ===================== */}
        {viewState === 'tracking' && trackedOrder && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-lg">Đơn Hàng #{trackedOrder.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      trackedOrder.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      trackedOrder.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                      'bg-orange-100 text-[#ee4d2d]'
                    }`}>
                      {trackedOrder.status === 'pending' ? 'Chờ xác nhận' :
                       trackedOrder.status === 'preparing' ? 'Đang chế biến' :
                       trackedOrder.status === 'ready' ? 'Sẵn sàng nhận' :
                       trackedOrder.status === 'delivering' ? 'Đang giao nội khu' :
                       trackedOrder.status === 'completed' ? 'Đã hoàn tất' : 'Đã hủy'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Đặt lúc: {trackedOrder.createdAt}</div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-[#ee4d2d] tabular-nums">
                    {trackedOrder.total.toLocaleString('vi-VN')}₫
                  </div>
                  <div className="text-[11px] text-slate-500">{trackedOrder.paymentMethod}</div>
                </div>
              </div>

              {/* Real-time Order Progress Stepper */}
              <div className="py-4">
                <div className="text-xs font-bold text-slate-700 mb-3">Tiến trình chuẩn bị món:</div>
                <div className="grid grid-cols-4 text-center text-[11px] font-semibold gap-1">
                  
                  {/* Step 1: Placed */}
                  <div className="space-y-1">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div className="text-slate-800">Đã đặt đơn</div>
                  </div>

                  {/* Step 2: Preparing */}
                  <div className="space-y-1">
                    <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                      trackedOrder.status !== 'pending' && trackedOrder.status !== 'cancelled'
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      2
                    </div>
                    <div className={trackedOrder.status === 'preparing' ? 'text-[#ee4d2d] font-bold' : 'text-slate-600'}>
                      Đang nấu
                    </div>
                  </div>

                  {/* Step 3: Ready / Delivering */}
                  <div className="space-y-1">
                    <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                      trackedOrder.status === 'ready' || trackedOrder.status === 'delivering' || trackedOrder.status === 'completed'
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      3
                    </div>
                    <div className={trackedOrder.status === 'ready' || trackedOrder.status === 'delivering' ? 'text-[#ee4d2d] font-bold' : 'text-slate-600'}>
                      Giao hàng
                    </div>
                  </div>

                  {/* Step 4: Completed */}
                  <div className="space-y-1">
                    <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                      trackedOrder.status === 'completed'
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      4
                    </div>
                    <div className={trackedOrder.status === 'completed' ? 'text-emerald-600 font-bold' : 'text-slate-600'}>
                      Hoàn thành
                    </div>
                  </div>

                </div>
              </div>

              {/* Delivery Details */}
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700">
                <div>📍 Điểm nhận hàng: <strong className="text-slate-900">{trackedOrder.deliveryLocation}</strong></div>
                <div>🕒 Khung giờ hẹn nhận: <strong className="text-indigo-700">{trackedOrder.timeSlot}</strong></div>
                <div>👤 Người nhận: {trackedOrder.studentName} ({trackedOrder.studentPhone})</div>
              </div>

              {/* Dishes list */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-500 text-[11px] uppercase">Món trong đơn:</div>
                {trackedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-slate-100 last:border-none">
                    <span>{it.quantity}x {it.foodName} {it.notes && `(${it.notes})`}</span>
                    <span className="tabular-nums font-semibold">{(it.quantity * it.price).toLocaleString('vi-VN')}₫</span>
                  </div>
                ))}
              </div>

              {/* Cancel Button if still pending (BR13) */}
              {trackedOrder.status === 'pending' && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này? Tồn kho món ăn sẽ được hoàn lại.')) {
                        updateOrderStatus(trackedOrder.id, 'cancelled', 'Sinh viên chủ động hủy trước khi bếp nấu');
                      }
                    }}
                    className="w-full py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition"
                  >
                    Hủy đơn hàng này (Hoàn tồn kho)
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
