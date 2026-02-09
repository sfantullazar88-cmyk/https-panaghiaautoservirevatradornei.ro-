import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const refuseCookies = () => {
    localStorage.setItem('cookieConsent', 'refused');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#FFF8E7] rounded-full flex items-center justify-center flex-shrink-0">
          <Cookie className="w-5 h-5 text-[#D4A847]" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Folosim cookie-uri</h3>
          <p className="text-sm text-gray-600 mb-4">
            Acest site folosește cookie-uri pentru a vă oferi cea mai bună experiență. 
            Cookie-urile necesare sunt esențiale pentru funcționarea site-ului. 
            <a href="#" className="text-[#D4A847] hover:underline ml-1">Află mai multe</a>
          </p>
          <div className="flex gap-3">
            <button
              onClick={acceptCookies}
              className="px-5 py-2 bg-[#D4A847] text-white rounded-full text-sm font-medium hover:bg-[#c49a3d] transition-colors"
            >
              Accept toate
            </button>
            <button
              onClick={refuseCookies}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:border-gray-400 transition-colors"
            >
              Refuz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;