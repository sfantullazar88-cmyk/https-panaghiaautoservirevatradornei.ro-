import React from 'react';
import { ChefHat, Heart, Award } from 'lucide-react';
import { teamMembers, restaurantInfo } from '../data/mock';

const Team = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <section className="bg-[#D4A847] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Echipa Noastră
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Oamenii pasionați din spatele fiecărei mese delicioase
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#D4A847] font-medium">Despre Noi</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Povestea {restaurantInfo.name}
              </h2>
              <p className="text-gray-600 mb-4">
                Autoservirea Panaghia s-a născut din dorința de a oferi locuitorilor din Vatra Dornei 
                mâncare gătită ca acasă, cu ingrediente proaspete și rețete tradiționale transmise din generație în generație.
              </p>
              <p className="text-gray-600 mb-4">
                Zilnic pregătim o varietate de ciorbe, feluri principale și garnituri, toate 
                gătite cu grijă și pasiune. Credem că mâncarea bună aduce oamenii împreună.
              </p>
              <p className="text-gray-600">
                Vă așteptăm să ne vizitați sau să comandați la pachet - gustul casei vă așteaptă!
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&q=80"
                alt="Chef cooking"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#D4A847] text-white p-6 rounded-2xl shadow-lg">
                <p className="text-4xl font-bold">15+</p>
                <p className="text-sm">Ani de experiență</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#D4A847] font-medium">Valorile Noastre</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ce ne definește
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-[#D4A847]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-[#D4A847]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tradiție</h3>
              <p className="text-gray-600">
                Rețete autentice românești, transmise din generație în generație
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-[#D4A847]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-[#D4A847]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pasiune</h3>
              <p className="text-gray-600">
                Fiecare preparat este gătit cu dragoste și dedicație
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-[#D4A847]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#D4A847]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Calitate</h3>
              <p className="text-gray-600">
                Doar ingrediente proaspete și de cea mai bună calitate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#D4A847] font-medium">Echipa</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Faceți cunoștință cu noi
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-sm">{member.description}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-[#D4A847]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;