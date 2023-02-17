import AboutComponent from "../components/page/AboutComponent";
import ContactInfoComponent from "../components/page/ContactInfoComponent";
import FeaturesComponent from "../components/page/FeaturesComponent";
import HeroArea from "../components/page/HeroArea";
import ServicesComponent from "../components/page/ServicesComponent";
import WorkingProcessComponent from "../components/page/WorkingProcessComponent";

export default function home() {
  return (
    <>
      <HeroArea />
      <ContactInfoComponent />
      <AboutComponent />
      <ServicesComponent />
      <WorkingProcessComponent />
      <FeaturesComponent />
    </>
  );
}
