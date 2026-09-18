// ---------------------------------------------------------------------------
// Single source of truth for all copy and project data shown on the site.
// Sourced from Conor McGrath's resume (docs/Conor McGrath BA Hons.pdf).
// Images are placeholders until real screenshots/assets are supplied —
// swap the `image` fields below when assets are ready.
//
// Per the spec's Ask-First boundary: no phone number and no referee names
// are published anywhere in the UI.
// ---------------------------------------------------------------------------

export type NavItem = {
  id: "hero" | "about" | "projects" | "contact";
  label: string;
};

export type ContactLink = {
  label: string;
  href: string;
  type: "email" | "linkedin" | "website";
  hud: string;
};

export type Client = {
  name: string;
  logo: string;
};

export type Project = {
  slug: string;
  name: string;
  description: string;
  platforms: string[];
  status: string;
  tags: string[];
  /** Placeholder image path — replace with a real screenshot when available. */
  image: string;
  /** Optional live URL (app store, website, repo). Omit if there's nothing to link to yet. */
  link?: string;
};

export type SiteContent = {
  profile: {
    name: string;
    credential: string;
    role: string;
    tagline: string;
    location: string;
    website: string;
  };
  bio: {
    lead: string;
    paragraphs: string[];
    highlights: string[];
  };
  clients: Client[];
  projects: Project[];
  contact: {
    heading: string;
    body: string;
    links: ContactLink[];
  };
  nav: NavItem[];
};

export const site: SiteContent = {
  profile: {
    name: "Conor McGrath",
    credential: "BA Hons",
    role: "Lead Software Developer",
    tagline: "I build user interfaces and systems that people enjoy to use, developers enjoy to maintain, and teams can ship quickly.",
    location: "Dublin, Ireland",
    website: "conor-ui.com",
  },
  bio: {
    lead: "I'm a Lead Software Developer with 15+ years shipping production front-end and full-stack systems, several of those as an independent contractor across consultancies and enterprise teams where reliability mattered as much as speed.",
    paragraphs: [
      "I've worked across consultancies and in-house engineering teams, with Nearform, Aer Lingus, EY (Ernst & Young), Virgin Media O2, BAE Systems (Applied Intelligence Labs), Renalytix, Aventus/Homelyfe, cube19,  plus a government finance engagement in Saudi Arabia. That's taken me through fintech, telecoms, aviation, healthtech, and public-sector work.",
      "What ties it together is depth across the stack: React and React Native on the front end, Node and Python on the back end. I'm hands-on as both developer and tech lead, owning architecture decisions and staying in the code, not just directing from above.",
      "Outside of client work, I build and ship my own products end-to-end, from idea to app store.",
    ],
    highlights: ["React / React Native", "Node.js / Python", "Design", "Data Visualization", "Agentic AI's"],
  },
  clients: [
    {
      name: "Nearform",
      logo: "/clients/nearform.svg",
    },
    {
      name: "BAE Systems",
      logo: "/clients/bae.svg",
    },
    {
      name: "Virgin Media / O2",
      logo: "/clients/vmo2.png",
    },
    {
      name: "Aer Lingus",
      logo: "/clients/aerlingus.png",
    },
    {
      name: "EY",
      logo: "/clients/EY.png",
    },
  ],
  projects: [
    {
      slug: "fior-bia",
      name: "Fíor Bia",
      description:
        "A food barcode scanner app for iOS and Android that helps people understand how their food is really made. Scan a product to see how processed its ingredients are.",
      platforms: ["iOS", "Android"],
      status: "Live",
      tags: ["React Native"],
      image: "/projects/fior-bia.png",
      link: "https://www.fiorbia.com/",
    },
    {
      slug: "one-ocean-network",
      name: "One Ocean Network",
      description: "A mobile app for real-time ocean and coastline weather with a social layer for sharing conditions and reports. No AI was used in the making of these apps.",
      platforms: ["iOS", "Android"],
      status: "Live",
      tags: ["React Native"],
      image: "/projects/one-ocean-network.png",
      link: "https://www.one-ocean-network.com/",
    },
    {
      slug: "seamless-slideshow",
      name: "Seamless Slideshow",
      description: "A generative ai, web app experiment. Read more about it in the blog post.",
      platforms: ["Web"],
      status: "Live",
      tags: ["Next.js", "Python", "Stripe"],
      image: "/projects/seamless-slideshow.png",
      link: "/blog/building-seamless-slideshow",
    },
  ],
  contact: {
    heading: "Get in touch",
    body: "Open to new contract engagements and interesting product ideas. The fastest way to reach me is email or LinkedIn.",
    links: [
      {
        label: "conor@conor-ui.com",
        href: "mailto:conor@conor-ui.com",
        type: "email",
        hud: "EMAIL",
      },
      {
        label: "linkedin.com/in/conor-ui",
        href: "https://linkedin.com/in/conor-ui",
        type: "linkedin",
        hud: "LINKEDIN",
      },
      {
        label: "conor-ui.com",
        href: "https://conor-ui.com",
        type: "website",
        hud: "WEB",
      },
    ],
  },
  nav: [
    {
      id: "hero",
      label: "Home",
    },
    {
      id: "about",
      label: "About",
    },
    {
      id: "projects",
      label: "Projects",
    },
    {
      id: "contact",
      label: "Contact",
    },
  ],
};
