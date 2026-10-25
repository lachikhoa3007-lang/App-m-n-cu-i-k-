import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { FoodItem } from '../../types';
import { 
  Store, 
  X, 
  Search, 
  Check, 
  ShoppingBag, 
  Trash2, 
  CreditCard, 
  DollarSign,
  AlertCircle 
} from 'lucide-react';

interface PosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PosModal: React.FC<PosModalProps> = ({ isOpen, onClose }) => {
  const { foodItems, recordDirectOfflineSale } = useCanteen();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<{ [foodId: number]: number }>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const filteredFoods = foodItems.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) && f.active
  );

  const addToPosCart = (food: FoodItem) => {
    const currentQty = cart[food.id] || 0;
    if (currentQty + 1 > food.offlineStock) {
      alert(`Tồn kho Offline của "${food.name}" chỉ còn ${food.offlineStock} phần!`);
      return;
    }
    setCart(prev => ({ ...prev, [food.id]: currentQty + 1 }));
  };

  const removeFromPosCart = (foodId: number) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[foodId];
      return copy;
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const food = foodItems.find(f => f.id === Number(id));
      return sum + (food ? food.price * qty : 0);
    }, 0);
  };

  const handleCheckout = (paymentType: 'TIỀN MẶT' | 'CHUYỂN KHOẢN TẠI QUẦY') => {
    const entries = Object.entries(cart);
    if (entries.length === 0) return;

    for (const [id, qty] of entries) {
      recordDirectOfflineSale(Number(id), qty);
    }

    setSuccessMessage(`Đã hoàn tất thanh toán ${calculateTotal().toLocaleString('vi-VN')}₫ (${paymentType}) và trừ tồn kho Offline tại quầy thành công!`);
    setCart({});
    setTimeout(() => {
      setSuccessMessage('');
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">QUẦY BÁN TRỰC TIẾP TẠI CĂN TIN (POS OFFLINE)</h3>
              <p className="text-[11px] text-slate-400">Trừ trực tiếp kho Offline theo BR04 - Không ảnh hưởng tồn Online của sinh viên</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body: Split into Menu and Cart */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left: Food Selector */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 border-r border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm món ăn nhanh tại quầy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredFoods.map(food => (
                <button
                  key={food.id}
                  onClick={() => addToPosCart(food)}
                  disabled={food.offlineStock <= 0}
                  className="p-3 text-left bg-slate-50 hover:bg-orange-50/80 border border-slate-200 hover:border-orange-300 rounded-xl transition flex flex-col justify-between disabled:opacity-30 disabled:pointer-events-none group"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs group-hover:text-[#ee4d2d]">
                      {food.name}
                    </div>
                    <div className="text-[10px] text-slate-500">{food.category}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 tabular-nums">{food.price.toLocaleString('vi-VN')}₫</span>
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-100/60 px-1.5 py-0.5 rounded">
                      Quầy: {food.offlineStock}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: POS Order Ticket */}
          <div className="w-full md:w-80 p-5 bg-slate-50 flex flex-col justify-between">
            <div className="space-y-4 overflow-y-auto">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-200 flex justify-between">
                <span>Hóa đơn khách tại quầy</span>
                <span>{Object.keys(cart).length} món</span>
              </div>

              {Object.keys(cart).length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <span>Chọn món từ danh sách bên trái để thêm vào hóa đơn thanh toán</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(cart).map(([id, qty]) => {
                    const food = foodItems.find(f => f.id === Number(id));
                    if (!food) return null;
                    return (
                      <div key={id} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{food.name}</div>
                          <div className="text-[11px] text-slate-500 tabular-nums">
                            {qty} x {food.price.toLocaleString('vi-VN')}₫ = {(qty * food.price).toLocaleString('vi-VN')}₫
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromPosCart(food.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Total & Checkout buttons */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-600">Tổng tiền khách trả:</span>
                <span className="text-xl font-black text-[#ee4d2d] tabular-nums">
                  {calculateTotal().toLocaleString('vi-VN')}₫
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCheckout('TIỀN MẶT')}
                  disabled={Object.keys(cart).length === 0}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs disabled:opacity-40 transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Tiền Mặt</span>
                </button>
                <button
                  onClick={() => handleCheckout('CHUYỂN KHOẢN TẠI QUẦY')}
                  disabled={Object.keys(cart).length === 0}
                  className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs disabled:opacity-40 transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Quét QR Quầy</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
