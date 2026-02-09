import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { restaurantInfo } from '../data/mock';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <section className="bg-[#D4A847] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Contact
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Suntem aici pentru tine! Contactează-ne pentru comenzi sau întrebări
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Informații de Contact
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-[#D4A847]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#D4A847]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Telefon</h3>
                  <a href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-[#D4A847]">
                    {restaurantInfo.phone}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Sunați pentru comenzi la pachet</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-[#D4A847]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#D4A847]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a href={`mailto:${restaurantInfo.email}`} className="text-gray-600 hover:text-[#D4A847]">
                    {restaurantInfo.email}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Răspundem în 24 de ore</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-[#D4A847]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#D4A847]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Adresă</h3>
                  <p className="text-gray-600">{restaurantInfo.address}</p>
                  <p className="text-sm text-gray-500 mt-1">Centrul orașului Vatra Dornei</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-[#D4A847]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#D4A847]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Program</h3>
                  <p className="text-gray-600">Luni - Vineri: {restaurantInfo.schedule.weekdays}</p>
                  <p className="text-gray-600">Sâmbătă - Duminică: {restaurantInfo.schedule.weekend}</p>
                </div>
              </div>
            </div>

            {/* Quick Call CTA */}
            <a
              href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-3 w-full mt-8 bg-[#D4A847] text-white py-4 rounded-full hover:bg-[#c49a3d] transition-colors font-medium text-lg"
            >
              <Phone className="w-5 h-5" />
              <span>Sună Acum</span>
            </a>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Trimite-ne un mesaj
            </h2>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nume complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all"
                    placeholder="Numele tău"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all"
                    placeholder="email@exemplu.ro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all"
                    placeholder="07XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all resize-none"
                    placeholder="Scrie mesajul tău aici..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#D4A847] text-white py-4 rounded-full hover:bg-[#c49a3d] transition-colors font-medium"
                >
                  <Send className="w-5 h-5" />
                  <span>Trimite Mesajul</span>
                </button>

                {isSubmitted && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center">
                    Mesajul a fost trimis cu succes! Vă vom contacta în curând.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ne găsești aici
          </h2>
          <div className="bg-white p-2 rounded-2xl shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2679.5!2d25.3547!3d47.3456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVatra%20Dornei!5e0!3m2!1sen!2sro!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '1rem' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Locația Panaghia"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;