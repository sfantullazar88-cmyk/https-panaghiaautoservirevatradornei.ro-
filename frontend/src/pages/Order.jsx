import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { restaurantInfo } from '../data/mock';

const Order = ({ cart = [], onUpdateCart, onRemoveFromCart, onClearCart }) => {
  const [orderType, setOrderType] = useState('pickup'); // pickup or delivery
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderType === 'delivery' ? 10 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', { cart, customerInfo, orderType, total });
    setIsSubmitted(true);
    if (onClearCart) onClearCart();
  };

  const handleChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Comandă înregistrată!
          </h1>
          <p className="text-gray-600 mb-8">
            Mulțumim pentru comandă! Vă vom contacta telefonic pentru confirmare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/meniu"
              className="inline-flex items-center justify-center gap-2 bg-[#D4A847] text-white px-8 py-3 rounded-full hover:bg-[#c49a3d] transition-colors"
            >
              <span>Continuă cumpărăturile</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:border-gray-400 transition-colors"
            >
              <span>Acasă</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
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
          >
            <span>Vezi Meniul</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <section className="bg-[#D4A847] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/meniu" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Înapoi la meniu</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Comanda Ta
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Produse în coș</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
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
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateCart && onUpdateCart(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:border-[#D4A847] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart && onRemoveFromCart(item.id)}
                      className="w-8 h-8 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Type & Customer Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
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
                >
                  Livrare (+10 lei)
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-28">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sumar comandă</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{subtotal} lei</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Livrare</span>
                    <span>{deliveryFee} lei</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#D4A847]">{total} lei</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-[#D4A847] text-white py-4 rounded-full hover:bg-[#c49a3d] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Plasează comanda</span>
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                Plata se face la {orderType === 'pickup' ? 'ridicare' : 'livrare'}
              </p>

              <div className="mt-6 p-4 bg-[#FFF8E7] rounded-xl">
                <p className="text-sm text-gray-700 mb-2">Preferi să comanzi telefonic?</p>
                <a
                  href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2 text-[#D4A847] font-medium hover:underline"
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