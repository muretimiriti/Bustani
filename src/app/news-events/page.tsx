import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';
import FadeSlideshow from '@/components/FadeSlideshow';
import ShareButtons from '@/components/ShareButtons';

const API = import.meta.env.VITE_API_URL || '/api.php';

interface EventItem {
  id: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
  image_url?: string;
  images?: string[];
  created_at: string;
}

interface NewsItem {
  id: string;
  title: string;
  body: string;
  image_url?: string;
  images?: string[];
  created_at: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function NewsEventsPage() {
  const [data, setData] = useState({ events: [], news: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'events' | 'news'>('events');

  const fetchData = () => {
    setLoading(true);
    setError(null);

    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error(`API error: ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const items = data[tab] || [];

  // Get images array, handling both old and new format
  const getImages = (item: EventItem | NewsItem): string[] => {
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images;
    }
    if (item.image_url) {
      return [item.image_url];
    }
    return [];
  };

  return (
    <main style={{ paddingTop: '142px' }}>
      <PageHero
        eyebrow="Stay Connected"
        title="News & Events"
        subtitle="Meetings, milestones, and moments of fellowship from the Rotary Club of Northlands Bustani."
      />

      {/* error message */}
      {error && (
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fee2e2', padding: '2rem 1.5rem' }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', color: '#991b1b' }}>
            <p>⚠️ Error loading data: {error}</p>
            <button
              onClick={fetchData}
              style={{
                padding: '0.5rem 1rem',
                background: '#991b1b',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        </motion.section>
      )}

      {/* loading state */}
      {loading && !error && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ background: '#f6f7f9', padding: '3rem 1.5rem' }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: '#666' }}>Loading events and news...</p>
          </div>
        </motion.section>
      )}

      {/* content */}
      {!loading && !error && (
        <>
          {/* info section */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: 'var(--blue-ghost)', padding: '3rem 1.5rem' }}
          >
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <p
                style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: '0.7rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--blue-tint)',
                  margin: '0 0 0.5rem',
                }}
              >
                Updates
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  color: 'var(--blue-mid)',
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                {items.length} {tab === 'events' ? 'Upcoming Events' : 'News Articles'}
              </h2>
            </div>
          </motion.section>

          {/* tabs */}
          <section style={{ background: '#fff', borderBottom: '2px solid #eee', paddingTop: '2rem' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 1.5rem' }}>
              <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
                {(['events', 'news'] as const).map((t) => (
                  <motion.button
                    key={t}
                    onClick={() => setTab(t)}
                    whileHover={{ opacity: 0.8 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0.5rem 0',
                      fontSize: '1rem',
                      fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                      fontWeight: tab === t ? 700 : 400,
                      color: tab === t ? 'var(--blue-mid)' : '#999',
                      cursor: 'pointer',
                      borderBottom: tab === t ? '2px solid var(--gold-bright)' : 'none',
                      marginBottom: '-1px',
                      transition: 'color 0.2s',
                    }}
                  >
                    {t === 'events' ? '📅 Events' : '📰 News'} ({items.length})
                  </motion.button>
                ))}
                <motion.button
                  onClick={fetchData}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    opacity: loading ? 0.5 : 1,
                  }}
                  title="Refresh data"
                >
                  🔄
                </motion.button>
              </div>
            </div>
          </section>

          {/* empty state */}
          {items.length === 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: '4rem 1.5rem', background: '#f9fafb' }}
            >
              <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', color: '#999' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {tab === 'events' ? '📅' : '📰'}
                </div>
                <p style={{ fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif", fontSize: '0.95rem' }}>
                  No {tab} posted yet. Check back soon!
                </p>
              </div>
            </motion.section>
          )}

          {/* items grid */}
          {items.length > 0 && (
            <section style={{ padding: '3rem 1.5rem', background: '#f9fafb' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem',
                  }}
                >
                  {items.map((item: EventItem | NewsItem) => {
                    const images = getImages(item);
                    return (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        style={{
                          background: '#fff',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          boxShadow: '0 1px 3px rgba(0,0,0,.1)',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                        }}
                      >
                        {/* images */}
                        {images.length > 0 && (
                          <div
                            style={{
                              width: '100%',
                              height: '200px',
                              position: 'relative',
                              overflow: 'hidden',
                              background: '#f0f0f0',
                            }}
                          >
                            {images.length > 1 ? (
                              <FadeSlideshow images={images} interval={4000} />
                            ) : (
                              <motion.img
                                initial={{ scale: 1.05 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.8 }}
                                src={images[0]}
                                alt={item.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                              />
                            )}
                            {images.length > 1 && (
                              <div
                                style={{
                                  position: 'absolute',
                                  bottom: 8,
                                  right: 8,
                                  background: 'rgba(0,0,0,0.6)',
                                  color: '#fff',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                }}
                              >
                                {images.length} images
                              </div>
                            )}
                          </div>
                        )}

                        {/* content */}
                        <div
                          style={{
                            padding: '1.5rem',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {tab === 'events' && (
                            <>
                              {(item as EventItem).date && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.75rem',
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: '0.85rem',
                                      color: 'var(--blue-mid)',
                                      fontWeight: 700,
                                      fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                                    }}
                                  >
                                    📅{' '}
                                    {new Date((item as EventItem).date + 'T00:00:00').toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </motion.div>
                              )}
                              {(item as EventItem).location && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem',
                                    color: '#666',
                                    marginBottom: '0.75rem',
                                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                                  }}
                                >
                                  📍 {(item as EventItem).location}
                                </motion.div>
                              )}
                            </>
                          )}

                          {tab === 'news' && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              style={{
                                fontSize: '0.8rem',
                                color: '#999',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '0.75rem',
                                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                              }}
                            >
                              {new Date(item.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </motion.div>
                          )}

                          <h3
                            style={{
                              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              color: 'var(--blue-mid)',
                              margin: '0 0 0.75rem',
                              lineHeight: 1.3,
                            }}
                          >
                            {item.title}
                          </h3>

                          <p
                            style={{
                              fontSize: '0.95rem',
                              lineHeight: 1.6,
                              color: '#555',
                              margin: 0,
                              flex: 1,
                              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                            }}
                          >
                            {tab === 'events'
                              ? (item as EventItem).description || 'No description'
                              : (item as NewsItem).body || 'No content'}
                          </p>

                          {/* Share buttons */}
                          <ShareButtons
                            title={item.title}
                            description={
                              tab === 'events'
                                ? (item as EventItem).description || 'Check out this event'
                                : (item as NewsItem).body?.substring(0, 100) || 'Check out this news'
                            }
                            url={`${typeof window !== 'undefined' ? window.location.origin : 'https://rcnbustani.co.ke'}/news-events?item=${item.id}`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
