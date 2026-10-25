import React, { useState } from 'react';
import { 
  Order, 
  OrderStatus 
} from '../../types';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Search, 
  Clock, 
  MapPin, 
  Phone, 
  Printer, 
  CheckCircle, 
  XCircle, 
  UtensilsCrossed, 
  Truck,
  RotateCcw
} from 'lucide-react';

interface OrderManagementProps {
  onSelectOrderForReceipt: (orderId: string) => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({ onSelectOrderForReceipt }) => {
  const { orders, updateOrderStatus } = useCanteen();
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Hết nguyên liệu chế biến đột xuất');

  // Filter orders
  const filteredOrders = orders.filter(ord => {
    const matchesStatus = activeStatus === 'all' || ord.status === activeStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      ord.id.toLowerCase().includes(query) ||
      ord.studentId.toLowerCase().includes(query) ||
      ord.studentName.toLowerCase().includes(query) ||
      ord.deliveryLocation.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg font-bold text-xs">Chờ tiếp nhận</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg font-bold text-xs">Đang chế biến</span>;
      case 'ready':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg font-bold text-xs">Sẵn sàng nhận / Chờ giao</span>;
      case 'delivering':
        return <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg font-bold text-xs">Đang giao nội khu</span>;
      case 'completed':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs">Hoàn thành</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg font-bold text-xs">Đã hủy</span>;
      default:
        return null;
    }
  };

  const handleConfirmCancel = () => {
    if (!selectedOrderForCancel) return;
    updateOrderStatus(selectedOrderForCancel.id, 'cancelled', cancelReason);
    setSelectedOrderForCancel(null);
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready' || o.status === 'delivering').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-6">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Trung Tâm Xử Lý Đơn Hàng Căn Tin</h2>
          <p className="text-xs text-slate-500">
            Tiếp nhận, chế biến và bàn giao đồ ăn theo vòng đời đơn hàng và khung giờ phục vụ đã cam kết
          </p>
        </div>

        {/* Live Filter Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo Mã đơn, MSSV, tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d]"
          />
        </div>
      </div>

      {/* ShopeeFood Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveStatus('all')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeStatus === 'all' 
              ? 'bg-[#ee4d2d] text-white shadow-sm' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tất cả ({orders.length})
        </button>

        <button
          onClick={() => setActiveStatus('pending')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeStatus === 'pending' 
              ? 'bg-[#ee4d2d] text-white shadow-sm' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Đơn mới</span>
          {pendingCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full font-bold text-[10px] ${
              activeStatus === 'pending' ? 'bg-white text-[#ee4d2d]' : 'bg-red-500 text-white'
            }`}>
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveStatus('preparing')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeStatus === 'preparing' 
              ? 'bg-[#ee4d2d] text-white shadow-sm' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Đang chế biến ({preparingCount})
        </button>

        <button
          onClick={() => setActiveStatus('ready')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeStatus === 'ready' 
              ? 'bg-[#ee4d2d] text-white shadow-sm' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Sẵn sàng / Chờ giao ({readyCount})
        </button>

        <button
          onClick={() => setActiveStatus('completed')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeStatus === 'completed' 
              ? 'bg-[#ee4d2d] text-white shadow-sm' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Hoàn thành ({completedCount})
        </button>

        <button
          onClick={() => setActiveStatus('cancelled')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeStatus === 'cancelled' 
              ? 'bg-[#ee4d2d] text-white shadow-sm' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Đã hủy
        </button>
      </div>

      {/* Orders List / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
          <UtensilsCrossed className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">Không tìm thấy đơn hàng nào</h3>
          <p className="text-xs">Không có đơn hàng nào khớp với bộ lọc hoặc từ khóa tìm kiếm hiện tại.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map(order => (
            <div 
              key={order.id} 
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition p-5 space-y-4 flex flex-col justify-between"
            >
              
              {/* Order Card Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#ee4d2d] text-base">#{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Đặt lúc: {order.createdAt}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-slate-900 tabular-nums">
                    {order.total.toLocaleString('vi-VN')}₫
                  </div>
                  <div className={`text-[11px] font-bold ${
                    order.paymentMethod === 'ONLINE' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {order.paymentMethod === 'ONLINE' ? 'Đã CK Online' : 'Tiền mặt COD'}
                  </div>
                </div>
              </div>

              {/* Student & Destination Info */}
              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{order.studentName}</span>
                  <span className="font-mono text-slate-500">MSSV: {order.studentId}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{order.studentPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800">{order.deliveryLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-700">
                  <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Khung giờ giao: <strong className="font-bold">{order.timeSlot}</strong></span>
                </div>
              </div>

              {/* Dishes list */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-500 text-[11px] uppercase tracking-wide">Món đã đặt:</div>
                <div className="divide-y divide-slate-100">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="py-1 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 mr-2">{it.quantity}x</span>
                        <span className="text-slate-800">{it.foodName}</span>
                        {it.notes && (
                          <span className="block text-[11px] text-amber-700 italic">
                            ({it.notes})
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 tabular-nums">
                        {(it.quantity * it.price).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation Reason if cancelled */}
              {order.status === 'cancelled' && order.cancelReason && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  <strong>Lý do hủy:</strong> {order.cancelReason}
                </div>
              )}

              {/* Action Buttons for order state progress */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectOrderForReceipt(order.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold transition"
                  title="In phiếu bếp / phiếu giao"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In phiếu</span>
                </button>

                <div className="flex items-center gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => setSelectedOrderForCancel(order)}
                        className="px-3 py-1.5 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold transition"
                      >
                        Từ chối / Hết món
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="px-4 py-1.5 bg-[#ee4d2d] hover:bg-red-600 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>Tiếp nhận & Chế biến</span>
                      </button>
                    </>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Xong món · Sẵn sàng giao</span>
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivering')}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Bàn giao Shipper</span>
                    </button>
                  )}

                  {order.status === 'delivering' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Xác nhận giao thành công</span>
                    </button>
                  )}

                  {order.status === 'completed' && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Đơn đã hoàn tất</span>
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Cancel Order Modal */}
      {selectedOrderForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <XCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Xác Nhận Hủy Đơn #{selectedOrderForCancel.id}</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Theo quy tắc nghiệp vụ <strong>BR13</strong>, đơn hủy khi chưa chế biến sẽ tự động hoàn lại số lượng tồn kho Online đã giữ cho sinh viên khác.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Lý do hủy đơn:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
              >
                <option value="Hết nguyên liệu chế biến đột xuất">Hết nguyên liệu chế biến đột xuất</option>
                <option value="Sinh viên liên hệ xin hủy đổi món">Sinh viên liên hệ xin hủy đổi món</option>
                <option value="Căn tin quá tải khung giờ">Căn tin quá tải khung giờ</option>
                <option value="Không liên lạc được sinh viên nhận hàng">Không liên lạc được sinh viên nhận hàng</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrderForCancel(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Xác Nhận Hủy & Hoàn Tồn Kho
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
