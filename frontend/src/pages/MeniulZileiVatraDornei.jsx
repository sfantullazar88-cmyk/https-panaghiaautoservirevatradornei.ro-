import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const MeniulZileiVatraDornei = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>Meniul Zilei Vatra Dornei | PanAghia Autoservire</title>
        <meta
          name="description"
          content="Meniul zilei în Vatra Dornei la PanAghia Autoservire & Delivery: mâncare gătită zilnic, ciorbe, feluri principale, garnituri și livrare la domiciliu."
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
            Meniul Zilei în Vatra Dornei
          </h1>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            La PanAghia Autoservire & Delivery pregătim zilnic mâncare gătită,
            proaspătă și sățioasă, potrivită pentru prânz, comandă la pachet sau
            livrare în Vatra Dornei.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            Dacă ești în căutarea unui <strong>meniu al zilei în Vatra Dornei</strong>,
            PanAghia îți oferă variante gustoase de mâncare gătită ca acasă:
            ciorbe, feluri principale, garnituri și preparate tradiționale.
          </p>

          <p>
            Meniul nostru este potrivit pentru cei care vor o masă caldă la prânz,
            pentru angajați, turiști, familii sau persoane care preferă mâncarea
            gătită, proaspătă și servită rapid.
          </p>

          <p>
            Poți servi masa la autoservire, poți comanda la pachet sau poți verifica
            opțiunile disponibile pentru livrare în Vatra Dornei.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Link
              to="/meniu"
              className="bg-[#D4A847] text-white px-6 py-3 rounded-lg font-semibold text-center"
            >
              Vezi meniul disponibil
            </Link>

            <Link
              to="/contact"
              className="border border-[#D4A847] text-[#D4A847] px-6 py-3 rounded-lg font-semibold text-center"
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