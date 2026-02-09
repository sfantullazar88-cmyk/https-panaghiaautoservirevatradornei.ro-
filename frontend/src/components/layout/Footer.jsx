import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { restaurantInfo } from '../../data/mock';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#D4A847] rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.31 7 20 9.69 20 13V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V13C4 9.69 6.69 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2ZM6 13V20H18V13C18 10.79 16.21 9 14 9H10C7.79 9 6 10.79 6 13Z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {restaurantInfo.name}
                </span>
                <span className="text-xs text-gray-400">{restaurantInfo.tagline}</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mt-4">
              Mâncare gătită zilnic cu ingrediente proaspete și multă dragoste.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Link-uri rapide</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-[#D4A847] transition-colors">Acasă</Link></li>
              <li><Link to="/meniu" className="text-gray-400 hover:text-[#D4A847] transition-colors">Meniu</Link></li>
              <li><Link to="/echipa" className="text-gray-400 hover:text-[#D4A847] transition-colors">Echipa</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[#D4A847] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 text-[#D4A847]" />
                <span>{restaurantInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 text-[#D4A847]" />
                <span>{restaurantInfo.email}</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-[#D4A847] mt-1" />
                <span>{restaurantInfo.address}</span>
              </li>
            </ul>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Program</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <Clock className="w-4 h-4 text-[#D4A847]" />
                <div>
                  <p>Luni - Vineri</p>
                  <p className="text-white">{restaurantInfo.schedule.weekdays}</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Clock className="w-4 h-4 text-[#D4A847]" />
                <div>
                  <p>Sâmbătă - Duminică</p>
                  <p className="text-white">{restaurantInfo.schedule.weekend}</p>
                </div>
              </li>
            </ul>
            {/* Social Media */}
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#D4A847] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#D4A847] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2024 {restaurantInfo.name}. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;