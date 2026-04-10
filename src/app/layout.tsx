import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import Navbar from "@/components/Navbar";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rcnbustani.co.ke"),
  title: {
    default: "Rotary Club of Northlands Bustani",
    template: "%s | Rotary Club of Northlands Bustani",
  },
  description:
    "A professional service organisation chartered 23 March 2026 in Northlands, Kenya. District 9212. We meet every Thursday at 7:00 PM, Bedarin Hotel, Bypass, Nairobi. Service Above Self.",
  keywords: [
    "Rotary Club Northlands",
    "Rotary Club Bustani",
    "Rotary Club Nairobi",
    "Rotary District 9212",
    "Rotary Kenya",
    "service club Northlands",
    "professional service organisation Kenya",
    "community service Nairobi",
  ],
  authors: [{ name: "Rotary Club of Northlands Bustani" }],
  creator: "Rotary Club of Northlands Bustani",
  openGraph: {
    title: "Rotary Club of Northlands Bustani",
    description: "Service Above Self — District 9212, Kenya. Chartered 23 March 2026.",
    type: "website",
    url: "https://www.rcnbustani.co.ke",
    siteName: "Rotary Club of Northlands Bustani",
    locale: "en_KE",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rotary Club of Northlands Bustani — Service Above Self",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotary Club of Northlands Bustani",
    description: "Service Above Self — District 9212, Kenya. Chartered 23 March 2026.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://www.rcnbustani.co.ke",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jost.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Rotary Club of Northlands Bustani",
              alternateName: "RC Northlands Bustani",
              url: "https://www.rcnbustani.co.ke",
              logo: "https://www.rcnbustani.co.ke/icon.png",
              foundingDate: "2026-03-23",
              description:
                "A professional service organisation chartered 23 March 2026 in Northlands, Kenya. Member of Rotary International District 9212. Guided by the principles of Service Above Self, Bustani, and Ubuntu.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressCountry: "KE",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+254794607020",
                contactType: "general enquiries",
                email: "info@rcnbustani.co.ke",
                areaServed: "KE",
                availableLanguage: "English",
              },
              location: {
                "@type": "Place",
                name: "Bedarin Hotel, Bypass",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Nairobi",
                  addressCountry: "KE",
                },
              },
              event: {
                "@type": "Event",
                name: "Weekly Club Meeting",
                description: "Regular weekly fellowship and business meeting of the Rotary Club of Northlands Bustani.",
                eventSchedule: {
                  "@type": "Schedule",
                  repeatFrequency: "P1W",
                  byDay: "https://schema.org/Thursday",
                  startTime: "19:00",
                },
                location: {
                  "@type": "Place",
                  name: "Bedarin Hotel, Bypass, Nairobi",
                },
              },
              memberOf: {
                "@type": "Organization",
                name: "Rotary International",
                url: "https://www.rotary.org",
              },
              sameAs: [
                "https://www.instagram.com/rotaryclubofnorthlandsbustani/",
                "https://web.facebook.com/profile.php?id=61585717761431",
                "https://www.tiktok.com/@rcnorthlandsbustani",
              ],
            }),
          }}
        />
        <Navbar />
        <Breadcrumb />
        {children}
        <Footer />
      </body>
    </html>
  );
}
