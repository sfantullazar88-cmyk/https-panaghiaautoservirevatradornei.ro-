import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16" data-testid="privacy-policy-page">
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
              Politica de Confidențialitate
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            Ultima actualizare: {new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Introducere</h2>
            <p className="text-gray-700 mb-4">
              SC Panaghia S.R.L., cu sediul în Str. Dornelor, nr. 10, Vatra Dornei, Jud. Suceava, CUI: 52797172 
              (denumită în continuare "Panaghia", "noi" sau "Operatorul"), se angajează să protejeze confidențialitatea 
              datelor dumneavoastră personale în conformitate cu Regulamentul General privind Protecția Datelor (GDPR) 
              - Regulamentul (UE) 2016/679.
            </p>
            <p className="text-gray-700 mb-4">
              Această Politică de Confidențialitate explică ce date personale colectăm, cum le folosim, 
              cu cine le partajăm și drepturile pe care le aveți în legătură cu datele dumneavoastră.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Responsabil cu Protecția Datelor (DPO)</h2>
            <p className="text-gray-700 mb-4">
              Pentru orice întrebări legate de prelucrarea datelor personale, puteți contacta responsabilul nostru 
              cu protecția datelor:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Nume:</strong> Valica Nicoleta-Andreia</li>
              <li><strong>Email:</strong> panaghia8688@yahoo.com</li>
              <li><strong>Adresă:</strong> Str. Dornelor, nr. 10, Vatra Dornei, Jud. Suceava</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Ce Date Personale Colectăm</h2>
            <p className="text-gray-700 mb-4">
              Colectăm și prelucrăm următoarele categorii de date personale:
            </p>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">3.1. Date furnizate direct de dumneavoastră:</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Date de identificare:</strong> nume și prenume</li>
              <li><strong>Date de contact:</strong> număr de telefon, adresă de email</li>
              <li><strong>Date de livrare:</strong> adresa de livrare (dacă alegeți livrarea)</li>
              <li><strong>Date despre comenzi:</strong> produsele comandate, preferințe, observații speciale</li>
            </ul>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">3.2. Date colectate automat:</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Date tehnice:</strong> adresa IP, tipul de browser, dispozitivul utilizat</li>
              <li><strong>Date de navigare:</strong> paginile vizitate, timpul petrecut pe site</li>
              <li><strong>Cookie-uri:</strong> conform Politicii noastre de Cookie-uri</li>
            </ul>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">3.3. Date de plată:</h3>
            <p className="text-gray-700 mb-4">
              Nu stocăm datele cardului dumneavoastră. Plățile online sunt procesate securizat prin Stripe, 
              un procesator de plăți certificat PCI-DSS.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Scopurile și Temeiul Legal al Prelucrării</h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Scop</th>
                  <th className="border p-3 text-left">Temei Legal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">Procesarea și livrarea comenzilor</td>
                  <td className="border p-3">Executarea contractului (Art. 6(1)(b) GDPR)</td>
                </tr>
                <tr>
                  <td className="border p-3">Comunicări legate de comandă (confirmare, status)</td>
                  <td className="border p-3">Executarea contractului (Art. 6(1)(b) GDPR)</td>
                </tr>
                <tr>
                  <td className="border p-3">Răspuns la întrebări și reclamații</td>
                  <td className="border p-3">Interes legitim (Art. 6(1)(f) GDPR)</td>
                </tr>
                <tr>
                  <td className="border p-3">Marketing și newsletter (cu consimțământ)</td>
                  <td className="border p-3">Consimțământ (Art. 6(1)(a) GDPR)</td>
                </tr>
                <tr>
                  <td className="border p-3">Îmbunătățirea serviciilor și site-ului</td>
                  <td className="border p-3">Interes legitim (Art. 6(1)(f) GDPR)</td>
                </tr>
                <tr>
                  <td className="border p-3">Conformitate legală (facturare, contabilitate)</td>
                  <td className="border p-3">Obligație legală (Art. 6(1)(c) GDPR)</td>
                </tr>
              </tbody>
            </table>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Perioada de Stocare</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Datele comenzilor:</strong> 5 ani (obligații fiscale)</li>
              <li><strong>Datele de contact pentru marketing:</strong> până la retragerea consimțământului</li>
              <li><strong>Cookie-uri:</strong> conform duratei specificate în Politica de Cookie-uri</li>
              <li><strong>Date tehnice (log-uri):</strong> maximum 12 luni</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Cui Transmitem Datele</h2>
            <p className="text-gray-700 mb-4">
              Datele dumneavoastră pot fi transmise către:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Procesatori de plăți:</strong> Stripe (pentru plăți online)</li>
              <li><strong>Servicii de email:</strong> pentru notificări despre comenzi</li>
              <li><strong>Autorități:</strong> când suntem obligați legal</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Nu vindem și nu închiriem datele dumneavoastră personale către terți.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Transferuri Internaționale</h2>
            <p className="text-gray-700 mb-4">
              Unii dintre furnizorii noștri de servicii pot fi localizați în afara Spațiului Economic European (SEE). 
              În astfel de cazuri, ne asigurăm că transferurile sunt protejate prin:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Clauze contractuale standard aprobate de Comisia Europeană</li>
              <li>Certificări (ex: EU-US Data Privacy Framework)</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Drepturile Dumneavoastră (GDPR)</h2>
            <p className="text-gray-700 mb-4">
              În conformitate cu GDPR, aveți următoarele drepturi:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Dreptul de acces:</strong> să solicitați o copie a datelor dumneavoastră</li>
              <li><strong>Dreptul la rectificare:</strong> să corectați datele inexacte</li>
              <li><strong>Dreptul la ștergere ("dreptul de a fi uitat"):</strong> să solicitați ștergerea datelor</li>
              <li><strong>Dreptul la restricționare:</strong> să limitați prelucrarea datelor</li>
              <li><strong>Dreptul la portabilitate:</strong> să primiți datele într-un format structurat</li>
              <li><strong>Dreptul de opoziție:</strong> să vă opuneți prelucrării pentru marketing direct</li>
              <li><strong>Dreptul de a retrage consimțământul:</strong> în orice moment, fără a afecta legalitatea prelucrării anterioare</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Pentru a vă exercita drepturile, contactați-ne la: <strong>panaghia8688@yahoo.com</strong>
            </p>
            <p className="text-gray-700 mb-4">
              Vom răspunde în termen de 30 de zile. Dacă nu sunteți mulțumit de răspunsul nostru, 
              aveți dreptul să depuneți o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor 
              cu Caracter Personal (ANSPDCP): <a href="https://www.dataprotection.ro" className="text-[#D4A847] hover:underline" target="_blank" rel="noopener noreferrer">www.dataprotection.ro</a>
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Securitatea Datelor</h2>
            <p className="text-gray-700 mb-4">
              Implementăm măsuri tehnice și organizatorice pentru protejarea datelor dumneavoastră:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Criptare SSL/TLS pentru toate transmisiile de date</li>
              <li>Parole criptate cu algoritm bcrypt</li>
              <li>Acces restricționat la date (doar personalul autorizat)</li>
              <li>Backup-uri regulate și securizate</li>
              <li>Monitorizare și detectare a incidentelor de securitate</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Modificări ale Politicii</h2>
            <p className="text-gray-700 mb-4">
              Ne rezervăm dreptul de a actualiza această politică. Orice modificări semnificative 
              vor fi comunicate prin site-ul nostru web sau prin email.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Contact</h2>
            <p className="text-gray-700 mb-4">
              Pentru orice întrebări despre această politică sau despre prelucrarea datelor dumneavoastră:
            </p>
            <ul className="list-none mb-4 text-gray-700">
              <li><strong>SC Panaghia S.R.L.</strong></li>
              <li>Str. Dornelor, nr. 10, Vatra Dornei, Jud. Suceava</li>
              <li>CUI: 52797172</li>
              <li>Email: panaghia8688@yahoo.com</li>
              <li>Telefon: 0746 254 162</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
