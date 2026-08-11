import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { site } from "@/content/site";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const siteUrl = `https://${site.profile.website}`;
const title = `${site.profile.name} | ${site.profile.role}`;
const description = site.profile.tagline;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${site.profile.name}`,
  },
  description,
  keywords: [
    site.profile.name,
    site.profile.role,
    "front-end developer",
    "React developer",
    "React Native developer",
    "full-stack developer",
    "data visualization",
    "Dublin",
    "Ireland",
  ],
  authors: [{ name: site.profile.name, url: siteUrl }],
  creator: site.profile.name,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "profile",
    url: siteUrl,
    siteName: site.profile.name,
    title,
    description,
    locale: "en_IE",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.profile.name,
  jobTitle: site.profile.role,
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.profile.location,
    addressCountry: "IE",
  },
  sameAs: site.contact.links.filter((link) => link.type === "linkedin").map((link) => link.href),
  knowsAbout: site.bio.highlights,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
