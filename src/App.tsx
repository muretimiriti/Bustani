import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import HomePage from '@/app/page';
import ContactPage from '@/app/contact/page';
import GalleryPage from '@/app/gallery/page';
import LeadershipPage from '@/app/leadership/page';
import MembershipPage from '@/app/membership/page';
import NewsEventsPage from '@/app/news-events/page';
import ProjectsPage from '@/app/projects/page';
import NotFoundPage from '@/app/not-found';
import '@/app/globals.css';

export default function App() {
  return (
    <>
      <Navbar />
      <Breadcrumb />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/leadership" element={<LeadershipPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/news-events" element={<NewsEventsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}
