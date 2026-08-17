/* =============================================================================
   content.js — THE ONLY FILE YOU NEED TO EDIT
   =============================================================================

   Everything a visitor reads lives in this file. The HTML and CSS read FROM
   this object, so changing a headline, swapping an article, adding a
   testimonial or updating the form endpoint means editing here and nothing
   else. Layout and styling never need touching.

   HOW TO EDIT SAFELY
   ------------------
   1. Text lives between the 'single quotes'. Replace the words, keep the quotes.
   2. If your text contains an apostrophe, escape it: 'Bea\'s work' — or use
      double quotes around the whole string: "Bea's work".
   3. Lists are wrapped in [ square brackets ]. Each { curly-brace block } is
      one item. Copy a whole block (including its trailing comma) to add another;
      delete a whole block to remove one.
   4. Keep every comma exactly where it is. A missing or extra comma is the one
      thing that will break the page.
   5. Save, then refresh the browser. If the page looks blank, open the browser
      console (F12) — it will name the line with the typo.

   Section keys are labelled below with the same [[TOKENS]] used in the brief,
   and README.md maps each key to the section it controls.
   ========================================================================== */

const CONTENT = {

  /* ---------------------------------------------------------------------------
     SEO & SOCIAL — browser tab, Google result, link previews
     Applied to <title>, meta description, Open Graph and Twitter card tags.
     ------------------------------------------------------------------------ */
  meta: {
    // Keep under ~60 characters so Google doesn't truncate it.
    title: 'Barira Saad — Registered Dietitian & Health Writer',

    // Keep under ~155 characters.
    description:
      'UK Registered Dietitian and freelance health writer. Evidence-based ' +
      'writing on adult and paediatric nutrition, with particular depth in ' +
      'paediatrics and culturally diverse audiences.',

    // Full https:// address of the live site, no trailing slash.
    siteUrl: 'https://barirasaad.com',

    // Shown when the link is shared on LinkedIn, WhatsApp, X, etc.
    // Replace assets/og-image.png with a real 1200x630 image when you have one.
    ogImage: 'assets/og-image.png',
    ogImageAlt: 'Barira Saad — Registered Dietitian and health writer',

    // Language and locale.
    lang: 'en-GB',
    locale: 'en_GB',

    // Favicon (browser tab icon).
    favicon: 'assets/favicon.svg',
    faviconFallback: 'assets/favicon.ico'
  },

  /* ---------------------------------------------------------------------------
     1. HERO — the first screen
     ------------------------------------------------------------------------ */
  hero: {
    name: 'Barira Saad',
    role: 'Registered Dietitian & Health Writer',

    // One line. What you do, for whom, and why it can be trusted.
    positioning:
      'I write clear, evidence-based nutrition content for health brands, ' +
      'publishers and medical communications agencies — across adult and ' +
      'paediatric nutrition, and for culturally diverse audiences.',

    // The single call to action. It scrolls to the enquiry form.
    ctaLabel: 'Discuss a project',
    ctaTarget: '#enquiry',

    // Small line of reassurance under the button. Set to '' to hide it.
    ctaNote: 'HCPC registered (DT30976) · Member of the British Dietetic Association'
  },

  /* ---------------------------------------------------------------------------
     2. ABOUT — two or three short paragraphs
     Add or remove paragraphs by adding or removing strings in the list.
     ------------------------------------------------------------------------ */
  about: {
    heading: 'About',
    paragraphs: [
      'I am Barira Saad — most people call me Bea. I am a UK Registered ' +
      'Dietitian, HCPC registered and a member of the British Dietetic ' +
      'Association, and I write about food, nutrition and health for a living. ' +
      'My background is clinical: I hold an M.Phil in Human Nutrition and ' +
      'Dietetics and have seven peer-reviewed publications to my name, so I am ' +
      'comfortable reading the primary literature and translating it without ' +
      'losing what it actually says.',

      'I write as a generalist across adult and paediatric nutrition, with ' +
      'particular depth in paediatrics — fussy and faddy eating, food allergy ' +
      'and intolerance, growth and feeding. Alongside that I cover diabetes and ' +
      'gut health for both public and professional audiences. The clinical ' +
      'grounding means editors get copy that is accurate first time, and one ' +
      'less round of fact-checking.',

      'I also write credibly for South Asian and culturally diverse audiences. ' +
      'Dietary advice fails when it ignores the food people actually eat, the ' +
      'way households cook, or the calendar they live by. I write nutrition ' +
      'content that holds up clinically and still makes sense at a real kitchen ' +
      'table — which matters when your readers are the people mainstream health ' +
      'content routinely misses.'
    ]
  },

  /* ---------------------------------------------------------------------------
     3. WHAT I WRITE — the service cards
     Add a card by copying a whole { ... }, block. Remove one by deleting it.
     ------------------------------------------------------------------------ */
  whatIWrite: {
    heading: 'What I write',
    intro: 'Commissions I take on regularly.',
    cards: [
      {
        title: 'Patient-facing content',
        description:
          'Plain-English nutrition content for the public — web copy, ' +
          'condition guides and campaign material that is readable without ' +
          'being thin.'
      },
      {
        title: 'Medical communications',
        description:
          'Content for healthcare professionals: congress and conference ' +
          'summaries, therapy area briefings, and copy for medcomms agencies ' +
          'and healthcare brands.'
      },
      {
        title: 'Articles & features',
        description:
          'Commissioned features and opinion for consumer titles and the ' +
          'professional nutrition press, researched from the primary evidence.'
      },
      {
        title: 'Patient information leaflets',
        description:
          'Clinically accurate leaflets and handouts written to a reading age ' +
          'that works, including culturally adapted versions.'
      },
      {
        title: 'Evidence summaries',
        description:
          'Literature reviews, evidence briefings and position-statement ' +
          'support — the underlying papers read properly and reported ' +
          'faithfully.'
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     4. SELECTED WORK — [[SAMPLE ARTICLES]]
     Three flagship pieces. To swap one out, edit its block in place.
     'whatItShows' is one line on why the piece is here — the skill it evidences.
     ------------------------------------------------------------------------ */
  selectedWork: {
    heading: 'Selected work',
    intro: 'Three pieces that show the range.',
    articles: [
      {
        title: 'PLACEHOLDER — Fussy eating: what the evidence actually supports',
        publication: 'Publication name',
        date: 'March 2025',
        whatItShows:
          'Translating a contested paediatric evidence base into advice ' +
          'parents can act on.',
        url: 'https://example.com/replace-me',
        linkLabel: 'Read'
      },
      {
        title: 'PLACEHOLDER — Type 2 diabetes and the South Asian plate',
        publication: 'Publication name',
        date: 'November 2024',
        whatItShows:
          'Culturally grounded dietary guidance that stays clinically ' +
          'accurate.',
        url: 'https://example.com/replace-me',
        linkLabel: 'Read'
      },
      {
        title: 'PLACEHOLDER — Cow’s milk protein allergy: a practical update',
        publication: 'Publication name',
        date: 'June 2024',
        whatItShows:
          'Writing for healthcare professionals — dense guidance made usable ' +
          'in clinic.',
        url: 'https://example.com/replace-me',
        linkLabel: 'Read'
      }
    ],
    footnote:
      'Further articles published in the professional nutrition press — full ' +
      'list available on request.'
  },

  /* ---------------------------------------------------------------------------
     5. SELECTED PUBLICATIONS — [[PUBLICATIONS]]
     Peer-reviewed work. List a representative few, not all seven.
     'url' is optional — set it to '' and the entry renders as plain text.
     ------------------------------------------------------------------------ */
  publications: {
    heading: 'Selected publications',
    intro: 'Seven peer-reviewed publications. A selection:',
    items: [
      {
        title: 'PLACEHOLDER — Title of the peer-reviewed paper goes here',
        authors: 'Saad B, Author A, Author B',
        journal: 'Journal name',
        year: '2023',
        url: 'https://doi.org/replace-me'
      },
      {
        title: 'PLACEHOLDER — Title of the second peer-reviewed paper',
        authors: 'Author A, Saad B',
        journal: 'Journal name',
        year: '2021',
        url: 'https://doi.org/replace-me'
      },
      {
        title: 'PLACEHOLDER — Title of the third peer-reviewed paper',
        authors: 'Saad B, Author C',
        journal: 'Journal name',
        year: '2019',
        url: ''
      }
    ],
    footnote: 'Full publication list available on request.'
  },

  /* ---------------------------------------------------------------------------
     6. FEATURED BY THE HCPC — trust strip, not a writing sample
     COMPLIANCE: framed as "Published by the HCPC". Do not reword this in a way
     that implies the HCPC endorses, recommends or promotes your services.
     ------------------------------------------------------------------------ */
  hcpcFeature: {
    heading: 'Featured by the HCPC',
    intro:
      'Published by the Health and Care Professions Council in their ' +
      '“In your words” series.',
    items: [
      {
        label: 'My story (2021)',
        title: 'Barira Saad',
        url: 'https://www.hcpc-uk.org/registrants/in-your-words/2021/my-story---barira-saad/'
      },
      {
        label: 'My story (2023)',
        title: 'South Asian Heritage Month',
        url: 'https://www.hcpc-uk.org/registrants/in-your-words/2023/my-story---barira-saad-south-asian-heritage-month-2023/'
      }
    ],
    // Keep a disclaimer of this kind. Do not delete it.
    disclaimer:
      'These pieces were published by the HCPC. They do not constitute an ' +
      'endorsement of my services.'
  },

  /* ---------------------------------------------------------------------------
     7. CREDENTIALS & VERIFICATION — [[HCPC LOGO]] and [[BDA LOGO]]
     COMPLIANCE — read before editing:
       • "Dietitian" is a protected title. Wording is "HCPC registered (DT30976)".
         Never write "state registered".
       • Do not alter, recolour, stretch or box the logos. The CSS already keeps
         clear space around them — drop replacement files in at their native
         aspect ratio and change only the 'src' below.
       • The BDA logo must link to https://www.bda.uk.com — leave 'href' alone.
       • These marks are tied to Barira Saad personally, not to business branding.
     ------------------------------------------------------------------------ */
  credentials: {
    heading: 'Credentials & verification',
    intro: 'Registration and membership you can check for yourself.',
    items: [
      {
        // [[HCPC LOGO]] — replace assets/hcpc-logo.svg with the official file.
        logo: {
          src: 'assets/hcpc-logo.svg',
          alt: 'Health and Care Professions Council logo',
          // No link required on the HCPC mark; the verify link below covers it.
          href: ''
        },
        title: 'HCPC registered — DT30976',
        detail:
          'Registered Dietitian with the Health and Care Professions Council. ' +
          '“Dietitian” is a title protected by law in the UK.'
      },
      {
        // [[BDA LOGO]] — replace assets/bda-logo.svg with the official file.
        logo: {
          src: 'assets/bda-logo.svg',
          alt: 'British Dietetic Association logo',
          // Required: the BDA logo must link to the BDA website.
          href: 'https://www.bda.uk.com'
        },
        title: 'Member of the British Dietetic Association (BDA)',
        detail:
          'The professional association and trade union for UK dietitians.'
      }
    ],
    verifyLink: {
      label: 'Verify my registration on the HCPC Register',
      url: 'https://www.hcpc-uk.org/check-the-register/'
    }
  },

  /* ---------------------------------------------------------------------------
     8. TESTIMONIALS — [[TESTIMONIALS]]
     Empty on purpose. The whole section stays hidden until you add an item.
     To add one, paste a block like this inside the square brackets:

       {
         quote: 'She turned a dense evidence base into copy we ran as written.',
         name: 'Emma Example',
         role: 'Commissioning Editor',
         organisation: 'Publication name'
       }

     'role' and 'organisation' are optional — set either to '' to omit it.
     ------------------------------------------------------------------------ */
  testimonials: {
    heading: 'What editors say',
    items: []
  },

  /* ---------------------------------------------------------------------------
     9. ENQUIRY FORM — [[FORMSPREE ENDPOINT]]
     Paste your Formspree endpoint below. Create a form at formspree.io, then
     copy the URL it gives you — it looks like https://formspree.io/f/abcdwxyz
     Until you do, the form shows a friendly "not configured yet" message
     instead of failing silently.
     ------------------------------------------------------------------------ */
  enquiry: {
    heading: 'Discuss a project',
    intro:
      'Tell me roughly what you need and when. I reply to every genuine ' +
      'enquiry, usually within two working days.',

    // ↓↓↓ REPLACE THIS ↓↓↓
    formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
    // ↑↑↑ REPLACE THIS ↑↑↑

    // Shown above the fields. Keep this notice.
    privacyNote:
      'Please don’t include confidential or patient information in your message.',

    // Field order and labels. 'type' is text, email or textarea.
    fields: [
      {
        name: 'name',
        label: 'Your name',
        type: 'text',
        required: true,
        autocomplete: 'name',
        hint: ''
      },
      {
        name: 'organisation',
        label: 'Organisation or company',
        type: 'text',
        required: false,
        autocomplete: 'organization',
        hint: ''
      },
      {
        name: 'email',
        label: 'Email address',
        type: 'email',
        required: true,
        autocomplete: 'email',
        hint: ''
      },
      {
        name: 'project',
        label: 'What’s the project about?',
        type: 'textarea',
        required: true,
        autocomplete: 'off',
        hint: 'Format, audience, rough length and timeline are all useful.'
      }
    ],

    submitLabel: 'Send enquiry',
    submittingLabel: 'Sending…',

    // Shown in place of the form after a successful send.
    thankYou: {
      heading: 'Thank you — your enquiry has been sent.',
      body:
        'I’ll come back to you at the email address you gave, usually within ' +
        'two working days.'
    },

    // Shown if the send fails.
    errorMessage:
      'Something went wrong sending that. Please email hello@barirasaad.com ' +
      'directly and I’ll pick it up from there.',

    // Shown while the Formspree endpoint above is still the placeholder.
    unconfiguredMessage:
      'This form isn’t connected yet. Add your Formspree endpoint in ' +
      'content.js to switch it on.',

    // Link to the privacy notice, shown under the form.
    privacyLinkLabel: 'How I handle your data',
    privacyLinkUrl: 'privacy.html'
  },

  /* ---------------------------------------------------------------------------
     10. FOOTER
     ------------------------------------------------------------------------ */
  footer: {
    email: 'hello@barirasaad.com',
    links: [
      { label: 'Privacy notice', url: 'privacy.html' }
    ],
    copyright: '© 2026 Barira Saad'
  },

  /* ---------------------------------------------------------------------------
     NAVIGATION — the in-page menu. Each 'target' must match a section id.
     Section ids: #about #what-i-write #work #publications #hcpc
                  #credentials #testimonials #enquiry
     ------------------------------------------------------------------------ */
  nav: {
    items: [
      { label: 'About', target: '#about' },
      { label: 'What I write', target: '#what-i-write' },
      { label: 'Work', target: '#work' },
      { label: 'Credentials', target: '#credentials' },
      { label: 'Enquire', target: '#enquiry' }
    ]
  },

  /* ---------------------------------------------------------------------------
     PRIVACY PAGE — the few details reused on privacy.html.
     The rest of that page is prose you edit directly in privacy.html.
     ------------------------------------------------------------------------ */
  privacy: {
    title: 'Privacy notice — Barira Saad',
    description:
      'How Barira Saad collects, uses and stores the information you send ' +
      'through the enquiry form on barirasaad.com.',
    controllerName: 'Barira Saad',
    controllerDescription: 'sole trader',
    controllerEmail: 'hello@barirasaad.com',
    lastUpdated: 'August 2026'
  }
};

/* Do not edit below this line. It makes CONTENT visible to the page. */
if (typeof window !== 'undefined') { window.CONTENT = CONTENT; }
