import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const UndeSeManancaBineVatraDornei = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>Unde se mănâncă bine în Vatra Dornei | PanAghia</title>
        <meta
          name="description"
          content="Cauți unde se mănâncă bine în Vatra Dornei? PanAghia Autoservire & Delivery oferă mâncare gătită, meniul zilei, preparate tradiționale și livrare."
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
            La PanAghia Autoservire & Delivery găsești mâncare gătită zilnic,
            meniul zilei, preparate tradiționale și opțiuni pentru servire la
            autoservire, la pachet sau prin livrare.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            Dacă ești localnic, turist sau ești doar în trecere și cauți{" "}
            <strong>unde se mănâncă bine în Vatra Dornei</strong>, PanAghia este
            o alegere potrivită pentru o masă caldă, gustoasă și sățioasă.
          </p>

          <p>
            Pregătim zilnic mâncare gătită, ciorbe, feluri principale,
            garnituri și preparate potrivite pentru prânz. Meniul este gândit
            pentru cei care vor mâncare bună, servire rapidă și gust apropiat de
            mâncarea de acasă.
          </p>

          <p>
            PanAghia se adresează celor care caută o autoservire în Vatra
            Dornei, meniul zilei, mâncare la pachet, livrare sau catering pentru
            evenimente mici.
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
              Meniul zilei
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UndeSeManancaBineVatraDornei;