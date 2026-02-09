import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ArrowLeft, Phone, Mail, MapPin, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16" data-testid="refund-policy-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[#D4A847] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Înapoi la pagina principală
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#D4A847]/10 rounded-xl flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-[#D4A847]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Politica de Anulare și Rambursare
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            Ultima actualizare: {new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <p className="text-blue-800">
              Această politică se aplică comenzilor de mâncare plasate prin site-ul web panaghiaautoservirevatradornei.ro, 
              operat de <strong>SC Panaghia S.R.L.</strong> (CUI: 52797172).
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Principiul Legal de Bază</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-yellow-800">Important - Produse Perisabile</p>
                  <p className="text-yellow-700 mt-2">
                    Produsele alimentare sunt perisabile, astfel:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-yellow-700">
                    <li><strong>NU</strong> se acceptă returul mâncării după livrare sau ridicare</li>
                    <li><strong>NU</strong> se aplică dreptul de retragere de 14 zile (conform OUG 34/2014, art. 16, lit. d)</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Când se Poate Face Rambursare</h2>
            <p className="text-gray-700 mb-4">
              Rambursarea se acordă <strong>doar</strong> în următoarele situații:
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">Comandă livrată greșit</p>
                  <p className="text-green-700">Preparat diferit față de ce s-a comandat</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">Lipsă produse sau cantitate incorectă</p>
                  <p className="text-green-700">Nu s-a livrat tot ce s-a comandat</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">Preparatul este alterat / impropriu consumului</p>
                  <p className="text-green-700">Mâncarea prezintă probleme de calitate</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Dovezi Solicitate</h2>
            <p className="text-gray-700 mb-4">
              Pentru analizarea situației, clientului i se pot solicita:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Fotografii ale produsului</li>
              <li>Dovada comenzii (număr comandă, confirmare)</li>
              <li>Ora livrării</li>
            </ul>
            
            <div className="bg-[#FFF8E7] border border-[#D4A847] rounded-xl p-4 mb-6">
              <p className="text-gray-800">
                <strong>Termen:</strong> Vă rugăm să ne contactați în <strong>maxim 2 ore de la livrare</strong> la numărul 
                <a href="tel:0746254162" className="text-[#D4A847] font-bold ml-1">0746 254 162</a>.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Modalitatea de Rambursare</h2>
            <p className="text-gray-700 mb-4">
              Rambursarea se poate face:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Integral sau parțial</strong>, în funcție de situație</li>
              <li>Prin una din următoarele metode:
                <ul className="list-disc pl-6 mt-2">
                  <li><strong>Numerar</strong> - la punctul de lucru</li>
                  <li><strong>Restituire pe card</strong> - în 5-14 zile lucrătoare, în funcție de bancă</li>
                  <li><strong>Voucher</strong> pentru o comandă viitoare (cu acordul clientului)</li>
                </ul>
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Excluderi (NU se acordă rambursări)</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">Mâncarea a fost consumată parțial sau integral</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">Reclamația este subiectivă (gust, preferințe personale)</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">Produsul a fost depozitat sau consumat necorespunzător de către client</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">Reclamația este făcută după termenul limită (2 ore)</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Anularea Comenzii</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">a) Înainte de începerea preparării</h3>
            <p className="text-gray-700 mb-4">
              Comanda poate fi anulată <strong>gratuit</strong> prin apel telefonic la numărul 
              <a href="tel:0746254162" className="text-[#D4A847] font-bold ml-1">0746 254 162</a>, 
              dacă mâncarea nu a început să fie preparată.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">b) După începerea preparării</h3>
            <div className="bg-gray-100 border rounded-xl p-4 mb-6">
              <p className="text-gray-800">
                Odată ce prepararea mâncării a început, comanda <strong>nu mai poate fi anulată</strong>.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Contact pentru Reclamații</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-[#D4A847]" />
                <div>
                  <p className="text-sm text-gray-600">Telefonic</p>
                  <a href="tel:0746254162" className="font-semibold text-gray-900">0746 254 162</a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-[#D4A847]" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href="mailto:panaghia8688@yahoo.com" className="font-semibold text-gray-900">panaghia8688@yahoo.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-[#D4A847]" />
                <div>
                  <p className="text-sm text-gray-600">La sediu</p>
                  <p className="font-semibold text-gray-900">Str. Dornelor nr. 10</p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              Ne angajăm să răspundem la reclamații în <strong>maximum 30 de zile</strong> de la primire.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Soluționare Alternativă</h2>
            <p className="text-gray-700 mb-4">
              Dacă nu sunteți mulțumit de rezolvare, puteți apela la:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                <strong>Platforma europeană ODR:</strong>{' '}
                <a href="https://ec.europa.eu/consumers/odr" className="text-[#D4A847] hover:underline" target="_blank" rel="noopener noreferrer">
                  ec.europa.eu/consumers/odr
                </a>
              </li>
              <li>
                <strong>ANPC:</strong>{' '}
                <a href="https://www.anpc.gov.ro" className="text-[#D4A847] hover:underline" target="_blank" rel="noopener noreferrer">
                  www.anpc.gov.ro
                </a>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t">
              <p className="text-gray-600 text-sm">
                <strong>SC Panaghia S.R.L.</strong><br />
                Str. Dornelor, nr. 10, Vatra Dornei, Jud. Suceava<br />
                CUI: 52797172
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
