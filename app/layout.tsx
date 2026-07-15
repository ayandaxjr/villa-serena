import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.villaserena.nl"),
  title: "Villa Serena - Estate for 14 | Umbria-Tuscany, Italy",
  description:
    "A working Italian estate between Rome and Florence. Three homes, fourteen guests, own olive groves and vineyard. Available May through September.",
  keywords: [
    "large villa Italy group rental",
    "villa 14 persons Italy",
    "large group villa Umbria",
    "estate rental Tuscany Umbria",
    "vakantievilla groot gezelschap Italië",
    "villa huren Umbrië grote groep",
    "landgoed Italië huren",
  ],
  openGraph: {
    title: "Villa Serena - A Private Italian Estate",
    description:
      "A working Italian estate between Rome and Florence. Three homes, fourteen guests, own olive groves and vineyard.",
    type: "website",
    locale: "en_US",
    url: "https://www.villaserena.nl",
    siteName: "Villa Serena",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Villa Serena at golden hour - a private Italian estate in Umbria",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Villa Serena - A Private Italian Estate",
    description:
      "A working Italian estate between Rome and Florence. Three homes, fourteen guests, own olive groves and vineyard.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth site-loading">
      <head>
        {/* Reset scroll before paint — prevents reload opening at page footer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{history.scrollRestoration='manual'}catch(e){}var d=document.documentElement,b=document.body;d.classList.add('site-loading');window.scrollTo(0,0);d.scrollTop=0;if(b){b.scrollTop=0}if(location.hash){history.replaceState(null,'',location.pathname+location.search)}window.addEventListener('pageshow',function(e){if(e.persisted){window.scrollTo(0,0);d.scrollTop=0;if(b){b.scrollTop=0}}})})();`,
          }}
        />
        {/* Structured Data — LodgingBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              name: "Villa Serena",
              description:
                "A working Italian estate between Rome and Florence. Three homes, fourteen guests, own olive groves and vineyard.",
              url: "https://www.villaserena.nl",
              // REPLACE: Add actual address
              address: {
                "@type": "PostalAddress",
                addressCountry: "IT",
                addressRegion: "Umbria",
              },
              numberOfRooms: 3,
              petsAllowed: false,
              amenityFeature: [
                { "@type": "LocationFeatureSpecification", name: "Swimming Pool" },
                { "@type": "LocationFeatureSpecification", name: "Vineyard" },
                { "@type": "LocationFeatureSpecification", name: "Olive Groves" },
                { "@type": "LocationFeatureSpecification", name: "Private Parking" },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
