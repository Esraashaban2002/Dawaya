// src/pages/Home/Home.jsx
import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../Components/Home/HeroSection';
import StatsSection from '../Components/Home/StatsSection';
import ServicesSection from '../Components/Home/ServicesSection';
import HowItWorksSection from '../Components/Home/HowItWorksSection';
import ProductsSection from '../Components/Home/ProductsSection';
import PharmacyLogosSection from '../Components/Home/PharmacyLogosSection';
import AppPromotionSection from '../Components/Home/AppPromotionSection';
import FeaturesSection from '../Components/Home/FeaturesSection';
// import TestimonialsSection from '../components/Home/TestimonialsSection';
import FAQSection from '../Components/Home/FAQSection';
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
