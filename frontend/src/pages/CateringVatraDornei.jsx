import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const CateringVatraDornei = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>Catering Vatra Dornei | PanAghia Autoservire & Delivery</title>
        <meta
          name="description"
          content="Catering în Vatra Dornei pentru parastase, pomeni, aniversări, mese festive și evenimente mici. PanAghia oferă mâncare gătită, platouri și meniuri adaptate."
        />
        <link
          rel="canonical"
          href="https://www.panaghiaautoservirevatradornei.ro/catering-vatra-dornei"
        />
      </Helmet>

      <section className="bg-[#D4A847] py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Catering în Vatra Dornei
          </h1>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            PanAghia Autoservire & Delivery pregătește mâncare gătită și meniuri
            pentru evenimente mici, mese de familie, parastase, pomeni,
            aniversări și ocazii speciale în Vatra Dornei.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            Dacă ai nevoie de <strong>catering în Vatra Dornei</strong>,
            PanAghia te poate ajuta cu preparate gătite, meniuri complete,
            platouri și soluții potrivite pentru evenimente restrânse sau mese
            organizate în familie.
          </p>

          <p>
            Pregătim mâncare gustoasă și sățioasă, potrivită pentru parastase,
            pomeni, cumătrii, aniversări, întâlniri de familie sau alte
            evenimente unde este nevoie de mâncare proaspătă și bine organizată.
          </p>

          <p>
            Pentru detalii despre meniuri, prețuri și disponibilitate, ne poți
            contacta telefonic sau prin pagina de contact.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="bg-[#D4A847] text-white px-6 py-3 rounded-lg font-semibold text-center"
            >
              Cere ofertă catering
            </Link>

            <Link
              to="/meniu"
              className="border border-[#D4A847] text-[#D4A847] px-6 py-3 rounded-lg font-semibold text-center"
            >
              Vezi meniul
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CateringVatraDornei;