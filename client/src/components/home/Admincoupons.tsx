import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Tag } from 'lucide-react';
import api from '../../configs/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

interface Coupon {
  _id: string;
  couponCode: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

interface RootState {
  auth: { token: string };
}

const AdminCoupons: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    couponCode: '',
    discountType: 'percent' as 'percent' | 'flat',
    discountValue: '',
    expiryDate: '',
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/admin/coupons', {
        headers: { Authorization: token },
      });
      setCoupons(data.coupons || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async () => {
    if (!form.couponCode || !form.discountValue || !form.expiryDate) {
      toast.error('All fields are required');
      return;
    }

    setCreating(true);
    try {
      const { data } = await api.post(
        '/admin/coupons',
        {
          couponCode: form.couponCode.toUpperCase(),
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          expiryDate: form.expiryDate,
        },
        { headers: { Authorization: token } }
      );

      setCoupons((prev) => [data.coupon, ...prev]);
      setForm({ couponCode: '', discountType: 'percent', discountValue: '', expiryDate: '' });
      toast.success('Coupon created successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create coupon');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (couponId: string, code: string) => {
    if (!window.confirm(`Delete coupon "${code}"? It will stop working immediately.`)) return;

    try {
      await api.delete(`/admin/coupons/${couponId}`, {
        headers: { Authorization: token },
      });
      setCoupons((prev) => prev.filter((c) => c._id !== couponId));
      toast.success('Coupon deleted');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-6">
      {/* Create Coupon Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Tag className="w-5 h-5 text-[#2c2a63]" />
          <h2 className="text-lg font-bold text-[#2c2a63]">Add New Coupon</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Coupon Code</label>
            <input
              type="text"
              value={form.couponCode}
              onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })}
              placeholder="e.g. RAMZAN30"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2c2a63] uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Discount Type</label>
            <select
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percent' | 'flat' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2c2a63]"
            >
              <option value="percent">Percent (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Discount Value {form.discountType === 'percent' ? '(%)' : '(₹)'}
            </label>
            <input
              type="number"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
              placeholder={form.discountType === 'percent' ? '30' : '50'}
              min="1"
              max={form.discountType === 'percent' ? '100' : undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2c2a63]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2c2a63]"
            />
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 bg-[#2c2a63] text-[#EDC9AF] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1f1d4a] transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {creating ? 'Creating...' : 'Create Coupon'}
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#2c2a63]">All Coupons ({coupons.length})</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2c2a63]" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Tag className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No coupons yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Code</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Value</th>
                  <th className="px-6 py-3 text-left">Expiry</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#2c2a63]">
                      {coupon.couponCode}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.discountType === 'percent'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {coupon.discountType === 'percent' ? 'Percent' : 'Flat'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {coupon.discountType === 'percent'
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(coupon.expiryDate).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {isExpired(coupon.expiryDate) ? (
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                          Expired
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(coupon._id, coupon.couponCode)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium text-xs hover:bg-red-50 px-2 py-1 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;