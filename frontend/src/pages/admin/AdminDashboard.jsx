import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Clock,
  Package,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await adminApi.getDashboard();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A847]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'În așteptare',
    confirmed: 'Confirmate',
    preparing: 'În preparare',
    ready: 'Gata',
    delivered: 'Livrate',
    cancelled: 'Anulate'
  };

  return (
    <div className="p-6" data-testid="admin-dashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">Bine ai venit înapoi! Iată situația de azi.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              {stats?.orders_today || 0} azi
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats?.total_orders || 0}</h3>
          <p className="text-gray-600 text-sm">Comenzi totale</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              {stats?.revenue_today?.toFixed(2) || 0} lei azi
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats?.total_revenue?.toFixed(2) || 0} lei</h3>
          <p className="text-gray-600 text-sm">Venituri totale</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats?.pending_orders || 0}</h3>
          <p className="text-gray-600 text-sm">Comenzi în așteptare</p>
        </div>

        {/* Orders Today */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats?.orders_today || 0}</h3>
          <p className="text-gray-600 text-sm">Comenzi azi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Comenzi după status</h2>
          <div className="space-y-3">
            {Object.entries(stats?.orders_by_status || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                  {statusLabels[status] || status}
                </span>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
            {Object.keys(stats?.orders_by_status || {}).length === 0 && (
              <p className="text-gray-500 text-center py-4">Nicio comandă încă</p>
            )}
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Produse populare</h2>
          <div className="space-y-3">
            {stats?.popular_items?.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
                <span className="text-gray-600">{item.count} porții</span>
              </div>
            ))}
            {(!stats?.popular_items || stats.popular_items.length === 0) && (
              <p className="text-gray-500 text-center py-4">Nicio comandă încă</p>
            )}
          </div>
        </div>

        {/* Revenue by Day Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Venituri ultimele 7 zile</h2>
          <div className="h-64 flex items-end gap-2">
            {stats?.revenue_by_day?.map((day, index) => {
              const maxRevenue = Math.max(...(stats?.revenue_by_day?.map(d => d.revenue) || [1]));
              const height = (day.revenue / maxRevenue) * 100 || 5;
              
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-[#D4A847] rounded-t-lg transition-all hover:bg-[#c49a3d] relative group"
                    style={{ height: `${height}%`, minHeight: '20px' }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.revenue?.toFixed(2)} lei
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{day.date?.slice(5)}</span>
                  <span className="text-xs text-gray-400">{day.orders} cmd</span>
                </div>
              );
            })}
            {(!stats?.revenue_by_day || stats.revenue_by_day.length === 0) && (
              <p className="text-gray-500 text-center py-4 w-full">Nicio dată disponibilă</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
