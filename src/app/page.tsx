import Hero from '@/components/Hero';
import AboutRotary from '@/components/AboutRotary';
import AboutClub from '@/components/AboutClub';
import CharterStory from '@/components/CharterStory';
import ServiceAreas from '@/components/ServiceAreas';
import RotaryFamily from '@/components/RotaryFamily';
import MeetingInfo from '@/components/MeetingInfo';
import JoinSection from '@/components/JoinSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutRotary />
      <AboutClub />
      <CharterStory />
      <ServiceAreas />
      <RotaryFamily />
      <MeetingInfo />
      <JoinSection />
    </main>
  );
}
