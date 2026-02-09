import React from 'react';
import { Link } from 'react-router-dom';
import { Star, UtensilsCrossed, Package, Phone, Clock, MapPin, ChefHat, Truck, Award } from 'lucide-react';
import { restaurantInfo, menuItems, reviews, dailyMenu } from '../data/mock';

const Home = () => {
  const popularItems = menuItems.filter(item => item.isPopular).slice(0, 4);
  const today = new Date().toLocaleDateString('ro-RO', { weekday: 'long' });
  const todayMenu = dailyMenu.find(d => d.day.toLowerCase() === today.toLowerCase().charAt(0).toUpperCase() + today.toLowerCase().slice(1));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://customer-assets.emergentagent.com/job_food-delivery-240/artifacts/25k2bpta_4.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 
            className="text-5xl md:text-7xl mb-4 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
          >
            {restaurantInfo.heroTitle}<br/>
            {restaurantInfo.heroTitle2}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 italic">
            {restaurantInfo.heroSubtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              to="/meniu"
              className="flex items-center gap-2 bg-[#D4A847] text-white px-6 py-3 rounded-full hover:bg-[#c49a3d] transition-all hover:scale-105"
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span className="font-medium">Vezi meniul</span>
            </Link>
            <Link
              to="/comanda"
              className="flex items-center gap-2 bg-gray-900/80 text-white px-6 py-3 rounded-full hover:bg-gray-900 transition-all hover:scale-105 backdrop-blur-sm"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Comanda la pachet</span>
            </Link>
            <a
              href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-all hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">Suna acum</span>
            </a>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[#D4A847] fill-[#D4A847]" />
              ))}
            </div>
            <span className="text-white/80">{restaurantInfo.rating} • {restaurantInfo.reviewCount} recenzii</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#D4A847]/10 rounded-full flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-[#D4A847]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gătit Proaspăt</h3>
                <p className="text-sm text-gray-600">Zilnic, cu ingrediente locale</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#D4A847]/10 rounded-full flex items-center justify-center">
                <Truck className="w-7 h-7 text-[#D4A847]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Livrare Rapidă</h3>
                <p className="text-sm text-gray-600">În Vatra Dornei și împrejurimi</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#D4A847]/10 rounded-full flex items-center justify-center">
                <Award className="w-7 h-7 text-[#D4A847]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Calitate Premium</h3>
                <p className="text-sm text-gray-600">Rețete tradiționale autentice</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Menu Section */}
      {todayMenu && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#D4A847] font-medium">Meniul Zilei</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {today.charAt(0).toUpperCase() + today.slice(1)}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="p-6 bg-[#FFF8E7] rounded-2xl text-center">
                <span className="text-[#D4A847] text-sm font-medium">Ciorbă</span>
                <h3 className="text-xl font-semibold text-gray-900 mt-2">{todayMenu.soup}</h3>
              </div>
              <div className="p-6 bg-[#FFF8E7] rounded-2xl text-center">
                <span className="text-[#D4A847] text-sm font-medium">Fel Principal</span>
                <h3 className="text-xl font-semibold text-gray-900 mt-2">{todayMenu.main}</h3>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Items Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#D4A847] font-medium">Preferatele Clienților</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Cele Mai Populare
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#D4A847] text-white text-xs px-3 py-1 rounded-full">
                    Popular
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-[#D4A847]">{item.price} lei</span>
                    <Link 
                      to="/meniu"
                      className="text-sm text-[#D4A847] hover:underline"
                    >
                      Vezi detalii
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/meniu"
              className="inline-flex items-center gap-2 bg-[#D4A847] text-white px-8 py-3 rounded-full hover:bg-[#c49a3d] transition-colors"
            >
              <span className="font-medium">Vezi tot meniul</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#D4A847] font-medium">Ce spun clienții</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Recenzii
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 bg-[#FFF8E7] rounded-2xl">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#D4A847] fill-[#D4A847]" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{review.text}"</p>
                <p className="font-semibold text-gray-900">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Vino să ne vizitezi sau comandă acum!
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-[#D4A847]" />
                  <span>{restaurantInfo.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-[#D4A847]" />
                  <span>{restaurantInfo.phone}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-[#D4A847]" />
                  <span>Luni - Vineri: {restaurantInfo.schedule.weekdays}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 bg-[#D4A847] text-white px-8 py-4 rounded-full hover:bg-[#c49a3d] transition-colors text-lg font-medium"
              >
                <Phone className="w-5 h-5" />
                <span>Sună pentru comandă</span>
              </a>
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-colors text-lg font-medium"
              >
                <span>Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;