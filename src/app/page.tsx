import type { Metadata } from 'next';
import Hero from '@/components/Hero';

export const metadata: Metadata = {
  title: 'Rotary Club of Northlands Bustani — Service Above Self',
  description:
    'A professional service organisation chartered 23 March 2026 in Northlands, Kenya. District 9212. Meetings every Thursday at 7:00 PM, Bedarin Hotel, Bypass.',
  openGraph: {
    title: 'Rotary Club of Northlands Bustani',
    description: 'Service Above Self — District 9212, Kenya. Chartered 23 March 2026.',
    type: 'website',
  },
};
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
