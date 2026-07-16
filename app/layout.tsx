import type { Metadata } from "next";
import "./globals.css";
import { siteMetadata, structuredDataJson } from "@/lib/seo";

export const metadata: Metadata = siteMetadata();

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataJson() }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
