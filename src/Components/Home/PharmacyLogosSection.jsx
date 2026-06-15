// src/components/PharmacyLogosSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { pharmacyLogos } from '../../data/pharmacyLogos';

const PharmacyLogosSection = () => {
  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...pharmacyLogos, ...pharmacyLogos, ...pharmacyLogos];

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
            {duplicatedLogos.map((logo, index) => (
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
                    className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
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