import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Phone, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ordersApi, restaurantApi } from '../services/api';

const Order = ({ cart = [], onUpdateCart, onRemoveFromCart, onClearCart }) => {
  const [orderType, setOrderType] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState({ phone: '0746 254 162' });

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        const info = await restaurantApi.getInfo();
        setRestaurantInfo(info);
      } catch (err) {
        console.error('Error fetching restaurant info:', err);
      }
    };
    fetchRestaurantInfo();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderType === 'delivery' ? 10 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        items: cart.map(item => ({
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        customer: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email || null,
          address: orderType === 'delivery' ? customerInfo.address : null,
          notes: customerInfo.notes || null
        },
        order_type: orderType,
        payment_method: paymentMethod
      };

      const result = await ordersApi.create(orderData);
      setOrderResult(result);
      if (onClearCart) onClearCart();
    } catch (err) {
      console.error('Error submitting order:', err);
      setError('A apărut o eroare la trimiterea comenzii. Vă rugăm să încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  // Order Success Screen
  if (orderResult) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24" data-testid="order-success-page">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Comandă înregistrată!
          </h1>
          <p className="text-gray-600 mb-2">
            Mulțumim pentru comandă! Vă vom contacta telefonic pentru confirmare.
          </p>
          <div className="bg-[#FFF8E7] rounded-xl p-6 mb-8 inline-block">
            <p className="text-sm text-gray-600 mb-1">Numărul comenzii:</p>
            <p className="text-2xl font-bold text-[#D4A847]" data-testid="order-number">{orderResult.order_number}</p>
            <p className="text-sm text-gray-600 mt-2">Total: <span className="font-semibold">{orderResult.total} lei</span></p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/meniu"
              className="inline-flex items-center justify-center gap-2 bg-[#D4A847] text-white px-8 py-3 rounded-full hover:bg-[#c49a3d] transition-colors"
              data-testid="continue-shopping-btn"
            >
              <span>Continuă cumpărăturile</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:border-gray-400 transition-colors"
              data-testid="go-home-btn"
            >
              <span>Acasă</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart Screen
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24" data-testid="empty-cart-page">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Coșul este gol
          </h1>
          <p className="text-gray-600 mb-8">
            Nu ai adăugat încă nimic în coș. Explorează meniul nostru!
          </p>
          <Link
            to="/meniu"
            className="inline-flex items-center justify-center gap-2 bg-[#D4A847] text-white px-8 py-3 rounded-full hover:bg-[#c49a3d] transition-colors"
            data-testid="view-menu-btn"
          >
            <span>Vezi Meniul</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24" data-testid="order-page">
      {/* Hero Section */}
      <section className="bg-[#D4A847] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/meniu" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors" data-testid="back-to-menu-link">
            <ArrowLeft className="w-5 h-5" />
            <span>Înapoi la meniu</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Comanda Ta
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6" data-testid="order-error">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6" data-testid="cart-items-section">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Produse în coș ({cart.length})</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl" data-testid={`cart-item-${item.id}`}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-[#D4A847] font-medium">{item.price} lei</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdateCart && onUpdateCart(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:border-[#D4A847] transition-colors"
                        data-testid={`decrease-qty-${item.id}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold w-8 text-center" data-testid={`qty-${item.id}`}>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateCart && onUpdateCart(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:border-[#D4A847] transition-colors"
                        data-testid={`increase-qty-${item.id}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart && onRemoveFromCart(item.id)}
                      className="w-8 h-8 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors"
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Type & Customer Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mt-6" data-testid="order-details-section">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalii comandă</h2>
              
              {/* Order Type Toggle */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setOrderType('pickup')}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    orderType === 'pickup'
                      ? 'bg-[#D4A847] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  data-testid="pickup-btn"
                >
                  Ridicare personală
                </button>
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    orderType === 'delivery'
                      ? 'bg-[#D4A847] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  data-testid="delivery-btn"
                >
                  Livrare (+10 lei)
                </button>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Metoda de plată</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-[#D4A847] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    data-testid="cash-payment-btn"
                  >
                    Numerar
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#D4A847] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    data-testid="card-payment-btn"
                  >
                    Card
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" data-testid="order-form">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nume *</label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all"
                    placeholder="Numele tău"
                    data-testid="name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all"
                    placeholder="07XX XXX XXX"
                    data-testid="phone-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (opțional)</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all"
                    placeholder="email@example.com"
                    data-testid="email-input"
                  />
                </div>
                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresă livrare *</label>
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all"
                      placeholder="Strada, nr., bloc, apart."
                      data-testid="address-input"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observații</label>
                  <textarea
                    name="notes"
                    value={customerInfo.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all resize-none"
                    placeholder="Mențiuni speciale pentru comandă..."
                    data-testid="notes-input"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-28" data-testid="order-summary">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sumar comandă</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span data-testid="subtotal">{subtotal} lei</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Livrare</span>
                    <span data-testid="delivery-fee">{deliveryFee} lei</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#D4A847]" data-testid="total">{total} lei</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !customerInfo.name || !customerInfo.phone || (orderType === 'delivery' && !customerInfo.address)}
                className="w-full bg-[#D4A847] text-white py-4 rounded-full hover:bg-[#c49a3d] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="submit-order-btn"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Se procesează...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Plasează comanda</span>
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                Plata se face {paymentMethod === 'cash' ? 'în numerar' : 'cu cardul'} la {orderType === 'pickup' ? 'ridicare' : 'livrare'}
              </p>

              <div className="mt-6 p-4 bg-[#FFF8E7] rounded-xl">
                <p className="text-sm text-gray-700 mb-2">Preferi să comanzi telefonic?</p>
                <a
                  href={`tel:${restaurantInfo.phone?.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2 text-[#D4A847] font-medium hover:underline"
                  data-testid="phone-order-link"
                >
                  <Phone className="w-4 h-4" />
                  <span>{restaurantInfo.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
