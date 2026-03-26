import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutRotary from '@/components/AboutRotary';
import AboutClub from '@/components/AboutClub';
import CharterStory from '@/components/CharterStory';
import ServiceAreas from '@/components/ServiceAreas';
import RotaryFamily from '@/components/RotaryFamily';
import JoinSection from '@/components/JoinSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutRotary />
        <AboutClub />
        <CharterStory />
        <ServiceAreas />
        <RotaryFamily />
        <JoinSection />
      </main>
      <Footer />
    </>
  );
}
