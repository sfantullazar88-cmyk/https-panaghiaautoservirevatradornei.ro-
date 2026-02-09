import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Check, ExternalLink } from 'lucide-react';

const GDPRConsent = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16" data-testid="gdpr-consent-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[#D4A847] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Înapoi la pagina principală
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#D4A847]/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#D4A847]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Consimțământ GDPR
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            Informații privind prelucrarea datelor cu caracter personal
          </p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Operator de Date</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 mb-2"><strong>SC Panaghia S.R.L.</strong></p>
              <ul className="list-none text-gray-700">
                <li>Sediu: Str. Dornelor, nr. 10, Vatra Dornei, Jud. Suceava</li>
                <li>CUI: 52797172</li>
                <li>Email: panaghia8688@yahoo.com</li>
                <li>Telefon: 0746 254 162</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Responsabil Protecția Datelor (DPO)</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 mb-2"><strong>Valica Nicoleta-Andreia</strong></p>
              <p className="text-gray-700">Email: panaghia8688@yahoo.com</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Ce Date Colectăm și De Ce</h2>
            <p className="text-gray-700 mb-4">
              Prin plasarea unei comenzi pe site-ul nostru, colectăm și prelucrăm următoarele date:
            </p>

            <div className="space-y-4 mb-6">
              <div className="border rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Date de identificare și contact</h3>
                <p className="text-gray-600 text-sm mb-2">Nume, telefon, email, adresă de livrare</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Temei: Executarea contractului</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Art. 6(1)(b) GDPR</span>
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Date despre comenzi</h3>
                <p className="text-gray-600 text-sm mb-2">Produsele comandate, preferințe, observații</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Temei: Executarea contractului</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Art. 6(1)(b) GDPR</span>
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Date tehnice</h3>
                <p className="text-gray-600 text-sm mb-2">Adresă IP, browser, cookie-uri</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Temei: Interes legitim</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Art. 6(1)(f) GDPR</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Drepturile Dumneavoastră</h2>
            <p className="text-gray-700 mb-4">
              Conform Regulamentului General privind Protecția Datelor (GDPR), aveți următoarele drepturi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Dreptul de acces</p>
                  <p className="text-sm text-gray-600">Să solicitați o copie a datelor dumneavoastră</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Dreptul la rectificare</p>
                  <p className="text-sm text-gray-600">Să corectați datele inexacte</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Dreptul la ștergere</p>
                  <p className="text-sm text-gray-600">"Dreptul de a fi uitat"</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Dreptul la restricționare</p>
                  <p className="text-sm text-gray-600">Să limitați prelucrarea datelor</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Dreptul la portabilitate</p>
                  <p className="text-sm text-gray-600">Să primiți datele într-un format structurat</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Dreptul de opoziție</p>
                  <p className="text-sm text-gray-600">Să vă opuneți prelucrării pentru marketing</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl md:col-span-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Dreptul de a retrage consimțământul</p>
                  <p className="text-sm text-gray-600">În orice moment, fără a afecta legalitatea prelucrării anterioare</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Cum Vă Exercitați Drepturile</h2>
            <p className="text-gray-700 mb-4">
              Pentru a vă exercita oricare dintre drepturi, contactați-ne la:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Email: <a href="mailto:panaghia8688@yahoo.com" className="text-[#D4A847] hover:underline">panaghia8688@yahoo.com</a></li>
              <li>Telefon: 0746 254 162</li>
              <li>Adresă: Str. Dornelor, nr. 10, Vatra Dornei</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Vom răspunde solicitării dumneavoastră în termen de <strong>30 de zile</strong>.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Perioada de Stocare</h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Tip de date</th>
                  <th className="border p-3 text-left">Perioada de stocare</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">Date comenzi</td>
                  <td className="border p-3">5 ani (obligații fiscale)</td>
                </tr>
                <tr>
                  <td className="border p-3">Date marketing</td>
                  <td className="border p-3">Până la retragerea consimțământului</td>
                </tr>
                <tr>
                  <td className="border p-3">Cookie-uri</td>
                  <td className="border p-3">Conform politicii de cookie-uri</td>
                </tr>
                <tr>
                  <td className="border p-3">Log-uri tehnice</td>
                  <td className="border p-3">Maximum 12 luni</td>
                </tr>
              </tbody>
            </table>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Securitatea Datelor</h2>
            <p className="text-gray-700 mb-4">
              Implementăm măsuri tehnice și organizatorice pentru protejarea datelor:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Criptare SSL/TLS pentru toate transmisiile</li>
              <li>Parole criptate cu algoritm bcrypt</li>
              <li>Acces restricționat la date</li>
              <li>Backup-uri regulate și securizate</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Plângeri</h2>
            <p className="text-gray-700 mb-4">
              Dacă nu sunteți mulțumit de modul în care vă prelucrăm datele, aveți dreptul să depuneți o plângere la:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="font-semibold text-gray-900 mb-2">Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</p>
              <ul className="list-none text-gray-700">
                <li>Website: <a href="https://www.dataprotection.ro" className="text-[#D4A847] hover:underline inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer">www.dataprotection.ro <ExternalLink className="w-4 h-4" /></a></li>
                <li>Adresă: B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București</li>
                <li>Telefon: +40.318.059.211 / +40.318.059.212</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Consimțământ pentru Plasarea Comenzii</h2>
            <div className="bg-[#FFF8E7] border border-[#D4A847] rounded-xl p-6 mb-6">
              <p className="text-gray-800 mb-4">
                Prin plasarea unei comenzi pe site-ul nostru, confirmați că:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D4A847] flex-shrink-0 mt-0.5" />
                  <span>Ați citit și înțeles această informare privind prelucrarea datelor</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D4A847] flex-shrink-0 mt-0.5" />
                  <span>Sunteți de acord cu prelucrarea datelor pentru executarea comenzii</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D4A847] flex-shrink-0 mt-0.5" />
                  <span>Ați citit <Link to="/confidentialitate" className="text-[#D4A847] hover:underline">Politica de Confidențialitate</Link></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D4A847] flex-shrink-0 mt-0.5" />
                  <span>Ați citit <Link to="/termeni-conditii" className="text-[#D4A847] hover:underline">Termenii și Condițiile</Link></span>
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Documente Conexe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/confidentialitate" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Shield className="w-5 h-5 text-[#D4A847]" />
                <span className="font-medium text-gray-900">Politica de Confidențialitate</span>
              </Link>
              <Link to="/cookie" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Shield className="w-5 h-5 text-[#D4A847]" />
                <span className="font-medium text-gray-900">Politica de Cookie-uri</span>
              </Link>
              <Link to="/termeni-conditii" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Shield className="w-5 h-5 text-[#D4A847]" />
                <span className="font-medium text-gray-900">Termeni și Condiții</span>
              </Link>
              <Link to="/anulare-rambursare" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Shield className="w-5 h-5 text-[#D4A847]" />
                <span className="font-medium text-gray-900">Politica de Anulare și Rambursare</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRConsent;
