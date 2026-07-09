import React from "react";
import RestoredHomeExperience from "../components/sections/RestoredHomeExperience";
import useSEO from "../hooks/useSEO";

const Home = () => {
  useSEO({
    title: "Home Tutors in Pakistan | A Plus Academy",
    description:
      "Find verified home and online tutors in Pakistan for school subjects, O Level, A Level, Quran, languages, PTE practice, and academic guidance for students and parents.",
    canonical: "https://www.aplusacademy.pk/",
    ogUrl: "https://www.aplusacademy.pk/",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Home Tutors in Pakistan | A Plus Academy",
      url: "https://www.aplusacademy.pk/",
      description:
        "Find verified home and online tutors in Pakistan for school subjects, O Level, A Level, Quran, languages, PTE practice, and academic guidance for students and parents.",
      isPartOf: {
        "@type": "WebSite",
        name: "A Plus Academy",
        url: "https://www.aplusacademy.pk/",
      },
      about: {
        "@type": "Thing",
        name: "Home and online tutoring in Pakistan",
      },
    },
  });

  return (
    <RestoredHomeExperience />
  );
};

export default Home;
