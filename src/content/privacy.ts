export const privacy = {
  updated: "2026-09-07",
  intro:
    "This is a personal site. It has no accounts, no forms, no comments, and nothing to sell. Here is what it does and does not collect.",
  sections: [
    {
      title: "Analytics",
      body:
        "The site uses Vercel Web Analytics and Vercel Speed Insights to count page views and measure load performance. Both are cookieless. Visitors are identified by a hash derived from the request that resets daily, so the data cannot be tied to a person, an IP address, or a browsing session on another site. Vercel discards a visitor session after 24 hours.",
    },
    {
      title: "Cookies and local storage",
      body:
        "No cookies are set. The one thing stored in your browser is a single localStorage entry recording whether you chose the light or dark theme. It never leaves your device.",
    },
    {
      title: "Hosting",
      body:
        "The site is served by Vercel, which handles requests under its own privacy policy. Standard server request logs may include your IP address for the time Vercel keeps them.",
    },
    {
      title: "External links",
      body:
        "Links to GitHub, LinkedIn, X, publication venues, and event pages take you to sites governed by their own policies. Opening or downloading the resume PDF is a plain file request and records nothing beyond the analytics above.",
    },
    {
      title: "Contact",
      body:
        "Emailing the address on this site sends a normal email. Questions about this page can go to the same address.",
    },
  ],
} as const;
