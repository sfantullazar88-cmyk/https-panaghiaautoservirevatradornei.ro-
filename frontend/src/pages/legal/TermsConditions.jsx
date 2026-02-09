import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16" data-testid="terms-conditions-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[#D4A847] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Înapoi la pagina principală
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#D4A847]/10 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#D4A847]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Termeni și Condiții
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            Ultima actualizare: {new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Informații Generale</h2>
            <p className="text-gray-700 mb-4">
              Prezentul document stabilește termenii și condițiile de utilizare a site-ului web 
              panaghiaautoservirevatradornei.ro (denumit în continuare "Site-ul") și a serviciilor oferite 
              de SC Panaghia S.R.L.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Date de identificare ale Operatorului:</strong>
            </p>
            <ul className="list-none mb-4 text-gray-700">
              <li>Denumire: SC Panaghia S.R.L.</li>
              <li>Sediu social: Str. Dornelor, nr. 10, Vatra Dornei, Jud. Suceava</li>
              <li>CUI: 52797172</li>
              <li>Email: panaghia8688@yahoo.com</li>
              <li>Telefon: 0746 254 162</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Definiții</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>"Client"</strong> - orice persoană fizică sau juridică care plasează o comandă prin intermediul Site-ului</li>
              <li><strong>"Comandă"</strong> - solicitarea de achiziție a produselor alimentare de pe Site</li>
              <li><strong>"Produs"</strong> - preparatele alimentare disponibile pe Site</li>
              <li><strong>"Livrare"</strong> - transportul comenzii la adresa indicată de Client</li>
              <li><strong>"Ridicare"</strong> - preluarea comenzii de către Client de la punctul de lucru</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Acceptarea Termenilor</h2>
            <p className="text-gray-700 mb-4">
              Prin utilizarea Site-ului și plasarea unei comenzi, confirmați că:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Ați citit și acceptați acești Termeni și Condiții</li>
              <li>Ați citit și acceptați Politica de Confidențialitate</li>
              <li>Aveți capacitatea juridică de a încheia contracte (minimum 18 ani)</li>
              <li>Informațiile furnizate sunt corecte și complete</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Plasarea Comenzii</h2>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">4.1. Procesul de comandă:</h3>
            <ol className="list-decimal pl-6 mb-4 text-gray-700">
              <li>Selectați produsele dorite și adăugați-le în coș</li>
              <li>Completați datele de contact și livrare (dacă este cazul)</li>
              <li>Alegeți metoda de plată (numerar sau card online)</li>
              <li>Confirmați comanda</li>
            </ol>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">4.2. Confirmarea comenzii:</h3>
            <p className="text-gray-700 mb-4">
              După plasarea comenzii, veți primi un număr unic de comandă. Comanda este considerată acceptată 
              în momentul în care vă contactăm telefonic pentru confirmare sau în momentul procesării plății online.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Prețuri și Plată</h2>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">5.1. Prețuri:</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Toate prețurile sunt afișate în Lei (RON) și includ TVA</li>
              <li>Prețurile pot fi modificate fără notificare prealabilă, dar comenzile confirmate vor fi onorate la prețul din momentul plasării</li>
              <li>Costul livrării: 10 lei (pentru comenzi cu livrare)</li>
            </ul>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">5.2. Metode de plată acceptate:</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Numerar</strong> - la ridicare sau livrare</li>
              <li><strong>Card online</strong> - prin procesatorul securizat Stripe</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Livrare și Ridicare</h2>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">6.1. Zona de livrare:</h3>
            <p className="text-gray-700 mb-4">
              Livrăm în Vatra Dornei și împrejurimi. Pentru zone situate la distanță mai mare, 
              vă rugăm să ne contactați telefonic.
            </p>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">6.2. Timpul de livrare:</h3>
            <p className="text-gray-700 mb-4">
              Timpul estimat de livrare este de 30-60 minute, în funcție de volumul comenzilor și distanță. 
              În perioadele aglomerate, timpul poate fi mai lung.
            </p>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">6.3. Ridicare personală:</h3>
            <p className="text-gray-700 mb-4">
              Comenzile pot fi ridicate de la adresa: Str. Dornelor, nr. 10, Vatra Dornei.
              Veți fi contactat când comanda este gata de ridicare.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Program de Funcționare</h2>
            <ul className="list-none mb-4 text-gray-700">
              <li><strong>Luni - Vineri:</strong> 11:00 - 17:00</li>
              <li><strong>Sâmbătă - Duminică:</strong> Închis</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Comenzile plasate în afara programului vor fi procesate în prima zi lucrătoare.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Anulări și Modificări</h2>
            <p className="text-gray-700 mb-4">
              Vă rugăm să consultați <Link to="/anulare-rambursare" className="text-[#D4A847] hover:underline">Politica de Anulare și Rambursare</Link> pentru 
              detalii complete privind anularea și modificarea comenzilor.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Calitatea Produselor</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Toate preparatele sunt gătite zilnic, din ingrediente proaspete</li>
              <li>Respectăm normele de igienă și siguranță alimentară în vigoare</li>
              <li>Produsele pot conține alergeni - vă rugăm să ne informați despre orice alergie</li>
              <li>Imaginile produselor sunt cu titlu de prezentare, aspectul real poate varia ușor</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Responsabilitate</h2>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">10.1. Responsabilitatea noastră:</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Garantăm calitatea produselor în momentul livrării/ridicării</li>
              <li>Nu răspundem pentru deteriorarea produselor cauzată de depozitare necorespunzătoare de către Client</li>
              <li>Nu răspundem pentru întârzieri cauzate de factori externi (trafic, condiții meteo extreme)</li>
            </ul>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">10.2. Responsabilitatea Clientului:</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Furnizarea de informații corecte și complete</li>
              <li>Asigurarea accesibilității la adresa de livrare</li>
              <li>Verificarea comenzii la primire</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Proprietate Intelectuală</h2>
            <p className="text-gray-700 mb-4">
              Toate conținuturile Site-ului (texte, imagini, logo, design) sunt proprietatea SC Panaghia S.R.L. 
              sau sunt utilizate cu acordul deținătorilor drepturilor. Reproducerea fără acord scris este interzisă.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. Forță Majoră</h2>
            <p className="text-gray-700 mb-4">
              Nu suntem răspunzători pentru neexecutarea obligațiilor în cazuri de forță majoră: 
              calamități naturale, pandemii, greve, întreruperi de energie sau internet.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">13. Modificarea Termenilor</h2>
            <p className="text-gray-700 mb-4">
              Ne rezervăm dreptul de a modifica acești Termeni și Condiții. Modificările vor fi publicate 
              pe Site și vor intra în vigoare la data publicării.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">14. Legea Aplicabilă și Jurisdicție</h2>
            <p className="text-gray-700 mb-4">
              Acești Termeni și Condiții sunt guvernați de legislația română. Orice litigiu va fi soluționat 
              de instanțele competente din România.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">15. Soluționarea Alternativă a Litigiilor</h2>
            <p className="text-gray-700 mb-4">
              În cazul unui litigiu, puteți apela la:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>ANPC:</strong> <a href="https://www.anpc.gov.ro" className="text-[#D4A847] hover:underline" target="_blank" rel="noopener noreferrer">www.anpc.gov.ro</a></li>
              <li><strong>Platforma ODR:</strong> <a href="https://ec.europa.eu/consumers/odr" className="text-[#D4A847] hover:underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a></li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">16. Contact</h2>
            <p className="text-gray-700 mb-4">
              Pentru orice întrebări referitoare la acești Termeni și Condiții:
            </p>
            <ul className="list-none mb-4 text-gray-700">
              <li><strong>SC Panaghia S.R.L.</strong></li>
              <li>Str. Dornelor, nr. 10, Vatra Dornei, Jud. Suceava</li>
              <li>Email: panaghia8688@yahoo.com</li>
              <li>Telefon: 0746 254 162</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
