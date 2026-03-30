import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import Navbar from "@/components/Navbar";
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
  title: "Rotary Club of Northlands Bustani",
  description:
    "A professional service organisation chartered 23 March 2026 in Northlands, Kenya. District 9212. Service Above Self.",
  openGraph: {
    title: "Rotary Club of Northlands Bustani",
    description: "Service Above Self — District 9212, Kenya",
    type: "website",
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
    >
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <a
          href="#main-content"
          style={{
            position: 'absolute', top: '-100%', left: '1rem', zIndex: 200,
            padding: '0.75rem 1.5rem',
            background: 'var(--blue-mid)', color: '#ffffff',
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontSize: '0.875rem', letterSpacing: '0.1em', textDecoration: 'none',
            transition: 'top 0.2s',
          }}
          onFocus={(e) => { e.currentTarget.style.top = '1rem'; }}
          onBlur={(e) => { e.currentTarget.style.top = '-100%'; }}
        >
          Skip to main content
        </a>
        <Navbar />
        <div id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
