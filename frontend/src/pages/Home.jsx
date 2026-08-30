import React from "react";
import RestoredHomeExperience from "../components/sections/RestoredHomeExperience";
import useSEO from "../hooks/useSEO";

const Home = () => {
  useSEO({
    title: "Online Academy in Pakistan & Home Tutors | A Plus Academy",
    description:
      "Online academy in Pakistan for verified home tutors, online classes, language courses, Quran teachers, O Level, A Level, IELTS, and PTE support.",
    canonical: "https://www.aplusacademy.pk/",
    ogUrl: "https://www.aplusacademy.pk/",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: "Online Academy in Pakistan & Home Tutors | A Plus Academy",
          url: "https://www.aplusacademy.pk/",
          description:
            "Online academy in Pakistan for verified home tutors, online classes, language courses, Quran teachers, O Level, A Level, IELTS, and PTE support.",
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
        {
          "@type": "WebSite",
          name: "A Plus Academy",
          url: "https://www.aplusacademy.pk/",
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.aplusacademy.pk/",
            },
          ],
        },
      ],
    },
  });

  return (
    <RestoredHomeExperience />
  );
};

export default Home;
