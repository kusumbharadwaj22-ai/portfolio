/* ==========================================================================
   script.js — the only JavaScript file in this portfolio
   --------------------------------------------------------------------------
   Nine small features, in nine clearly labelled sections. Nothing here
   depends on anything except the HTML above it.

   01  Theme (light / dark, remembered)
   02  Mobile navigation
   03  Automatic copyright year
   04  Typing headline in the hero
   05  Scroll reveal
   06  Card filtering
   07  Scroll-spy navigation
   08  Back-to-top button
   09  Contact form validation

   WHY EVERYTHING IS WRAPPED IN A FUNCTION
   The whole file sits inside one IIFE: (function () { ... })();
   That function runs immediately, defines everything inside its own scope,
   and adds exactly zero names to the global window object. Nothing on the
   page can accidentally overwrite our variables, and we cannot accidentally
   overwrite anything of the page's. This is the single most useful
   JavaScript habit in this file.
   ========================================================================== */
(function () {
  'use strict';   // turns silent mistakes into loud errors. Always worth it.

  /* ------------------------------------------------------------------
     Tiny helpers. `$` returns one element, `$$` returns a real Array of
     them (Array.from, because a NodeList only has forEach and we want
     .forEach, .map and .length to behave consistently).
     ------------------------------------------------------------------ */
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  /* Read once, at startup. If the user has asked their computer to reduce
     motion, several features below change behaviour. */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ==================================================================
     01. THEME
     ================================================================== */

  var THEME_KEY = 'portfolio-theme';

  /**
   * Applies a theme and updates the toggle button to match.
   * The theme is stored as an attribute on <html> so that CSS can switch
   * every colour with one selector: [data-theme='dark'].
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    var button = $('#themeToggle');
    if (!button) {
      return;
    }

    var isDark = theme === 'dark';
    if (button.firstElementChild) {
      button.firstElementChild.textContent = isDark ? '☀️' : '🌙';
    }
    button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  function initTheme() {
    // 1. A saved choice wins. 2. Otherwise follow the operating system.
    var saved = localStorage.getItem(THEME_KEY);
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));

    var button = $('#themeToggle');
    if (!button) {
      return;
    }

    button.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);   // remember it for next visit
      applyTheme(next);
    });
  }


  /* ==================================================================
     02. MOBILE NAVIGATION
     ================================================================== */

  function initNav() {
    var toggle = $('#navToggle');
    var nav = $('#nav');

    // Guard clause: if either element is missing, stop here rather than
    // throwing an error that would kill every feature below this one.
    if (!toggle || !nav) {
      return;
    }

    function close() {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var isOpen = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Choosing a link should close the panel, otherwise it stays open on
    // top of the section you just scrolled to.
    $$('.nav__link', nav).forEach(function (link) {
      link.addEventListener('click', close);
    });
  }


  /* ==================================================================
     03. COPYRIGHT YEAR
     ================================================================== */

  function initYear() {
    var year = String(new Date().getFullYear());
    $$('.year').forEach(function (el) {
      el.textContent = year;
    });
  }


  /* ==================================================================
     04. TYPING HEADLINE
     ------------------------------------------------------------------
     A loop with three states:
       typing   -> add one character
       pausing  -> wait, then switch to deleting
       deleting -> remove one character, then move to the next phrase
     ================================================================== */

  var PHRASES = [
    'backend services.',
    'Java applications.',
    'Spring Boot services.',
    'server-side code.'
  ];

  var phraseIndex = 0;    // which phrase we are on
  var charIndex = 0;      // how many characters of it are showing
  var deleting = false;   // are we adding or removing right now?

  function typeLoop() {
    var target = $('#typed');
    if (!target) {
      return;
    }

    var phrase = PHRASES[phraseIndex];
    target.textContent = phrase.slice(0, charIndex);

    if (!deleting && charIndex < phrase.length) {
      charIndex += 1;                       // keep typing
      setTimeout(typeLoop, 85);
    } else if (!deleting) {
      deleting = true;                      // finished it, pause, then erase
      setTimeout(typeLoop, 1500);
    } else if (charIndex > 0) {
      charIndex -= 1;                       // erase one character
      setTimeout(typeLoop, 40);
    } else {
      deleting = false;                     // empty, move to the next phrase
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
      setTimeout(typeLoop, 350);
    }
  }

  function initTyping() {
    var target = $('#typed');
    if (!target) {
      return;
    }

    // With reduced motion, just show the first phrase and leave it alone.
    if (reduceMotion) {
      target.textContent = PHRASES[0];
      return;
    }

    typeLoop();
  }


  /* ==================================================================
     05. SCROLL REVEAL
     ------------------------------------------------------------------
     IntersectionObserver tells us when an element enters the viewport.
     We use that to fade it in, and then stop watching it — an element
     should only animate once.
     ================================================================== */

  function initReveal() {
    var items = $$('[data-reveal]');

    // If we cannot animate, make sure everything is visible right now.
    // Note we never add the .js-reveal class in that case, so the CSS
    // never hides anything to begin with.
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (item) {
        item.classList.add('is-visible');
      });
      return;
    }

    // The class goes on <html>, which is what switches the hidden starting
    // state on in the stylesheet.
    document.documentElement.classList.add('js-reveal');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.15,                       // 15% of it must be showing
      rootMargin: '0px 0px -40px 0px'        // and slightly above the bottom edge
    });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }


  /* ==================================================================
     06. CARD FILTERING
     ------------------------------------------------------------------
     Filters the learning cards by area.

     "Event delegation" in practice: we attach ONE listener to the filter
     bar and work out which button was clicked, instead of attaching a
     listener to every button.
     ================================================================== */

  function initFilters() {
    var bar = $('.filters');
    var buttons = bar ? $$('.filter', bar) : [];
    var cards = $$('.track');

    if (!bar || buttons.length === 0 || cards.length === 0) {
      return;
    }

    var countLabel = $('#trackCount');

    /**
     * Shows only the cards matching a category, and hides the rest.
     * @param {string} category - 'all', or one of the data-category values
     */
    function showOnly(category) {
      var shown = 0;

      cards.forEach(function (card) {
        var matches = category === 'all' || card.dataset.category === category;
        card.classList.toggle('is-hidden', !matches);
        if (matches) {
          shown += 1;
        }
      });

      if (countLabel) {
        countLabel.textContent = 'Showing ' + shown + ' of ' + cards.length;
      }
    }

    // ONE listener for the whole bar, not one per button. A click anywhere
    // on a button bubbles up to the bar, and closest() then walks back up
    // from whatever was actually clicked until it finds the button.
    bar.addEventListener('click', function (event) {
      var button = event.target.closest('.filter');

      // Either the gap between buttons was clicked, or closest() found a
      // filter that lives outside this bar. Do nothing in both cases.
      if (!button || !bar.contains(button)) {
        return;
      }

      // Reset every button, then mark this one as the chosen filter.
      buttons.forEach(function (other) {
        other.classList.remove('is-active');
        other.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');

      showOnly(button.dataset.filter);
    });

    showOnly('all');   // set the initial text and state
  }


  /* ==================================================================
     07. SCROLL-SPY NAVIGATION
     ------------------------------------------------------------------
     Highlights the nav link for whichever section is currently on screen.
     The trick is in rootMargin below: it shrinks the "viewport" down to a
     thin band in the middle of the screen, so only one section can ever
     count as current.
     ================================================================== */

  function initScrollSpy() {
    var links = $$('.nav__link');

    if (links.length === 0 || !('IntersectionObserver' in window)) {
      return;
    }

    // Turn each link's href ("#about") into the section element itself.
    var sections = [];
    links.forEach(function (link) {
      var section = $(link.getAttribute('href'));
      if (section) {
        sections.push(section);
      }
    });

    if (sections.length === 0) {
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        links.forEach(function (link) {
          var isCurrent = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', isCurrent);

          // aria-current="true" tells a screen reader the same thing the
          // underline tells everyone else.
          if (isCurrent) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, {
      rootMargin: '-45% 0px -50% 0px'
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }


  /* ==================================================================
     08. BACK-TO-TOP BUTTON
     ================================================================== */

  function initToTop() {
    var button = $('#toTop');
    if (!button) {
      return;
    }

    function updateVisibility() {
      // Show it once the user has scrolled roughly a screen's worth.
      button.classList.toggle('is-visible', window.scrollY > 400);
    }

    // passive: true promises the browser that this listener never calls
    // preventDefault(), which lets it scroll without waiting for our code.
    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }


  /* ==================================================================
     09. CONTACT FORM VALIDATION
     ------------------------------------------------------------------
     Each field is wrapped in .field with an empty .field__error span.
     Validation rules are looked up by the field's name attribute, so
     adding a new field means adding one line to rulesFor().
     ================================================================== */

  /* A deliberately simple email check: something, an @, something, a dot,
     and at least two characters at the end. It rejects obvious mistakes
     without pretending to be a complete email specification. */
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /**
   * Returns an error message for a field, or '' if the field is fine.
   * @param {HTMLInputElement|HTMLTextAreaElement} input
   * @returns {string}
   */
  function rulesFor(input) {
    var value = input.value.trim();

    // Every field is required, so this rule applies to all of them.
    if (value === '') {
      return 'This field is required.';
    }

    if (input.name === 'name' && value.length < 2) {
      return 'Please enter your name (at least 2 characters).';
    }

    if (input.name === 'email' && !EMAIL_PATTERN.test(value)) {
      return 'Please enter a valid email address, like ada@example.com.';
    }

    if (input.name === 'message' && value.length < 20) {
      return 'A little more detail, please - 20 characters minimum.';
    }

    return '';
  }

  /**
   * Paints (or clears) the error state for one field.
   * @param {Element} field - the .field wrapper
   * @param {string} message - '' to clear
   */
  function showError(field, message) {
    field.classList.toggle('has-error', message !== '');

    var input = $('input, textarea', field);
    var errorBox = $('.field__error', field);

    if (input) {
      // aria-invalid is how a screen reader learns the field is wrong.
      input.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
    }

    if (errorBox) {
      errorBox.textContent = message;
    }
  }

  function initContactForm() {
    var form = $('#contactForm');
    if (!form) {
      return;
    }

    var status = $('#formStatus');

    // Only the .field wrappers that actually contain an input.
    var fields = $$('.field', form).filter(function (field) {
      return $('input, textarea', field) !== null;
    });

    fields.forEach(function (field) {
      var input = $('input, textarea', field);

      // Check when the user leaves the field...
      input.addEventListener('blur', function () {
        showError(field, rulesFor(input));
      });

      // ...and once it is already wrong, check again on every keystroke, so
      // the message disappears the moment the input becomes valid.
      input.addEventListener('input', function () {
        if (field.classList.contains('has-error')) {
          showError(field, rulesFor(input));
        }
      });
    });

    form.addEventListener('submit', function (event) {
      // There is no server, so stop the browser from navigating away.
      event.preventDefault();

      var firstInvalid = null;

      fields.forEach(function (field) {
        var input = $('input, textarea', field);
        var message = rulesFor(input);
        showError(field, message);

        if (message !== '' && firstInvalid === null) {
          firstInvalid = field;
        }
      });

      if (firstInvalid) {
        if (status) {
          status.textContent = 'Please fix the highlighted fields.';
          status.className = 'form-status is-error';
        }
        // Send keyboard focus to the first problem, so the user does not
        // have to hunt for it.
        var input = $('input, textarea', firstInvalid);
        if (input) {
          input.focus();
        }
        return;
      }

      // Passed. We cannot actually send anything, so we say so honestly.
      if (status) {
        status.textContent = 'Thanks, ' + $('#name').value.trim() +
          '. This is a demo form, so nothing was sent.';
        status.className = 'form-status is-success';
      }

      form.reset();
      fields.forEach(function (field) {
        showError(field, '');
      });
    });
  }


  /* ==================================================================
     START-UP
     ------------------------------------------------------------------
     Every init function above is independent: each one checks that its
     elements exist and returns quietly if they do not. So they can run in
     any order, and a missing element can never break the rest of the page.
     ================================================================== */

  function init() {
    initTheme();
    initNav();
    initYear();
    initTyping();
    initReveal();
    initFilters();
    initScrollSpy();
    initToTop();
    initContactForm();
  }

  // The script tag sits at the end of <body>, so the HTML is already parsed
  // by the time this runs. DOMContentLoaded is belt and braces: it also
  // covers the case where someone moves the script into the <head>.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
