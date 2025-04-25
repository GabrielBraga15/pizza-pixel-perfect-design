
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedMenu from '@/components/FeaturedMenu';
import AboutSection from '@/components/AboutSection';
import OrderSection from '@/components/OrderSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedMenu />
      <AboutSection />
      <OrderSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
