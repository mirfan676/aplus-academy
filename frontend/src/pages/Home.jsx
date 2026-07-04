import React from "react";
import RestoredHomeExperience from "../components/sections/RestoredHomeExperience";
import useSEO from "../hooks/useSEO";

const Home = () => {
  useSEO({
    title: "A Plus Academy Pakistan | Home Tutors, Career Roadmaps and PTE Practice",
    description:
      "Find home and online tutors in Pakistan, explore class-wise academic guidance, career roadmaps, PTE practice, exam help, and trusted teacher support for parents and students.",
    canonical: "https://www.aplusacademy.pk/",
  });

  return (
    <RestoredHomeExperience />
  );
};

export default Home;
