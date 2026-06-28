import React from "react";
import LatestNewsSection from "../components/blog/LatestNewsSection";
import ContentRichHome from "../components/sections/ContentRichHome";
import useSEO from "../hooks/useSEO";

const Home = () => {
  useSEO({
    title: "A Plus Academy | Home Tutors, Career Roadmaps, PTE Practice and Student Guidance",
    description:
      "Find home and online tutors in Pakistan, explore class-wise academic guidance, career roadmaps, PTE practice, exam help, and trusted teacher support for parents and students.",
    canonical: "https://www.aplusacademy.pk/",
  });

  return (
    <>
      <ContentRichHome />
      <LatestNewsSection />
    </>
  );
};

export default Home;
