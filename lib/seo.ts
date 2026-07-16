import type { Metadata } from "next";

export const SITE_URL = "https://www.villaserena.nl";
export const SITE_NAME = "Villa Serena";
export const OG_IMAGE = "/og-image.jpg";

const TITLE =
  "Villa Serena | Luxury Villa in Italy for Groups — Umbria & Tuscany";

const DESCRIPTION =
  "Rent Villa Serena — a private luxury villa in Umbria, Italy with pool, vineyard and olive groves. Three homes for up to 14 guests, between Rome and Florence. Available May through September.";

const KEYWORDS = [
  "Villa Serena",
  "villa in Italy",
  "luxury villa Italy",
  "villa rental Italy",
  "Italian villa rental",
  "Umbria villa rental",
  "Tuscany villa rental",
  "villa Umbria Tuscany",
  "large group villa Italy",
  "villa for 14 people Italy",
  "private estate Italy",
  "Italian estate rental",
  "villa with pool Italy",
  "villa with vineyard Italy",
  "holiday villa Italy",
  "villa between Rome and Florence",
  "Città della Pieve villa",
  "vakantievilla Italië",
  "villa huren Italië",
  "luxueuze villa Italië",
  "villa huren Umbrië",
  "grote groep villa Italië",
  "villa Toscane Umbria",
  "affitto villa Italia",
  "villa lusso Umbria",
];

export const SEO = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: KEYWORDS,
  ogTitle: "Villa Serena — Private Luxury Villa in Umbria, Italy",
  ogDescription:
    "A working Italian estate on the Umbria–Tuscany border. Three homes, pool, vineyard and olive groves — for up to 14 guests between Rome and Florence.",
  twitterDescription:
    "Private luxury villa in Umbria, Italy. Pool, vineyard, olive groves — room for 14 guests between Rome & Florence.",
  contactEmail: "info@villa-serena.nl",
  contactPhone: "+31 6 44833330",
  instagram: "https://instagram.com/villaserena",
  geo: {
    latitude: 43.0055,
    longitude: 12.349,
    placename: "Città della Pieve, Umbria, Italy",
    region: "IT-PG",
  },
} as const;

export function siteMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SEO.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: SEO.description,
    keywords: [...SEO.keywords],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Travel",
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      title: SEO.ogTitle,
      description: SEO.ogDescription,
      type: "website",
      locale: "en_US",
      alternateLocale: ["nl_NL", "it_IT"],
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Villa Serena — private luxury villa and estate in Umbria, Italy",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SEO.ogTitle,
      description: SEO.twitterDescription,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "geo.region": SEO.geo.region,
      "geo.placename": SEO.geo.placename,
      "geo.position": `${SEO.geo.latitude};${SEO.geo.longitude}`,
      ICBM: `${SEO.geo.latitude}, ${SEO.geo.longitude}`,
    },
  };
}

export function structuredDataJson(): string {
  const imageUrl = `${SITE_URL}${OG_IMAGE}`;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SEO.description,
        inLanguage: ["en", "nl", "it"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: imageUrl,
        email: SEO.contactEmail,
        telephone: SEO.contactPhone,
        sameAs: [SEO.instagram],
      },
      {
        "@type": "VacationRental",
        "@id": `${SITE_URL}/#vacation-rental`,
        name: SITE_NAME,
        alternateName: [
          "Villa Serena Umbria",
          "Villa Serena Italy",
          "Villa Serena estate",
        ],
        description: SEO.description,
        url: SITE_URL,
        image: [imageUrl],
        telephone: SEO.contactPhone,
        email: SEO.contactEmail,
        numberOfRooms: 3,
        occupancy: {
          "@type": "QuantitativeValue",
          maxValue: 14,
          unitText: "guests",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Città della Pieve",
          addressRegion: "Umbria",
          addressCountry: "IT",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SEO.geo.latitude,
          longitude: SEO.geo.longitude,
        },
        containedInPlace: {
          "@type": "Place",
          name: "Umbria–Tuscany border, Italy",
        },
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Swimming Pool", value: true },
          { "@type": "LocationFeatureSpecification", name: "Vineyard", value: true },
          { "@type": "LocationFeatureSpecification", name: "Olive Groves", value: true },
          { "@type": "LocationFeatureSpecification", name: "Private Parking", value: true },
          { "@type": "LocationFeatureSpecification", name: "Estate Wine Tasting", value: true },
        ],
        petsAllowed: false,
        availableLanguage: ["English", "Dutch", "Italian"],
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "LodgingBusiness",
        "@id": `${SITE_URL}/#lodging`,
        name: SITE_NAME,
        description: SEO.ogDescription,
        url: SITE_URL,
        image: imageUrl,
        telephone: SEO.contactPhone,
        email: SEO.contactEmail,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Città della Pieve",
          addressRegion: "Umbria",
          addressCountry: "IT",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SEO.geo.latitude,
          longitude: SEO.geo.longitude,
        },
        numberOfRooms: 3,
        petsAllowed: false,
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Swimming Pool" },
          { "@type": "LocationFeatureSpecification", name: "Vineyard" },
          { "@type": "LocationFeatureSpecification", name: "Olive Groves" },
          { "@type": "LocationFeatureSpecification", name: "Private Parking" },
        ],
      },
    ],
  });
}
