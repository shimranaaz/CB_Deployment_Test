import React from 'react';
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Services from '../components/home/Services';
import Testamonilas from '../components/home/Testamonials';
import Pricing from '../components/home/Pricing';
import FAQ from '../components/home/FAQ';
import Templates from './Templates'; 
import Footer from '../components/home/Footer';
import Avatar from '../components/home/Avatar';
import Features from '../components/home/Features';
import ResumeBanner from '../components/home/ResumeBanner';
import Companies from './Companies';

const Home: React.FC = () => {
  return (
    <div>
    <Navbar/>
      <Hero />
      <About />
      <Features/>
      <Companies />
      <Templates />
      <Services />
      <Testamonilas/>
      <Avatar/>
      <Pricing/>
      <FAQ/>
      <ResumeBanner/>
      <Footer />
    </div>
  );
};

export default Home;