import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PharmacyLogosSection = () => {
  const [pharmacy, setPharmacy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dawaya-back-end.vercel.app/api/pharmacies')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.success) setPharmacy(data.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="pharmacies-section" className="py-16 bg-gray-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">شركاؤنا</h2>
          <p className="mt-2 text-gray-600">أكثر من 500 صيدلية تثق بنا</p>
        </motion.div>

        <div className="mt-12 relative overflow-hidden">
          <div className="flex gap-6 animate-marquee whitespace-nowrap">
            {pharmacy.map((logo, index) => (
              <a
                key={`${logo.name}-${index}`}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block group"
              >
                <div className="w-32 h-20 md:w-40 md:h-24 flex items-center justify-center p-4 bg-white rounded-xl shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain transition-all duration-500 transform group-hover:scale-110"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .animate-marquee {
            gap: 1rem;
            animation-duration: 20s;
          }
        }
      `}</style>
    </section>
  );
};

export default PharmacyLogosSection;