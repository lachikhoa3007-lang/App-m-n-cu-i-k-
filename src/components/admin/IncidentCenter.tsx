import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { IncidentReport } from '../../types';
import { 
  AlertOctagon, 
  CheckCircle2, 
  HelpCircle, 
  DollarSign, 
  RefreshCcw, 
  Gift, 
  Plus, 
  User, 
  FileText 
} from 'lucide-react';

export const IncidentCenter: React.FC = () => {
  const { incidents, resolveIncident, createIncidentReport, orders } = useCanteen();

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [targetOrderId, setTargetOrderId] = useState<string>(orders[0]?.id || 'DH101');
  const [studentId, setStudentId] = useState<string>('24808900033');
  const [issueType, setIssueType] = useState<IncidentReport['issueType']>('out_of_stock');
  const [description, setDescription] = useState<string>('');
  const [resolution, setResolution] = useState<IncidentReport['resolution']>('replace');
  const [refundAmount, setRefundAmount] = useState<number>(39000);

  const handleSubmitNewIncident = (e: React.FormEvent) => {
    e.preventDefault();
    createIncidentReport({
      orderId: targetOrderId,
      studentId: studentId.trim(),
      issueType,
      description: description.trim() || 'Sự cố phát sinh trong quá trình chuẩn bị hoặc giao món.',
      resolution,
      refundAmount: resolution === 'refund' ? Number(refundAmount) : undefined
    });
    setShowCreateModal(false);
    setDescription('');
  };

  const getIssueLabel = (type: IncidentReport['issueType']) => {
    switch (type) {
      case 'out_of_stock':
        return { label: 'Hết món sau khi đặt', color: 'bg-rose-100 text-rose-800' };
      case 'delivery_failed':
        return { label: 'Giao hàng không thành công', color: 'bg-amber-100 text-amber-800' };
      case 'wrong_dish':
        return { label: 'Giao sai món / Thiếu món', color: 'bg-blue-100 text-blue-800' };
      case 'late_delivery':
        return { label: 'Giao trễ giờ vào lớp', color: 'bg-orange-100 text-orange-800' };
      case 'quality_issue':
        return { label: 'Vấn đề chất lượng món ăn', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Sự cố khác', color: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Xử Lý Ngoại Lệ & Khiếu Nại Đơn Hàng (Bảng 5.3 & Chương 6.6)
          </h2>
          <p className="text-xs text-slate-500">
            Quy trình chuẩn hóa xử lý các tình huống: Hết món đột xuất, giao không thành công, sai món và hoàn tiền minh bạch
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi Nhận Sự Cố Mới</span>
        </button>
      </div>

      {/* Guidelines Accordion / Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="font-bold text-rose-600 flex items-center gap-1.5">
            <RefreshCcw className="w-4 h-4" />
            <span>Hết món khi đang chuẩn bị</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Hệ thống thông báo cho sinh viên chọn đổi món tương đương hoặc hủy phần món đã hết và tự động hoàn tiền tương ứng.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="font-bold text-amber-600 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" />
            <span>Giao thất bại (Không liên lạc được)</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Shipper chờ tối đa 10 phút tại điểm hẹn; nếu không nhận, món được giữ tại Quầy sảnh Căn tin Khu E chờ sinh viên đến lấy.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="font-bold text-emerald-600 flex items-center gap-1.5">
            <Gift className="w-4 h-4" />
            <span>Giao trễ / Thiếu món</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Giao bổ sung miễn phí ngay lập tức hoặc hoàn tiền + tặng voucher giảm giá 15.000₫ bù đắp trải nghiệm cho sinh viên.
          </p>
        </div>
      </div>

      {/* Incidents List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Danh Sách Sự Cố Cần Xử Lý & Lịch Sử Giải Quyết</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {incidents.length} sự cố
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã Sự Cố</th>
                <th className="py-3 px-3">Mã Đơn / MSSV</th>
                <th className="py-3 px-3">Loại Sự Cố</th>
                <th className="py-3 px-4">Mô Tả Chi Tiết</th>
                <th className="py-3 px-3">Phương Án Xử Lý</th>
                <th className="py-3 px-3 text-center">Trạng Thái</th>
                <th className="py-3 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.map(inc => {
                const issue = getIssueLabel(inc.issueType);

                return (
                  <tr key={inc.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {inc.id}
                      <div className="text-[10px] text-slate-400 font-normal">{inc.createdAt}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-[#ee4d2d]">#{inc.orderId}</div>
                      <div className="text-[11px] text-slate-500 font-mono">MSSV: {inc.studentId}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${issue.color}`}>
                        {issue.label}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 max-w-sm">
                      {inc.description}
                    </td>

                    <td className="py-3 px-3 text-slate-800 font-semibold">
                      {inc.resolution === 'refund' && (
                        <span className="text-emerald-700">Hoàn tiền {inc.refundAmount ? `${inc.refundAmount.toLocaleString('vi-VN')}₫` : ''}</span>
                      )}
                      {inc.resolution === 'replace' && (
                        <span className="text-blue-700">Đổi món ăn tương đương</span>
                      )}
                      {inc.resolution === 'voucher_compensation' && (
                        <span className="text-purple-700">Tặng Voucher bù đắp</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        inc.status === 'resolved' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {inc.status === 'resolved' ? 'Đã giải quyết' : 'Đang xử lý'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {inc.status === 'pending' ? (
                        <button
                          onClick={() => resolveIncident(inc.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1 mx-auto"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Hoàn tất xử lý</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-medium">Hoàn thành</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for creating incident */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleSubmitNewIncident} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 pb-2 border-b border-slate-100">
              <AlertOctagon className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Ghi Nhận Sự Cố & Đơn Khiếu Nại Mới</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Chọn Đơn hàng phát sinh sự cố:</label>
                <select
                  value={targetOrderId}
                  onChange={(e) => setTargetOrderId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl mt-1 bg-white"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      #{o.id} - {o.studentName} ({o.studentId}) - {o.total.toLocaleString('vi-VN')}₫
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Loại sự cố phát sinh:</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as IncidentReport['issueType'])}
                  className="w-full p-2.5 border border-slate-300 rounded-xl mt-1 bg-white"
                >
                  <option value="out_of_stock">Hết món sau khi sinh viên đặt (Bảng 5.3)</option>
                  <option value="delivery_failed">Giao không thành công (Không liên lạc được)</option>
                  <option value="wrong_dish">Giao sai món hoặc thiếu topping/món thêm</option>
                  <option value="late_delivery">Giao trễ so với khung giờ cam kết</option>
                  <option value="quality_issue">Khiếu nại chất lượng món ăn</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Mô tả cụ thể sự việc:</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả nguyên nhân và thỏa thuận bước đầu với sinh viên..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl mt-1"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Phương án giải quyết (Biện pháp kiểm soát):</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as IncidentReport['resolution'])}
                  className="w-full p-2.5 border border-slate-300 rounded-xl mt-1 bg-white"
                >
                  <option value="replace">Đổi món khác có giá trị tương đương</option>
                  <option value="refund">Hoàn tiền lại cho sinh viên</option>
                  <option value="voucher_compensation">Tặng Voucher giảm giá bồi thường</option>
                </select>
              </div>

              {resolution === 'refund' && (
                <div>
                  <label className="font-bold text-slate-700">Số tiền hoàn (VNĐ):</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl mt-1"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Lưu Hồ Sơ Sự Cố
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
