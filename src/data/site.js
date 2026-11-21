// Site-wide details. Anything left empty ('') is hidden on the live site or
// replaced by a "coming soon" message, so the site never shows a broken button.
// Run `npm run check` to see which values are still empty. See HANDOFF.md.
export const site = {
  name: 'BIFOSS',
  tagline: 'Bearys ICB free open source society',
  description:
    'BIFOSS is a student-run free and open source society in Mangaluru, India. Learn, build and contribute together.',
  email: '', // club email address
  address: '', // college name and address
  domain: '', // real domain (also update public/CNAME)
  joinUrl: '', // link to the join form (Google Form, Tally or similar)
  social: [
    // Leave url empty to hide an item.
    { label: 'GitHub', url: '' },
    { label: 'Instagram', url: '' },
    { label: 'LinkedIn', url: '' },
    { label: 'Discord', url: '' },
  ],
}
