import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { Tag, CheckCircle2, Ticket, Users, Percent } from 'lucide-react';

export const VoucherTab: React.FC = () => {
  const { vouchers } = useCanteen();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Quản Lý Mã Giảm Giá & Ưu Đãi Sinh Viên (Vouchers)
        </h2>
        <p className="text-xs text-slate-500">
          Quy định tại Chương 4.3.8 Báo cáo HUTECH: Thiết lập các chương trình khuyến mãi đặt trước nhằm phân tán nhu cầu khách khỏi khung giờ quá tải
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vouchers.map(v => (
          <div key={v.code} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-black text-sm bg-orange-50 text-[#ee4d2d] px-2.5 py-1 rounded-lg border border-orange-200">
                  {v.code}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2">{v.title}</h4>
              </div>
              <Ticket className="w-6 h-6 text-[#ee4d2d]/30" />
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>Đơn tối thiểu: <strong className="text-slate-900 tabular-nums">{v.minSpend.toLocaleString('vi-VN')}₫</strong></div>
              <div>Mức giảm: <strong className="text-emerald-600">{v.discountAmount ? `${v.discountAmount.toLocaleString('vi-VN')}₫` : `${v.discountPercent}%`}</strong></div>
              <div>Đã dùng: <strong className="text-slate-900 tabular-nums">{v.usedCount} lượt</strong></div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đang kích hoạt</span>
              </span>
              <span className="text-slate-400 text-[11px]">HUTECH Campus E</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
