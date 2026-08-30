import React from "react";
import HeroSection from "./HeroSection";
import AdvantagesSection from "./AdvantagesSection";
import WhyChooseUs from "./WhyChooseUs";
import AreasWeCover from "./AreasWeCover";
import LanguageCoursesShowcase from "./LanguageCoursesShowcase";
import FAQSection from "./FAQSection";
import FooterCTA from "./FooterCTA";
import LatestNewsSection from "../blog/LatestNewsSection";
import OnlineAcademyGuide from "./OnlineAcademyGuide";

export default function RestoredHomeExperience() {
  return (
    <>
      <HeroSection />
      <AdvantagesSection />
      <WhyChooseUs />
      <LanguageCoursesShowcase />
      <AreasWeCover />
      <OnlineAcademyGuide />

      <FAQSection />
      <LatestNewsSection />
      <FooterCTA />
    </>
  );
}
