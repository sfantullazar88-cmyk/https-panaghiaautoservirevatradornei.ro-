import React, { useEffect, useRef, useState } from 'react';
import {
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Star,
} from 'lucide-react';

const GOOGLE_MAPS_LINK =
  'https://maps.app.goo.gl/mBagh8pNGe1LLq1CA';

const PHONE_DISPLAY = '0746 254 162';
const PHONE_LINK = '0746254162';

// Modifică aceste două valori când se schimbă ratingul.
const GOOGLE_RATING = '5,0';
const GOOGLE_REVIEW_COUNT = 9;

const PremiumLocation = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [locationMessage, setLocationMessage] = useState(
    'Google Maps va calcula traseul și timpul estimat.'
  );

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  const openDirections = () => {
    setLocationMessage(
      'Se deschide Google Maps pentru calcularea traseului...'
    );

    const destination = encodeURIComponent(
      'PanAghia Autoservire & Delivery, Strada Dornelor 10, Vatra Dornei'
    );

    const directionsUrl =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${destination}&travelmode=driving`;

    window.open(
      directionsUrl,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#FFFBF1] to-white py-16 md:py-24"
      data-testid="premium-location-section"
    >
      {/* Elemente decorative */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#D4A847]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#D4A847]/10 blur-3xl" />

      <div
        className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          isVisible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-10 opacity-0'
        }`}
      >
        {/* Titlu */}
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A847]/30 bg-[#D4A847]/10 px-4 py-2 text-sm font-medium text-[#9D792F]">
            <MapPin className="h-4 w-4" />
            În centrul orașului Vatra Dornei
          </div>

          <h2
            className="text-3xl font-bold text-gray-900 md:text-5xl"
            style={{
              fontFamily: 'Playfair Display, serif',
            }}
          >
            Ne găsiți ușor
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
            Vă așteptăm la PanAghia Autoservire & Delivery,
            pe Strada Dornelor nr. 10, Vatra Dornei.
          </p>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-5">
          {/* Card informații */}
          <div className="lg:col-span-2">
            <div className="h-full rounded-3xl border border-[#D4A847]/20 bg-white p-6 shadow-xl shadow-gray-200/60 md:p-8">
              {/* Rating */}
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group mb-8 block rounded-2xl bg-gradient-to-r from-[#FFF6DD] to-[#FFFDF7] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Evaluare Google
                    </p>

                    <div className="mt-1 flex items-end gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {GOOGLE_RATING}
                      </span>

                      <span className="pb-1 text-sm text-gray-500">
                        / 5
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-5 w-5 fill-[#D4A847] text-[#D4A847]"
                        />
                      ))}
                    </div>

                    <span className="mt-2 text-sm text-gray-600 group-hover:text-[#9D792F]">
                      {GOOGLE_REVIEW_COUNT} recenzii
                    </span>
                  </div>
                </div>
              </a>

              {/* Adresă */}
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#D4A847]/15">
                  <MapPin className="h-6 w-6 text-[#B78A32]" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    PanAghia Autoservire
                  </h3>

                  <p className="mt-1 leading-6 text-gray-600">
                    Strada Dornelor nr. 10
                    <br />
                    Vatra Dornei, Suceava
                  </p>
                </div>
              </div>

              {/* Program */}
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#D4A847]/15">
                  <Clock className="h-6 w-6 text-[#B78A32]" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Program
                  </h3>

                  <p className="mt-1 leading-6 text-gray-600">
                    Luni – Sâmbătă
                    <br />
                    11:00 – 17:00
                  </p>
                </div>
              </div>

              {/* Telefon */}
              <div className="mb-8 flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#D4A847]/15">
                  <Phone className="h-6 w-6 text-[#B78A32]" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Telefon
                  </h3>

                  <a
                    href={`tel:${PHONE_LINK}`}
                    className="mt-1 inline-block text-gray-600 transition-colors hover:text-[#B78A32]"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </div>
              </div>

              {/* Timp estimat */}
              <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Navigation className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />

                  <div>
                    <p className="font-medium text-blue-900">
                      Traseu și timp estimat
                    </p>

                    <p className="mt-1 text-sm leading-5 text-blue-700">
                      {locationMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Butoane */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${PHONE_LINK}`}
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-[#D4A847] px-5 py-3 font-medium text-[#9D792F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D4A847] hover:text-white hover:shadow-lg"
                >
                  <Phone className="h-5 w-5" />
                  Sună acum
                </a>

                <button
                  type="button"
                  onClick={openDirections}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#D4A847] px-5 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C2993D] hover:shadow-lg"
                >
                  <Navigation className="h-5 w-5" />
                  Navighează
                </button>
              </div>
            </div>
          </div>

          {/* Harta */}
          <div className="lg:col-span-3">
            <div className="group relative h-full min-h-[480px] overflow-hidden rounded-3xl border-4 border-white bg-gray-100 shadow-2xl shadow-gray-300/50">
              <iframe
                title="Locația PanAghia Autoservire Vatra Dornei"
                src="https://www.google.com/maps?q=PanAghia%20Autoservire%20%26%20Delivery%2C%20Strada%20Dornelor%2010%2C%20Vatra%20Dornei&output=embed"
                width="100%"
                height="100%"
                className="absolute inset-0 h-full min-h-[480px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              {/* Buton peste hartă */}
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/95 px-5 py-3 font-medium text-gray-900 shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <ExternalLink className="h-5 w-5 text-[#B78A32]" />
                Deschide în Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Mesaj mobil */}
        <p className="mt-7 text-center text-sm text-gray-500">
          Pe telefon, butoanele „Sună acum” și „Navighează”
          deschid automat aplicațiile corespunzătoare.
        </p>
      </div>
    </section>
  );
};

export default PremiumLocation;