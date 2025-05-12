
import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import CategorySection from '../components/home/CategorySection';
import PromotionsSection from '../components/home/PromotionsSection';
import StatsSection from '../components/home/StatsSection';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <CategorySection />
        <PromotionsSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
