import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const CateringVatraDornei = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>Catering Vatra Dornei | Evenimente și Mese | PanAghia</title>

        <meta
          name="description"
          content="Catering în Vatra Dornei pentru parastase, pomeni, aniversări, cumătrii, mese de familie și evenimente. Meniuri și mâncare gătită la PanAghia."
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
            PanAghia Autoservire & Delivery pregătește mâncare gătită,
            meniuri și preparate pentru parastase, pomeni, aniversări,
            cumătrii, mese de familie și evenimente în Vatra Dornei.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-7 text-gray-700 text-lg leading-relaxed">

          <p>
            Dacă ai nevoie de <strong>catering în Vatra Dornei</strong>,
            PanAghia îți oferă soluții pentru organizarea meselor la diferite
            tipuri de evenimente. Pregătim mâncare gătită, meniuri complete
            și preparate adaptate tipului de masă și numărului de persoane.
          </p>

          <p>
            Serviciile noastre se adresează familiilor, persoanelor și
            organizațiilor care au nevoie de mâncare pregătită pentru un
            eveniment, o masă de familie sau o ocazie specială.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Catering pentru parastase și pomeni în Vatra Dornei
          </h2>

          <p>
            Organizarea unei mese pentru un parastas sau o pomenire presupune
            atenție la multe detalii. PanAghia poate pregăti mâncare și meniuri
            potrivite pentru astfel de ocazii, în funcție de numărul de persoane
            și de preferințele stabilite la comandă.
          </p>

          <p>
            Putem discuta variante de meniu cu preparate de post sau de dulce,
            în funcție de perioada anului, ziua în care este organizată masa
            și cerințele clientului.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Mâncare pentru aniversări și mese de familie
          </h2>

          <p>
            Pentru aniversări, întâlniri de familie, cumătrii sau alte ocazii,
            pregătim preparate și meniuri care pot fi stabilite în funcție de
            specificul evenimentului.
          </p>

          <p>
            Dacă organizezi o masă și nu vrei să petreci timpul în bucătărie,
            poți discuta cu echipa PanAghia despre variantele disponibile,
            cantități și modul de pregătire a comenzii.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Ce tipuri de evenimente putem deservi?
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>parastase și pomeni;</li>
            <li>aniversări și zile de naștere;</li>
            <li>cumătrii și mese de familie;</li>
            <li>întâlniri și evenimente restrânse;</li>
            <li>mese organizate pentru grupuri;</li>
            <li>alte ocazii pentru care este nevoie de mâncare gătită.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900">
            Meniuri adaptate pentru evenimentul tău
          </h2>

          <p>
            Fiecare eveniment este diferit. De aceea, pentru informații despre
            preparate, meniuri, cantități, prețuri și disponibilitate,
            recomandăm discutarea directă a detaliilor înainte de comandă.
          </p>

          <p>
            În funcție de solicitare și disponibilitate, meniul poate include
            ciorbe, feluri principale, garnituri și alte preparate potrivite
            pentru tipul de masă organizată.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Catering și mâncare gătită în Vatra Dornei
          </h2>

          <p>
            PanAghia Autoservire & Delivery se află pe Strada Dornelor nr. 10,
            în Vatra Dornei. Pentru o ofertă adaptată evenimentului tău,
            contactează-ne și spune-ne tipul evenimentului, data și numărul
            aproximativ de persoane.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">

            <Link
              to="/contact"
              className="bg-[#D4A847] text-white px-6 py-3 rounded-lg font-semibold text-center"
            >
              Cere informații pentru catering
            </Link>

            <Link
              to="/meniu"
              className="border border-[#D4A847] text-[#D4A847] px-6 py-3 rounded-lg font-semibold text-center"
            >
              Vezi meniul
            </Link>

            <Link
              to="/meniul-zilei-vatra-dornei"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold text-center"
            >
              Meniul zilei în Vatra Dornei
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
};

export default CateringVatraDornei;