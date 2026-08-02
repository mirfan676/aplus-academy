import React from "react";
import RestoredHomeExperience from "../components/sections/RestoredHomeExperience";
import useSEO from "../hooks/useSEO";

const Home = () => {
  useSEO({
    title: "Home Tutors in Pakistan | A Plus Home Tutors",
    description:
      "Find verified home tutors, online tutors, female tutors, Quran tutors, IELTS tutors, and O Level or A Level tutors across Pakistan.",
    canonical: "https://www.aplusacademy.pk/",
    ogUrl: "https://www.aplusacademy.pk/",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: "Home Tutors in Pakistan | A Plus Home Tutors",
          url: "https://www.aplusacademy.pk/",
          description:
            "Find verified home tutors, online tutors, female tutors, Quran tutors, IELTS tutors, and O Level or A Level tutors across Pakistan.",
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
