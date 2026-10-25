import React from 'react';
import { Order } from '../../types';
import { Printer, X, CheckCircle, Clock, MapPin, Phone, User } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">PHIẾU BẾP & GIAO HÀNG (KHO KHU E)</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content Body */}
        <div className="p-6 text-slate-800 space-y-4 text-xs font-mono">
          
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h2 className="text-base font-black text-slate-900 font-sans tracking-tight">CĂN TIN KHU E - ĐẠI HỌC HUTECH</h2>
            <p className="text-[11px] text-slate-500">Khu Công Nghệ Cao, Thủ Đức - Xa Lộ Hà Nội</p>
            <p className="text-[11px] text-slate-500">Hotline Căn Tin: 028 5445 7777</p>
            <div className="mt-2 inline-block bg-slate-100 px-3 py-1 rounded font-bold text-sm text-[#ee4d2d]">
              MÃ ĐƠN: #{order.id}
            </div>
          </div>

          {/* Time & Delivery details */}
          <div className="space-y-1.5 text-slate-600 border-b border-dashed border-slate-300 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Sinh viên: <strong className="text-slate-900">{order.studentName}</strong> (MSSV: {order.studentId})</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>SĐT: <strong className="text-slate-900">{order.studentPhone}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Điểm nhận: <strong className="text-slate-900">{order.deliveryLocation}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Khung giờ giao: <strong className="text-indigo-600">{order.timeSlot}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Thanh toán: <strong className={order.isPaid ? 'text-emerald-600' : 'text-amber-600'}>
                {order.paymentMethod === 'ONLINE' ? 'ONLINE (ĐÃ CK NGÂN HÀNG)' : 'COD (TIỀN MẶT KHI NHẬN)'}
              </strong></span>
            </div>
          </div>

          {/* Items breakdown */}
          <div>
            <div className="flex justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
              <span>MÓN ĂN</span>
              <span>SL x GIÁ</span>
              <span>THÀNH TIỀN</span>
            </div>
            <div className="divide-y divide-slate-100 py-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-1.5">
                  <div className="flex justify-between items-start font-semibold text-slate-900">
                    <span className="max-w-[180px]">{idx + 1}. {item.foodName}</span>
                    <span className="tabular-nums">{item.quantity} x {item.price.toLocaleString('vi-VN')}₫</span>
                    <span className="tabular-nums font-bold">{(item.quantity * item.price).toLocaleString('vi-VN')}₫</span>
                  </div>
                  {item.notes && (
                    <div className="text-[10px] text-amber-700 italic pl-3">
                      * Ghi chú: {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing summary */}
          <div className="border-t border-dashed border-slate-300 pt-3 space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính tiền món:</span>
              <span className="tabular-nums">{order.subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Voucher giảm giá ({order.voucherCode}):</span>
                <span className="tabular-nums">-{order.discount.toLocaleString('vi-VN')}₫</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Phí giao nội khu HUTECH:</span>
              <span className="text-emerald-600 font-bold">MIỄN PHÍ</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-300 pt-2">
              <span>TỔNG CẦN THU:</span>
              <span className="text-[#ee4d2d] tabular-nums text-base">{order.total.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-400">
            Giữ lại phiếu đối chiếu khi nhận hàng. Căn Tin HUTECH xin cảm ơn quý khách!
          </div>

        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#ee4d2d] rounded-lg hover:bg-red-600 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Phiếu Ngay</span>
          </button>
        </div>

      </div>
    </div>
  );
};
