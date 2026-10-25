import React, { useState } from 'react';
import { FoodItem, FoodCategory } from '../../types';
import { useCanteen } from '../../context/CanteenContext';
import { Plus, Edit2, Search, Check, X, Utensils, AlertCircle } from 'lucide-react';

export const MenuManagement: React.FC = () => {
  const { foodItems, toggleFoodActive, updateFoodPrice, addFoodItem } = useCanteen();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Price editing state
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);

  // New item modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<FoodCategory>('Món chính');
  const [newPrice, setNewPrice] = useState<number>(39000);
  const [newOnline, setNewOnline] = useState<number>(20);
  const [newOffline, setNewOffline] = useState<number>(20);
  const [newMin, setNewMin] = useState<number>(10);
  const [newDesc, setNewDesc] = useState<string>('');

  const filteredItems = foodItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const handleStartEdit = (item: FoodItem) => {
    setEditingItemId(item.id);
    setEditPriceValue(item.price);
  };

  const handleSavePrice = (id: number) => {
    if (editPriceValue > 0) {
      updateFoodPrice(id, editPriceValue);
    }
    setEditingItemId(null);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addFoodItem({
      name: newName.trim(),
      category: newCategory,
      price: Number(newPrice),
      onlineStock: Number(newOnline),
      offlineStock: Number(newOffline),
      minStock: Number(newMin),
      active: true,
      description: newDesc.trim() || 'Món ăn chế biến nóng sốt tại Căn tin Khu E HUTECH.'
    });

    setShowAddModal(false);
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Quản Lý Thực Đơn & Trạng Thái Mở Bán
          </h2>
          <p className="text-xs text-slate-500">
            Cập nhật món ăn, điều chỉnh giá bán và bật/tắt bán trực tuyến tức thì cho ứng dụng sinh viên
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#ee4d2d] hover:bg-red-600 text-white rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Món Mới</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Món chính', 'Nước & Ăn vặt', 'Món thêm'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                selectedCategory === cat 
                  ? 'bg-[#ee4d2d] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tất cả thực đơn (29 món)' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tên món trong thực đơn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
          />
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Tên Món Ăn</th>
                <th className="py-3 px-3">Danh Mục</th>
                <th className="py-3 px-3">Giá Bán Niêm Yết</th>
                <th className="py-3 px-3 text-center">Tồn Online/Offline</th>
                <th className="py-3 px-3 text-center">Trạng Thái Bán</th>
                <th className="py-3 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-center font-mono text-slate-400">
                    {index + 1}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-400 max-w-sm truncate">{item.description}</div>
                  </td>

                  <td className="py-3 px-3 text-slate-600 font-semibold">
                    {item.category}
                  </td>

                  {/* Price cell with in-place edit */}
                  <td className="py-3 px-3">
                    {editingItemId === item.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editPriceValue}
                          onChange={(e) => setEditPriceValue(Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-slate-300 rounded font-mono text-xs"
                        />
                        <button
                          onClick={() => handleSavePrice(item.id)}
                          className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingItemId(null)}
                          className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 tabular-nums">
                          {item.price.toLocaleString('vi-VN')}₫
                        </span>
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                          title="Sửa giá"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3 text-center tabular-nums text-slate-600">
                    <strong className="text-[#ee4d2d]">{item.onlineStock}</strong> onl / <strong className="text-amber-700">{item.offlineStock}</strong> quầy
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.active 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.active ? 'Đang mở bán' : 'Tạm ngưng'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleFoodActive(item.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        item.active 
                          ? 'border border-rose-200 text-rose-700 hover:bg-rose-50' 
                          : 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {item.active ? 'Tạm ngưng bán' : 'Mở bán lại'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Food Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleCreateNewItem} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#ee4d2d]">
                <Utensils className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Thêm Món Ăn Mới Vào Thực Đơn Căn Tin</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Tên món ăn:</label>
                <input
                  type="text"
                  placeholder="VD: Cơm bò xào củ hành, Nước ép dưa hấu..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Danh mục:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as FoodCategory)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Món chính">Món chính</option>
                  <option value="Nước & Ăn vặt">Nước & Ăn vặt</option>
                  <option value="Món thêm">Món thêm</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Giá bán (VNĐ):</label>
                <input
                  type="number"
                  placeholder="39000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kho Online ban đầu:</label>
                <input
                  type="number"
                  value={newOnline}
                  onChange={(e) => setNewOnline(Number(e.target.value))}
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kho Offline (Quầy) ban đầu:</label>
                <input
                  type="number"
                  value={newOffline}
                  onChange={(e) => setNewOffline(Number(e.target.value))}
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Mô tả nguyên liệu / thành phần:</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả nguyên liệu, khẩu vị, rau gia vị ăn kèm..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#ee4d2d] hover:bg-red-600 rounded-xl shadow-xs"
              >
                + Thêm Món Vào Menu
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
