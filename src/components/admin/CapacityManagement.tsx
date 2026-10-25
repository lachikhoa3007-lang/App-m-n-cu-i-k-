import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Clock, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  Zap,
  Users
} from 'lucide-react';

export const CapacityManagement: React.FC = () => {
  const { timeSlots, toggleSlotLock, updateSlotCapacity } = useCanteen();
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [customMax, setCustomMax] = useState<number>(50);

  const getTierInfo = (current: number, max: number, isLocked: boolean) => {
    if (isLocked) {
      return {
        label: 'ĐÃ KHÓA NHẬN ĐƠN (BR06/BR12)',
        color: 'bg-rose-100 text-rose-800 border-rose-300',
        barColor: 'bg-rose-600',
        icon: <Lock className="w-4 h-4 text-rose-600" />
      };
    }
    const ratio = current / max;
    if (ratio >= 0.9) {
      return {
        label: 'MỨC 3: CẢNH BÁO NGUY CƠ QUÁ TẢI (>=90%)',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        barColor: 'bg-rose-500',
        icon: <ShieldAlert className="w-4 h-4 text-rose-500" />
      };
    }
    if (ratio >= 0.7) {
      return {
        label: 'MỨC 2: CẢNH BÁO TIẾM CẬN CÔNG SUẤT (70-89%)',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        barColor: 'bg-amber-500',
        icon: <AlertTriangle className="w-4 h-4 text-amber-500" />
      };
    }
    return {
      label: 'MỨC 1: CÔNG SUẤT BÌNH THƯỜNG (<70%)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      barColor: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    };
  };

  const handleSaveCapacity = (slotId: string) => {
    if (customMax > 0) {
      updateSlotCapacity(slotId, customMax);
    }
    setEditingSlotId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Quản Lý Công Suất Phục Vụ Đa Mức Theo Khung Giờ (Smart Capacity)
        </h2>
        <p className="text-xs text-slate-500">
          Quy định tại Chương 2.3 & 6.3 Báo cáo HUTECH: Thiết lập giới hạn đơn nhận tối đa cho mỗi khung giờ nghỉ giữa các ca học để căn tin không bị dồn ứ quá tải.
        </p>
      </div>

      {/* Rules Explanatory Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm">Cơ chế Kiểm soát & Khóa Tự động (BR06 & BR12)</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Khi sinh viên tạo đơn trên App, hệ thống sẽ đối chiếu số lượng đơn đã đặt trong khung giờ đó. Nếu khung giờ đạt giới hạn hoặc bị Quản trị viên kích hoạt nút Khóa, hệ thống sẽ chặn sinh viên đặt thêm vào khung giờ đó và đề xuất chuyển sang khung giờ lân cận.
        </p>
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {timeSlots.map(slot => {
          const ratio = Math.min(100, Math.round((slot.currentOrders / slot.maxCapacity) * 100));
          const tier = getTierInfo(slot.currentOrders, slot.maxCapacity, slot.isLocked);

          return (
            <div 
              key={slot.id} 
              className={`bg-white rounded-2xl border ${
                slot.isLocked ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
              } p-5 shadow-xs space-y-4`}
            >
              {/* Slot Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#ee4d2d]" />
                    <span className="font-black text-base text-slate-900">{slot.timeRange}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">{slot.label}</div>
                </div>

                <button
                  onClick={() => toggleSlotLock(slot.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                    slot.isLocked 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                  }`}
                >
                  {slot.isLocked ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Mở khóa nhận đơn</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Tạm khóa khung giờ</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Alert Badge */}
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${tier.color}`}>
                {tier.icon}
                <span>{tier.label}</span>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Đơn đã tiếp nhận:</span>
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {slot.currentOrders} / {slot.maxCapacity} đơn ({ratio}%)
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${tier.barColor}`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>

              {/* Capacity limits adjustment */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {editingSlotId === slot.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-slate-600">Hạn mức tối đa:</span>
                    <input
                      type="number"
                      value={customMax}
                      onChange={(e) => setCustomMax(Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-slate-300 rounded text-center font-bold"
                    />
                    <button
                      onClick={() => handleSaveCapacity(slot.id)}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditingSlotId(null)}
                      className="px-2 py-1 bg-slate-200 text-slate-600 rounded font-bold hover:bg-slate-300"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-slate-500">
                      Sức chứa tối đa: <strong className="text-slate-900">{slot.maxCapacity} suất/ca</strong>
                    </span>
                    <button
                      onClick={() => {
                        setEditingSlotId(slot.id);
                        setCustomMax(slot.maxCapacity);
                      }}
                      className="flex items-center gap-1 text-[#ee4d2d] hover:underline font-bold"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Điều chỉnh hạn mức</span>
                    </button>
                  </>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
