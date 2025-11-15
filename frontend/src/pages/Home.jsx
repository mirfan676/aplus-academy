import React from "react";
import useSEO from "../hooks/useSEO";  // <-- REQUIRED IMPORT

import HeroSection from "../components/sections/HeroSection";
import AdvantagesSection from "../components/sections/AdvantagesSection";
import StepsSection from "../components/sections/StepsSection";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import AreasWeCover from "../components/sections/AreasWeCover";
import FAQSection from "../components/sections/FAQSection";
import FooterCTA from "../components/sections/FooterCTA";

const Home = () => {

  useSEO({
    title: "A Plus Home Tutors — Trusted Home & Online Tuition in Pakistan",
    description:
      "Pakistan’s trusted platform for home and online tuition — connecting students with expert tutors for O/A Levels, Matric, and Quran classes.",
    canonical: "https://www.aplusacademy.pk/",
  });

  return (
    <>
      <HeroSection />
      <AdvantagesSection />
      <StepsSection />
      <WhyChooseUs />
      <AreasWeCover />
      <FAQSection />
      <FooterCTA />
    </>
  );
};

export default Home;
