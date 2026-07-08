import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const MeniulZileiVatraDornei = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>Meniul Zilei Vatra Dornei | Mâncare Gătită | PanAghia</title>
        <meta
          name="description"
          content="Meniul zilei în Vatra Dornei la PanAghia: mâncare gătită zilnic, ciorbe, feluri principale, garnituri, preparate tradiționale, la pachet sau cu livrare."
        />
        <link
          rel="canonical"
          href="https://www.panaghiaautoservirevatradornei.ro/meniul-zilei-vatra-dornei"
        />
      </Helmet>

      <section className="bg-[#D4A847] py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Meniul zilei în Vatra Dornei
          </h1>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            La PanAghia Autoservire & Delivery găsești mâncare gătită zilnic,
            potrivită pentru prânz, servire rapidă, comandă la pachet sau
            livrare în Vatra Dornei.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-7 text-gray-700 text-lg leading-relaxed">
          <p>
            Dacă ești în căutarea unui <strong>meniu al zilei în Vatra Dornei</strong>,
            PanAghia îți oferă variante de mâncare gătită, pregătită zilnic,
            cu preparate potrivite pentru o masă caldă și sățioasă.
          </p>

          <p>
            Meniul zilei poate include ciorbe, feluri principale, garnituri și
            preparate tradiționale, în funcție de disponibilitatea zilei.
            Este o alegere bună pentru localnici, angajați, turiști sau familii
            care vor mâncare bună fără timp pierdut.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Mâncare gătită pentru prânz în Vatra Dornei
          </h2>

          <p>
            PanAghia este potrivită pentru cei care caută o autoservire în Vatra
            Dornei, o masă caldă la prânz, mâncare la pachet sau opțiuni de
            livrare. Preparatele sunt gândite pentru gust, sațietate și servire
            rapidă.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Ce găsești la PanAghia
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>meniul zilei în Vatra Dornei;</li>
            <li>mâncare gătită zilnic;</li>
            <li>ciorbe, feluri principale și garnituri;</li>
            <li>preparate pentru servire la autoservire sau la pachet;</li>
            <li>opțiuni pentru livrare și comenzi telefonice.</li>
          </ul>

          <p>
            Pentru meniul disponibil în ziua curentă, verifică pagina de meniu
            sau contactează-ne telefonic. Disponibilitatea preparatelor poate
            varia în funcție de zi și de comenzile primite.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Link
              to="/meniu"
              className="bg-[#D4A847] text-white px-6 py-3 rounded-lg font-semibold text-center"
            >
              Vezi meniul disponibil
            </Link>

            <Link
              to="/unde-se-mananca-bine-in-vatra-dornei"
              className="border border-[#D4A847] text-[#D4A847] px-6 py-3 rounded-lg font-semibold text-center"
            >
              Unde se mănâncă bine în Vatra Dornei
            </Link>

            <Link
              to="/contact"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold text-center"
            >
              Contact pentru comenzi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MeniulZileiVatraDornei;