import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '../Components/Home/HeroSection';
import StatsSection from '../Components/Home/StatsSection';
import ServicesSection from '../Components/Home/ServicesSection';
import HowItWorksSection from '../Components/Home/HowItWorksSection';
import ProductsSection from '../Components/Home/ProductsSection';
import PharmacyLogosSection from '../Components/Home/PharmacyLogosSection';
import AppPromotionSection from '../Components/Home/AppPromotionSection';
import FeaturesSection from '../Components/Home/FeaturesSection';
import FAQSection from '../Components/Home/FAQSection';

const Home = () => {
  const { hash } = useLocation();

  useEffect(() => {
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const token = getCookie('token');
  if (token) {
    localStorage.setItem('token', token);
    document.cookie = 'token=; Max-Age=0; path=/';

    fetch("https://dawaya-back-end.vercel.app/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
      });
  }
}, []);

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash]);

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
      {}
      <ProductsSection />
      <HowItWorksSection />
      
      <PharmacyLogosSection />
      <AppPromotionSection />
      {}
       <ServicesSection />
      {}
     
      <FAQSection />
      {}
      </div>
    </motion.main>
  );
};

export default Home;
