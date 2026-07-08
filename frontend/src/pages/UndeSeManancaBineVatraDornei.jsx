import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const UndeSeManancaBineVatraDornei = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>Unde se mănâncă bine în Vatra Dornei? | PanAghia</title>

        <meta
          name="description"
          content="Cauți unde se mănâncă bine în Vatra Dornei? Descoperă PanAghia: mâncare gătită zilnic, meniul zilei, ciorbe, feluri principale și preparate gustoase."
        />

        <link
          rel="canonical"
          href="https://www.panaghiaautoservirevatradornei.ro/unde-se-mananca-bine-in-vatra-dornei"
        />
      </Helmet>

      <section className="bg-[#D4A847] py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Unde se mănâncă bine în Vatra Dornei?
          </h1>

          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            Dacă îți dorești o masă caldă și gustoasă în Vatra Dornei,
            la PanAghia găsești mâncare gătită zilnic, meniul zilei,
            ciorbe, feluri principale și garnituri.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-7 text-gray-700 text-lg leading-relaxed">

          <p>
            Atunci când ești localnic, turist sau doar în trecere prin oraș,
            una dintre întrebările firești este:
            <strong> unde se mănâncă bine în Vatra Dornei?</strong>
            Dacă preferi mâncarea gătită și o masă caldă și sățioasă,
            PanAghia Autoservire & Delivery este o opțiune pe care o poți lua
            în considerare.
          </p>

          <p>
            La PanAghia pregătim mâncare gătită pentru cei care își doresc
            preparate potrivite pentru masa de prânz. În funcție de meniul
            disponibil în ziua respectivă, poți găsi ciorbe, feluri principale,
            garnituri și alte preparate.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Mâncare gătită în Vatra Dornei
          </h2>

          <p>
            Pentru mulți oameni, o masă bună înseamnă mâncare caldă, gustoasă
            și sățioasă. PanAghia se adresează celor care caută o alternativă
            la mâncarea de tip fast-food și preferă preparatele gătite.
          </p>

          <p>
            Poți veni pentru masa de prânz, poți alege mâncare la pachet sau
            poți verifica opțiunile disponibile pentru comandă și livrare.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Unde să mănânci la prânz în Vatra Dornei?
          </h2>

          <p>
            Dacă ești în oraș și cauți un loc pentru prânz, PanAghia oferă
            posibilitatea de a alege dintre preparatele disponibile în ziua
            respectivă. Conceptul de autoservire este potrivit atât pentru cei
            care au nevoie de o masă rapidă, cât și pentru familii sau turiști
            care vor să mănânce preparate gătite.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Ce poți găsi la PanAghia?
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>mâncare gătită zilnic;</li>
            <li>meniul zilei în Vatra Dornei;</li>
            <li>ciorbe și feluri principale;</li>
            <li>garnituri și preparate potrivite pentru prânz;</li>
            <li>mâncare la pachet;</li>
            <li>opțiuni de comandă și livrare.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900">
            PanAghia Autoservire & Delivery în Vatra Dornei
          </h2>

          <p>
            Ne găsești pe Strada Dornelor nr. 10, în Vatra Dornei.
            Pentru meniul disponibil, program și informații despre comenzi,
            poți consulta paginile dedicate ale site-ului sau ne poți contacta
            telefonic.
          </p>

          <p>
            Dacă te întrebi <strong>unde se mănâncă bine în Vatra Dornei</strong>
            și preferi mâncarea gătită, te invităm să descoperi preparatele
            disponibile la PanAghia.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">

            <Link
              to="/meniu"
              className="bg-[#D4A847] text-white px-6 py-3 rounded-lg font-semibold text-center"
            >
              Vezi meniul
            </Link>

            <Link
              to="/meniul-zilei-vatra-dornei"
              className="border border-[#D4A847] text-[#D4A847] px-6 py-3 rounded-lg font-semibold text-center"
            >
              Meniul zilei în Vatra Dornei
            </Link>

            <Link
              to="/contact"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold text-center"
            >
              Contact și locație
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
};

export default UndeSeManancaBineVatraDornei;