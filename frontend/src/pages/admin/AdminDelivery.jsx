import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Package,
  Navigation,
  RefreshCw
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const AdminDelivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [filter, setFilter] = useState('active');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    fetchDeliveries();
  }, [filter]);

  useEffect(() => {
    // Initialize Google Maps
    if (window.google && mapRef.current && !mapInstanceRef.current) {
      initMap();
    } else if (!window.google) {
      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    }
  }, [deliveries]);

  const initMap = () => {
    if (!mapRef.current) return;

    // Default center: Vatra Dornei
    const center = { lat: 47.3463, lng: 25.3550 };

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Add restaurant marker
    new window.google.maps.Marker({
      position: center,
      map: mapInstanceRef.current,
      title: 'Panaghia Restaurant',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#D4A847" stroke="#fff" stroke-width="3"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">P</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });

    updateMarkers();
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add delivery markers
    deliveries.forEach((delivery, index) => {
      if (delivery.coordinates) {
        const marker = new window.google.maps.Marker({
          position: { lat: delivery.coordinates.lat, lng: delivery.coordinates.lng },
          map: mapInstanceRef.current,
          title: `${delivery.customer_name} - ${delivery.order_number}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="${getStatusColor(delivery.status)}" stroke="#fff" stroke-width="2"/>
                <text x="16" y="21" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${index + 1}</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        marker.addListener('click', () => {
          setSelectedDelivery(delivery);
        });

        markersRef.current.push(marker);
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: '#3B82F6',
      preparing: '#8B5CF6',
      ready: '#10B981',
      out_for_delivery: '#06B6D4'
    };
    return colors[status] || '#6B7280';
  };

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const status = filter === 'active' ? null : filter;
      const data = await adminApi.getDeliveryOrders(status);
      setDeliveries(data.deliveries || []);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      fetchDeliveries();
    } catch (err) {
      alert('Eroare: ' + err.message);
    }
  };

  const statusConfig = {
    confirmed: { label: 'Confirmată', color: 'bg-blue-100 text-blue-800' },
    preparing: { label: 'În preparare', color: 'bg-purple-100 text-purple-800' },
    ready: { label: 'Gata', color: 'bg-green-100 text-green-800' },
    out_for_delivery: { label: 'În livrare', color: 'bg-cyan-100 text-cyan-800' },
    delivered: { label: 'Livrată', color: 'bg-gray-100 text-gray-800' }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col" data-testid="admin-delivery">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Gestionare Livrări
            </h1>
            <p className="text-sm text-gray-600">
              {deliveries.length} livrări {filter === 'active' ? 'active' : ''}
            </p>
          </div>
          <button
            onClick={fetchDeliveries}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            title="Reîmprospătează"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['active', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                filter === status ? 'bg-[#D4A847] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'active' ? 'Toate active' : statusConfig[status]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="absolute inset-0" />
          
          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-3">
            <p className="text-xs font-medium text-gray-700 mb-2">Legendă</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#D4A847]"></div>
                <span className="text-xs text-gray-600">Restaurant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Confirmată</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-xs text-gray-600">În preparare</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">Gata</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span className="text-xs text-gray-600">În livrare</span>
              </div>
            </div>
          </div>

          {/* No Google Maps fallback */}
          {!window.google && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center p-6">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Harta se încarcă...</p>
                <p className="text-sm text-gray-400 mt-2">
                  Pentru a vedea harta, adăugați o cheie Google Maps API
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Deliveries List */}
        <div className="lg:w-96 bg-white border-t lg:border-t-0 lg:border-l overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4A847]"></div>
            </div>
          ) : deliveries.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nicio livrare activă</p>
            </div>
          ) : (
            <div className="divide-y">
              {deliveries.map((delivery, index) => {
                const status = statusConfig[delivery.status] || statusConfig.confirmed;
                
                return (
                  <div
                    key={delivery.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedDelivery?.id === delivery.id ? 'bg-[#FFF8E7]' : ''
                    }`}
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#D4A847] text-white text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">{delivery.order_number}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-gray-900">{delivery.customer_name}</p>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-3 h-3" />
                        {delivery.customer_phone}
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{delivery.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatTime(delivery.created_at)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <span className="font-bold text-[#D4A847]">{delivery.total} lei</span>
                      
                      {delivery.status !== 'delivered' && (
                        <div className="flex gap-2">
                          {delivery.status === 'ready' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(delivery.id, 'out_for_delivery');
                              }}
                              className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-medium hover:bg-cyan-200 transition-colors"
                            >
                              Pornește livrarea
                            </button>
                          )}
                          {delivery.status === 'out_for_delivery' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(delivery.id, 'delivered');
                              }}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                            >
                              Marchează livrată
                            </button>
                          )}
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Deschide în Google Maps"
                          >
                            <Navigation className="w-4 h-4 text-gray-600" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDelivery;
