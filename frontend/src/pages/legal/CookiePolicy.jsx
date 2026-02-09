import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ArrowLeft } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16" data-testid="cookie-policy-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[#D4A847] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Înapoi la pagina principală
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#D4A847]/10 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-[#D4A847]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Politica de Cookie-uri
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            Ultima actualizare: {new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Ce sunt Cookie-urile?</h2>
            <p className="text-gray-700 mb-4">
              Cookie-urile sunt fișiere text de mici dimensiuni care sunt stocate pe dispozitivul dumneavoastră 
              (computer, telefon, tabletă) atunci când vizitați un site web. Acestea permit site-ului să vă 
              recunoască și să rețină anumite informații despre preferințele dumneavoastră.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Cine Utilizează Cookie-uri?</h2>
            <p className="text-gray-700 mb-4">
              Cookie-urile de pe acest site sunt utilizate de:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>SC Panaghia S.R.L.</strong> - Str. Dornelor, nr. 10, Vatra Dornei, Jud. Suceava, CUI: 52797172</li>
              <li><strong>Furnizori terți</strong> - parteneri care ne ajută să îmbunătățim serviciile</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Tipuri de Cookie-uri Utilizate</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">3.1. Cookie-uri Strict Necesare</h3>
            <p className="text-gray-700 mb-2">
              Aceste cookie-uri sunt esențiale pentru funcționarea site-ului și nu pot fi dezactivate.
            </p>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Cookie</th>
                  <th className="border p-3 text-left">Scop</th>
                  <th className="border p-3 text-left">Durată</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">adminToken</td>
                  <td className="border p-3">Autentificare administrator</td>
                  <td className="border p-3">Sesiune / 7 zile</td>
                </tr>
                <tr>
                  <td className="border p-3">cookieConsent</td>
                  <td className="border p-3">Stocarea consimțământului pentru cookie-uri</td>
                  <td className="border p-3">12 luni</td>
                </tr>
                <tr>
                  <td className="border p-3">cart</td>
                  <td className="border p-3">Salvarea coșului de cumpărături</td>
                  <td className="border p-3">Sesiune</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">3.2. Cookie-uri de Performanță</h3>
            <p className="text-gray-700 mb-2">
              Aceste cookie-uri ne ajută să înțelegem cum utilizați site-ul.
            </p>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Cookie</th>
                  <th className="border p-3 text-left">Scop</th>
                  <th className="border p-3 text-left">Durată</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">_ga</td>
                  <td className="border p-3">Google Analytics - identificare vizitatori</td>
                  <td className="border p-3">2 ani</td>
                </tr>
                <tr>
                  <td className="border p-3">_gid</td>
                  <td className="border p-3">Google Analytics - identificare sesiune</td>
                  <td className="border p-3">24 ore</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">3.3. Cookie-uri Funcționale</h3>
            <p className="text-gray-700 mb-2">
              Aceste cookie-uri îmbunătățesc experiența de utilizare.
            </p>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Cookie</th>
                  <th className="border p-3 text-left">Scop</th>
                  <th className="border p-3 text-left">Durată</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">preferinte</td>
                  <td className="border p-3">Salvarea preferințelor utilizatorului</td>
                  <td className="border p-3">12 luni</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">3.4. Cookie-uri Terțe Părți</h3>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Furnizor</th>
                  <th className="border p-3 text-left">Scop</th>
                  <th className="border p-3 text-left">Politică</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">Stripe</td>
                  <td className="border p-3">Procesare plăți securizate</td>
                  <td className="border p-3">
                    <a href="https://stripe.com/privacy" className="text-[#D4A847] hover:underline" target="_blank" rel="noopener noreferrer">
                      stripe.com/privacy
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="border p-3">Google Maps</td>
                  <td className="border p-3">Afișare hărți și locații</td>
                  <td className="border p-3">
                    <a href="https://policies.google.com/privacy" className="text-[#D4A847] hover:underline" target="_blank" rel="noopener noreferrer">
                      policies.google.com/privacy
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Cum să Gestionați Cookie-urile</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">4.1. Prin Banner-ul de Consimțământ</h3>
            <p className="text-gray-700 mb-4">
              La prima vizită, veți vedea un banner care vă permite să acceptați sau să refuzați cookie-urile 
              non-esențiale. Puteți modifica preferințele oricând din setările site-ului.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">4.2. Prin Setările Browser-ului</h3>
            <p className="text-gray-700 mb-4">
              Puteți controla cookie-urile prin setările browser-ului:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Chrome:</strong> Setări → Confidențialitate și securitate → Cookie-uri</li>
              <li><strong>Firefox:</strong> Opțiuni → Confidențialitate și securitate → Cookie-uri</li>
              <li><strong>Safari:</strong> Preferințe → Confidențialitate</li>
              <li><strong>Edge:</strong> Setări → Cookie-uri și permisiuni site</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800">
                <strong>Atenție:</strong> Dezactivarea cookie-urilor poate afecta funcționalitatea site-ului. 
                Cookie-urile strict necesare nu pot fi dezactivate.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Tehnologii Similare</h2>
            <p className="text-gray-700 mb-4">
              Pe lângă cookie-uri, putem utiliza și alte tehnologii similare:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Local Storage:</strong> pentru stocarea datelor locale (ex: coșul de cumpărături)</li>
              <li><strong>Session Storage:</strong> pentru date temporare ale sesiunii</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Baza Legală</h2>
            <p className="text-gray-700 mb-4">
              Utilizăm cookie-uri în conformitate cu:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Regulamentul General privind Protecția Datelor (GDPR) - Regulamentul (UE) 2016/679</li>
              <li>Directiva ePrivacy 2002/58/CE (modificată prin 2009/136/CE)</li>
              <li>Legea nr. 506/2004 privind prelucrarea datelor cu caracter personal</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Actualizări ale Politicii</h2>
            <p className="text-gray-700 mb-4">
              Această politică poate fi actualizată periodic. Data ultimei modificări este afișată la începutul documentului. 
              Vă recomandăm să verificați periodic această pagină.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Contact</h2>
            <p className="text-gray-700 mb-4">
              Pentru întrebări despre utilizarea cookie-urilor:
            </p>
            <ul className="list-none mb-4 text-gray-700">
              <li><strong>SC Panaghia S.R.L.</strong></li>
              <li>Str. Dornelor, nr. 10, Vatra Dornei, Jud. Suceava</li>
              <li>Email: panaghia8688@yahoo.com</li>
              <li>Telefon: 0746 254 162</li>
              <li>DPO: Valica Nicoleta-Andreia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
