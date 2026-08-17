/* =============================================================================
   render.js — the templating engine
   =============================================================================

   YOU DO NOT NEED TO EDIT THIS FILE.

   It reads the CONTENT object from content.js and writes it into the mount
   points in index.html and privacy.html. Edit content.js; this file does the
   rest. It is deliberately plain: no framework, no build step, no dependencies.
   ========================================================================== */

(function () {
  'use strict';

  var C = window.CONTENT;

  if (!C) {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.innerHTML =
        '<p style="padding:2rem;font-family:sans-serif">' +
        'content.js did not load. Check that it sits next to index.html and ' +
        'that it has no typos — the browser console will name the line.</p>';
    });
    return;
  }

  /* ---------------------------------------------------------------- helpers */

  /** Create an element. Children may be nodes or strings (inserted as text). */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === 'class') node.className = value;
        else if (key === 'text') node.textContent = value;
        else node.setAttribute(key, value);
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.appendChild(
        typeof child === 'string' ? document.createTextNode(child) : child
      );
    });
    return node;
  }

  /** Find a mount point by its data-mount name. */
  function mount(name) {
    return document.querySelector('[data-mount="' + name + '"]');
  }

  /** Replace a mount point's contents with the given nodes. */
  function fill(name, nodes) {
    var host = mount(name);
    if (!host) return null;
    host.textContent = '';
    (nodes || []).forEach(function (node) {
      if (node) host.appendChild(node);
    });
    return host;
  }

  /** True for a string with something in it. */
  function has(value) {
    return typeof value === 'string' && value.trim() !== '';
  }

  /** An external link, opened in a new tab with the usual safety attributes. */
  function externalLink(href, label, className) {
    return el('a', {
      class: className,
      href: href,
      target: '_blank',
      rel: 'noopener noreferrer'
    }, [label]);
  }

  /** Section heading plus optional intro paragraph. */
  function sectionHead(id, heading, intro) {
    return el('div', { class: 'section-head' }, [
      el('h2', { id: id + '-heading', text: heading }),
      has(intro) ? el('p', { class: 'section-intro', text: intro }) : null
    ]);
  }

  /* ------------------------------------------------------------------- meta
     Runs immediately (this script is loaded in <head>) so the tab title and
     the social tags are set before anything paints.
     -------------------------------------------------------------------- */

  function applyMeta() {
    var m = C.meta || {};
    var head = document.head;

    function metaTag(keyName, keyValue, content) {
      if (!has(content)) return;
      var existing = head.querySelector(
        'meta[' + keyName + '="' + keyValue + '"]'
      );
      var tag = existing || el('meta', (function () {
        var a = {};
        a[keyName] = keyValue;
        return a;
      })());
      tag.setAttribute('content', content);
      if (!existing) head.appendChild(tag);
    }

    function linkTag(rel, href, type) {
      if (!has(href)) return;
      head.appendChild(el('link', { rel: rel, href: href, type: type }));
    }

    if (has(m.title)) document.title = m.title;
    if (has(m.lang)) document.documentElement.setAttribute('lang', m.lang);

    var absoluteImage = m.ogImage;
    if (has(m.siteUrl) && has(m.ogImage) && m.ogImage.indexOf('http') !== 0) {
      absoluteImage =
        m.siteUrl.replace(/\/$/, '') + '/' + m.ogImage.replace(/^\//, '');
    }

    metaTag('name', 'description', m.description);
    metaTag('property', 'og:type', 'website');
    metaTag('property', 'og:title', m.title);
    metaTag('property', 'og:description', m.description);
    metaTag('property', 'og:url', m.siteUrl);
    metaTag('property', 'og:image', absoluteImage);
    metaTag('property', 'og:image:alt', m.ogImageAlt);
    metaTag('property', 'og:locale', m.locale);
    metaTag('property', 'og:site_name', (C.hero && C.hero.name) || m.title);
    metaTag('name', 'twitter:card', 'summary_large_image');
    metaTag('name', 'twitter:title', m.title);
    metaTag('name', 'twitter:description', m.description);
    metaTag('name', 'twitter:image', absoluteImage);

    linkTag('icon', m.favicon, 'image/svg+xml');
    linkTag('alternate icon', m.faviconFallback, 'image/x-icon');
  }

  function applyPrivacyMeta() {
    var p = C.privacy || {};
    var m = C.meta || {};
    if (has(m.lang)) document.documentElement.setAttribute('lang', m.lang);
    if (has(p.title)) document.title = p.title;
    if (has(p.description)) {
      var tag = document.head.querySelector('meta[name="description"]') ||
        document.head.appendChild(el('meta', { name: 'description' }));
      tag.setAttribute('content', p.description);
    }
    if (has(m.favicon)) {
      document.head.appendChild(
        el('link', { rel: 'icon', href: m.favicon, type: 'image/svg+xml' })
      );
    }
    if (has(m.faviconFallback)) {
      document.head.appendChild(
        el('link', { rel: 'alternate icon', href: m.faviconFallback })
      );
    }
  }

  /* --------------------------------------------------------------- sections */

  function renderNav() {
    var host = mount('nav');
    if (!host) return;
    var items = (C.nav && C.nav.items) || [];
    fill('nav', items.map(function (item) {
      return el('a', { class: 'nav__link', href: item.target }, [item.label]);
    }));
    if (!items.length) host.hidden = true;
  }

  function renderBrand() {
    fill('brand', [
      el('a', { class: 'brand', href: '#top' }, [
        el('span', { class: 'brand__name', text: C.hero.name }),
        el('span', { class: 'brand__role', text: C.hero.role })
      ])
    ]);
  }

  function renderHero() {
    var h = C.hero;
    fill('hero', [
      el('p', { class: 'hero__eyebrow', text: h.role }),
      el('h1', { class: 'hero__name', text: h.name }),
      el('p', { class: 'hero__positioning', text: h.positioning }),
      el('div', { class: 'hero__actions' }, [
        el('a', { class: 'button', href: h.ctaTarget }, [h.ctaLabel])
      ]),
      has(h.ctaNote) ? el('p', { class: 'hero__note', text: h.ctaNote }) : null
    ]);
  }

  function renderAbout() {
    var a = C.about;
    fill('about', [
      sectionHead('about', a.heading, ''),
      el('div', { class: 'prose' }, (a.paragraphs || []).map(function (p) {
        return el('p', { text: p });
      }))
    ]);
  }

  function renderWhatIWrite() {
    var w = C.whatIWrite;
    fill('what-i-write', [
      sectionHead('what-i-write', w.heading, w.intro),
      el('ul', { class: 'cards' }, (w.cards || []).map(function (card) {
        return el('li', { class: 'card' }, [
          el('h3', { class: 'card__title', text: card.title }),
          el('p', { class: 'card__body', text: card.description })
        ]);
      }))
    ]);
  }

  function renderSelectedWork() {
    var s = C.selectedWork;
    fill('work', [
      sectionHead('work', s.heading, s.intro),
      el('ol', { class: 'work-list' }, (s.articles || []).map(function (a) {
        var metaBits = [a.publication, a.date].filter(has).join(' · ');
        return el('li', { class: 'work' }, [
          el('h3', { class: 'work__title', text: a.title }),
          has(metaBits)
            ? el('p', { class: 'work__meta', text: metaBits })
            : null,
          has(a.whatItShows)
            ? el('p', { class: 'work__shows', text: a.whatItShows })
            : null,
          has(a.url)
            ? externalLink(
                a.url,
                (a.linkLabel || 'Read') + ' — ' + a.title,
                'link-arrow'
              )
            : null
        ]);
      })),
      has(s.footnote) ? el('p', { class: 'footnote', text: s.footnote }) : null
    ]);

    // The visible link text stays short; screen readers get the full title.
    Array.prototype.forEach.call(
      document.querySelectorAll('.work .link-arrow'),
      function (link) {
        var full = link.textContent;
        var short = full.split(' — ')[0];
        link.setAttribute('aria-label', full);
        link.textContent = '';
        link.appendChild(el('span', { text: short }));
        link.appendChild(el('span', { 'aria-hidden': 'true', text: '→' }));
      }
    );
  }

  function renderPublications() {
    var p = C.publications;
    fill('publications', [
      sectionHead('publications', p.heading, p.intro),
      el('ul', { class: 'pub-list' }, (p.items || []).map(function (item) {
        var journalLine = [item.journal, item.year].filter(has).join(', ');
        return el('li', { class: 'pub' }, [
          has(item.url)
            ? el('h3', { class: 'pub__title' }, [
                externalLink(item.url, item.title, 'pub__link')
              ])
            : el('h3', { class: 'pub__title', text: item.title }),
          has(item.authors)
            ? el('p', { class: 'pub__authors', text: item.authors })
            : null,
          has(journalLine)
            ? el('p', { class: 'pub__journal', text: journalLine })
            : null
        ]);
      })),
      has(p.footnote) ? el('p', { class: 'footnote', text: p.footnote }) : null
    ]);
  }

  function renderHcpcFeature() {
    var h = C.hcpcFeature;
    fill('hcpc', [
      sectionHead('hcpc', h.heading, h.intro),
      el('ul', { class: 'feature-strip' }, (h.items || []).map(function (item) {
        return el('li', { class: 'feature' }, [
          el('p', { class: 'feature__label', text: item.label }),
          externalLink(item.url, item.title, 'feature__link')
        ]);
      })),
      has(h.disclaimer)
        ? el('p', { class: 'footnote footnote--quiet', text: h.disclaimer })
        : null
    ]);
  }

  function renderCredentials() {
    var c = C.credentials;
    fill('credentials', [
      sectionHead('credentials', c.heading, c.intro),
      el('ul', { class: 'credentials' }, (c.items || []).map(function (item) {
        var logo = item.logo || {};
        // The logo keeps its own aspect ratio inside a clear-space box; it is
        // never recoloured, stretched or boxed in by the stylesheet.
        var image = el('img', {
          class: 'credential__logo',
          src: logo.src,
          alt: logo.alt || '',
          decoding: 'async'
        });
        return el('li', { class: 'credential' }, [
          el('div', { class: 'credential__logo-wrap' }, [
            has(logo.href)
              ? el('a', {
                  href: logo.href,
                  target: '_blank',
                  rel: 'noopener noreferrer'
                }, [image])
              : image
          ]),
          el('div', { class: 'credential__text' }, [
            el('h3', { class: 'credential__title', text: item.title }),
            has(item.detail)
              ? el('p', { class: 'credential__detail', text: item.detail })
              : null
          ])
        ]);
      })),
      c.verifyLink && has(c.verifyLink.url)
        ? el('p', { class: 'verify' }, [
            externalLink(c.verifyLink.url, c.verifyLink.label, 'link-underline')
          ])
        : null
    ]);
  }

  function renderTestimonials() {
    var t = C.testimonials || {};
    var items = t.items || [];
    var section = document.getElementById('testimonials');

    // Empty array: the section stays out of the page entirely.
    if (!items.length) {
      if (section) section.hidden = true;
      return;
    }
    if (section) section.hidden = false;

    fill('testimonials', [
      sectionHead('testimonials', t.heading, ''),
      el('ul', { class: 'quotes' }, items.map(function (item) {
        var attribution = [item.role, item.organisation].filter(has).join(', ');
        return el('li', { class: 'quote' }, [
          el('figure', {}, [
            el('blockquote', {}, [el('p', { text: '“' + item.quote + '”' })]),
            el('figcaption', {}, [
              el('span', { class: 'quote__name', text: item.name }),
              has(attribution)
                ? el('span', { class: 'quote__role', text: attribution })
                : null
            ])
          ])
        ]);
      }))
    ]);
  }

  /* ---------------------------------------------------------- enquiry form */

  function renderEnquiry() {
    var e = C.enquiry;
    var configured =
      has(e.formspreeEndpoint) &&
      e.formspreeEndpoint.indexOf('YOUR_FORM_ID') === -1;

    var status = el('p', {
      class: 'form__status',
      role: 'status',
      'aria-live': 'polite'
    });

    var fields = (e.fields || []).map(function (field) {
      var id = 'field-' + field.name;
      var hintId = id + '-hint';
      var control = field.type === 'textarea'
        ? el('textarea', {
            id: id,
            name: field.name,
            rows: '5',
            required: field.required ? 'required' : null,
            'aria-describedby': has(field.hint) ? hintId : null
          })
        : el('input', {
            id: id,
            name: field.name,
            type: field.type || 'text',
            autocomplete: field.autocomplete || 'on',
            required: field.required ? 'required' : null,
            'aria-describedby': has(field.hint) ? hintId : null
          });

      return el('div', { class: 'field' }, [
        el('label', { class: 'field__label', for: id }, [
          field.label,
          field.required
            ? null
            : el('span', { class: 'field__optional', text: ' (optional)' })
        ]),
        has(field.hint)
          ? el('p', { class: 'field__hint', id: hintId, text: field.hint })
          : null,
        control
      ]);
    });

    var submit = el('button', {
      class: 'button',
      type: 'submit'
    }, [e.submitLabel]);

    var form = el('form', {
      class: 'form',
      id: 'enquiry-form',
      method: 'POST',
      action: configured ? e.formspreeEndpoint : null,
      novalidate: null
    }, fields.concat([
      // Honeypot: a real person never fills this in; bots usually do.
      el('div', { class: 'field field--honey', 'aria-hidden': 'true' }, [
        el('label', { for: 'field-gotcha', text: 'Leave this field empty' }),
        el('input', {
          id: 'field-gotcha',
          type: 'text',
          name: '_gotcha',
          tabindex: '-1',
          autocomplete: 'off'
        })
      ]),
      el('div', { class: 'form__actions' }, [submit]),
      status
    ]));

    var panel = el('div', { class: 'form-panel' }, [
      el('p', { class: 'form__notice', text: e.privacyNote }),
      form,
      has(e.privacyLinkLabel)
        ? el('p', { class: 'form__privacy' }, [
            el('a', {
              class: 'link-underline',
              href: e.privacyLinkUrl
            }, [e.privacyLinkLabel])
          ])
        : null
    ]);

    fill('enquiry', [
      sectionHead('enquiry', e.heading, e.intro),
      panel
    ]);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      status.className = 'form__status';

      if (!configured) {
        status.classList.add('form__status--error');
        status.textContent = e.unconfiguredMessage;
        return;
      }

      submit.disabled = true;
      submit.textContent = e.submittingLabel;
      status.textContent = '';

      fetch(e.formspreeEndpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (response) {
        if (!response.ok) throw new Error('Bad response');
        showThankYou(panel, e);
      }).catch(function () {
        submit.disabled = false;
        submit.textContent = e.submitLabel;
        status.classList.add('form__status--error');
        status.textContent = e.errorMessage;
      });
    });
  }

  /** Swap the form out for the thank-you state and move focus to it. */
  function showThankYou(panel, e) {
    var thanks = el('div', {
      class: 'thanks',
      role: 'status',
      tabindex: '-1'
    }, [
      el('h3', { class: 'thanks__heading', text: e.thankYou.heading }),
      el('p', { text: e.thankYou.body })
    ]);
    panel.textContent = '';
    panel.appendChild(thanks);
    thanks.focus();
  }

  function renderFooter() {
    var f = C.footer;
    fill('footer', [
      el('div', { class: 'footer__inner' }, [
        el('p', { class: 'footer__contact' }, [
          el('a', { class: 'link-underline', href: 'mailto:' + f.email }, [
            f.email
          ])
        ]),
        el('nav', { class: 'footer__links', 'aria-label': 'Footer' },
          (f.links || []).map(function (link) {
            return el('a', { class: 'link-underline', href: link.url }, [
              link.label
            ]);
          })
        ),
        el('p', { class: 'footer__copyright', text: f.copyright })
      ])
    ]);
  }

  /* ----------------------------------------------------- privacy page bits */

  function renderPrivacyPage() {
    var p = C.privacy || {};
    fill('privacy-brand', [
      el('a', { class: 'brand', href: 'index.html' }, [
        el('span', { class: 'brand__name', text: C.hero.name }),
        el('span', { class: 'brand__role', text: C.hero.role })
      ])
    ]);

    // Any <span data-content="privacy.controllerEmail"> style hooks in the
    // prose get filled from content.js so contact details live in one place.
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-content]'),
      function (node) {
        var path = node.getAttribute('data-content').split('.');
        var value = C;
        path.forEach(function (key) {
          value = value && value[key];
        });
        if (typeof value !== 'string') return;
        node.textContent = value;
        var href = node.getAttribute('href');
        if (node.tagName === 'A' && href && href.indexOf('mailto:') === 0) {
          node.setAttribute('href', 'mailto:' + value);
        }
      }
    );

    renderFooter();
  }

  /* -------------------------------------------------------------- start up */

  var page = document.documentElement.getAttribute('data-page');

  if (page === 'privacy') {
    applyPrivacyMeta();
  } else {
    applyMeta();
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (page === 'privacy') {
      renderPrivacyPage();
      return;
    }
    renderBrand();
    renderNav();
    renderHero();
    renderAbout();
    renderWhatIWrite();
    renderSelectedWork();
    renderPublications();
    renderHcpcFeature();
    renderCredentials();
    renderTestimonials();
    renderEnquiry();
    renderFooter();
    document.body.classList.add('is-rendered');
  });
})();
