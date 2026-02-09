import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Star } from 'lucide-react';
import { menuItems, menuCategories } from '../data/mock';

const Menu = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <section className="bg-[#D4A847] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Meniul Nostru
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Descoperă preparatele noastre tradiționale, gătite zilnic cu ingrediente proaspete
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Caută în meniu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-[#D4A847] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Toate
          </button>
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-[#D4A847] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {item.isPopular && (
                  <div className="absolute top-3 left-3 bg-[#D4A847] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    Popular
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-[#D4A847]">{item.price} lei</span>
                  <button 
                    onClick={() => onAddToCart && onAddToCart(item)}
                    className="w-10 h-10 bg-[#D4A847] text-white rounded-full flex items-center justify-center hover:bg-[#c49a3d] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nu am găsit preparate care să corespundă căutării tale.</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="mt-4 text-[#D4A847] hover:underline"
            >
              Resetează filtrele
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;