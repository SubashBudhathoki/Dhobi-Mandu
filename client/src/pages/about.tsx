import React from "react";
import AboutComponent from "../components/page/AboutComponent";
import FeaturesComponent from "../components/page/FeaturesComponent";
import WorkingProcessComponent from "../components/page/WorkingProcessComponent";
import PageHeader from "../partials/PageHeader";

export default function About() {
  return (
    <>
      <PageHeader title="About Us" />
      <AboutComponent />
      <WorkingProcessComponent />
      <FeaturesComponent />
    </>
  );
}
