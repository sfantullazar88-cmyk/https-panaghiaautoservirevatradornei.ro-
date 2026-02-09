import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye,
  Clock,
  Check,
  ChefHat,
  Package,
  Truck,
  XCircle,
  Phone,
  MapPin
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await adminApi.getOrders(params);
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      alert('Eroare: ' + err.message);
    }
  };

  const statusConfig = {
    pending: { label: 'În așteptare', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { label: 'Confirmată', color: 'bg-blue-100 text-blue-800', icon: Check },
    preparing: { label: 'În preparare', color: 'bg-purple-100 text-purple-800', icon: ChefHat },
    ready: { label: 'Gata', color: 'bg-green-100 text-green-800', icon: Package },
    out_for_delivery: { label: 'În livrare', color: 'bg-cyan-100 text-cyan-800', icon: Truck },
    delivered: { label: 'Livrată', color: 'bg-gray-100 text-gray-800', icon: Check },
    cancelled: { label: 'Anulată', color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  const getNextStatus = (current) => {
    const flow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'out_for_delivery',
      out_for_delivery: 'delivered'
    };
    return flow[current];
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6" data-testid="admin-orders">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Comenzi
          </h1>
          <p className="text-gray-600 mt-1">Gestionează comenzile clienților</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === 'all' ? 'bg-[#D4A847] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toate
          </button>
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === key ? 'bg-[#D4A847] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A847]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Nicio comandă</h3>
          <p className="text-gray-600 mt-1">Nu există comenzi cu acest filtru</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            
            return (
              <div 
                key={order.id} 
                className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-[#D4A847]' : ''
                }`}
                onClick={() => setSelectedOrder(order)}
                data-testid={`order-${order.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{order.order_number}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${status.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {status.label}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">{order.customer?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone className="w-4 h-4" />
                    {order.customer?.phone}
                  </div>
                  {order.order_type === 'delivery' && order.customer?.address && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      {order.customer.address}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">{order.items?.length} produse</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className={`text-sm ${order.order_type === 'delivery' ? 'text-cyan-600' : 'text-green-600'}`}>
                      {order.order_type === 'delivery' ? 'Livrare' : 'Ridicare'}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-[#D4A847]">{order.total} lei</span>
                </div>

                {/* Quick Actions */}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    {getNextStatus(order.status) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(order.id, getNextStatus(order.status));
                        }}
                        className="flex-1 bg-[#D4A847] text-white px-4 py-2 rounded-xl hover:bg-[#c49a3d] transition-colors text-sm font-medium"
                      >
                        → {statusConfig[getNextStatus(order.status)]?.label}
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Sigur doriți să anulați comanda?')) {
                          updateStatus(order.id, 'cancelled');
                        }
                      }}
                      className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      Anulează
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Comanda {selectedOrder.order_number}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                <p className="font-medium">{selectedOrder.customer?.name}</p>
                <p className="text-gray-600">{selectedOrder.customer?.phone}</p>
                {selectedOrder.customer?.email && (
                  <p className="text-gray-600">{selectedOrder.customer.email}</p>
                )}
                {selectedOrder.customer?.address && (
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">Adresă:</span> {selectedOrder.customer.address}
                  </p>
                )}
                {selectedOrder.customer?.notes && (
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">Note:</span> {selectedOrder.customer.notes}
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Produse comandate</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">{item.price * item.quantity} lei</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-[#FFF8E7] rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#D4A847]">{selectedOrder.total} lei</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                  <span>Metoda plată:</span>
                  <span className="font-medium">
                    {selectedOrder.payment_method === 'card_online' ? 'Card online' :
                     selectedOrder.payment_method === 'card' ? 'Card' : 'Numerar'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                  <span>Status plată:</span>
                  <span className={`font-medium ${selectedOrder.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedOrder.payment_status === 'paid' ? 'Plătită' : 'În așteptare'}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Actualizare status</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(selectedOrder.id, key)}
                      disabled={selectedOrder.status === key}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedOrder.status === key
                          ? 'bg-[#D4A847] text-white cursor-default'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
