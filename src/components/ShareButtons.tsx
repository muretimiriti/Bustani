const fbIcon = '/images/fb.png';
const tiktokIcon = '/images/tiktok.png';
const whatsappIcon = '/images/whatsapp.png';
const igIcon = '/images/ig.jpeg';

interface ShareButtonsProps {
  title: string;
  description: string;
  url?: string;
}

export default function ShareButtons({ title, description, url = typeof window !== 'undefined' ? window.location.href : '' }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: '#000',
    },
    {
      name: 'Facebook',
      icon: fbIcon,
      isImage: true,
      url: `https://web.facebook.com/profile.php?id=61585717761431`,
      color: '#1877F2',
    },
    {
      name: 'WhatsApp',
      icon: whatsappIcon,
      isImage: true,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25D366',
    },
    {
      name: 'Instagram',
      icon: igIcon,
      isImage: true,
      url: `https://www.instagram.com/rotaryclubofnorthlandsbustani/`,
      color: '#E4405F',
    },
    {
      name: 'TikTok',
      icon: tiktokIcon,
      isImage: true,
      url: `https://www.tiktok.com/@rcnorthlandsbustani`,
      color: '#000',
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: '#0A66C2',
    },
    {
      name: 'Email',
      icon: '✉️',
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
      color: '#EA4335',
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #eee',
      }}
    >
      <span
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
          color: '#999',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          marginRight: '0.5rem',
        }}
      >
        Share:
      </span>
      {shareLinks.map((share) => (
        <a
          key={share.name}
          href={share.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${share.name}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: share.color,
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 700,
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
          }}
        >
          {share.isImage ? (
            <img
              src={share.icon as string}
              alt={share.name}
              style={{ width: '20px', height: '20px', objectFit: 'contain' }}
            />
          ) : (
            share.icon
          )}
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        title="Copy link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#CCC',
          color: '#fff',
          fontSize: '0.9rem',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
        }}
      >
        🔗
      </button>
    </div>
  );
}
