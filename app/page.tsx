import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import MenuBanner from "@/components/MenuBanner";
import Experiences from "@/components/Experiences";
import Quote from "@/components/Quote";
import About from "@/components/About";
import Process from "@/components/Process";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <MenuBanner />
      <Experiences />
      <Quote />
      <About />
      <Process />
      <Contact />
    </main>
  );
}
