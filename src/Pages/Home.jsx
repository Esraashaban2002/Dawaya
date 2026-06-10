// src/pages/Home/Home.jsx
import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../Components/Home/HeroSection';
import StatsSection from '../components/Home/StatsSection';
import ServicesSection from '../components/Home/ServicesSection';
import HowItWorksSection from '../components/Home/HowItWorksSection';
import ProductsSection from '../components/Home/ProductsSection';
import PharmacyLogosSection from '../components/Home/PharmacyLogosSection';
import AppPromotionSection from '../components/Home/AppPromotionSection';
import FeaturesSection from '../components/Home/FeaturesSection';
// import TestimonialsSection from '../components/Home/TestimonialsSection';
import FAQSection from '../components/Home/FAQSection';
// import CTASection from '../components/Home/CTASection';

const Home = () => {
  return (
    <motion.main

      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-hidden"
    >
      <div style={{direction: "ltr"}}>
      <HeroSection />
      <StatsSection />
      {/* <ServicesSection /> */}
      <ProductsSection />
      <HowItWorksSection />
      
      <PharmacyLogosSection />
      <AppPromotionSection />
      {/* <FeaturesSection /> */}
       <ServicesSection />
      {/* <TestimonialsSection /> */}
     
      <FAQSection />
      {/* <CTASection /> */}
      </div>
    </motion.main>
  );
};

export default Home;