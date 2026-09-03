// script.js — Accel Enterprise
(function () {
  'use strict';

  /* ============== PRELOADER — DISMISS IMMEDIATELY ON LOAD ============== */
  const preloader = document.getElementById('site-preloader');
  let isPageFullyRevealed = false;

  function dismissPreloader() {
    if (isPageFullyRevealed) return;
    isPageFullyRevealed = true;

    if (preloader) {
      preloader.classList.add('is-loaded');
      preloader.setAttribute('aria-hidden', 'true');
    }

    startApp();
  }

  // Dismiss as soon as the page has loaded
  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader);
  }

  // Hard safety fallback — dismiss at 3s max regardless
  setTimeout(() => {
    if (!isPageFullyRevealed) dismissPreloader();
  }, 3000);

  /* ============== LENIS SMOOTH SCROLL ============== */
  let lenis = null;

  function initLenis() {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.3,
        wheelMultiplier: 0.95,
      });

      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(1000, 16);
      } else {
        function raf(time) {
          if (lenis) lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }

      lenis.on('scroll', () => {
        onScrollTick();
      });
    }
  }

  /* ============== STICKY NAV SCROLL HANDLING ============== */
  const navInner = document.getElementById('nav-inner');
  const heroSection = document.querySelector('section.hero');

  let cachedHeroHeight = 450;
  let isNavScrolled = false;
  let isNavPastHero = false;

  function recalculateMetrics() {
    if (heroSection) {
      cachedHeroHeight = heroSection.offsetHeight - 140;
    }
  }

  window.addEventListener('resize', recalculateMetrics, { passive: true });
  window.addEventListener('orientationchange', recalculateMetrics, { passive: true });

  let isScrollTicking = false;
  function onScrollTick() {
    if (!isScrollTicking) {
      requestAnimationFrame(() => {
        handleScrollUpdates();
        isScrollTicking = false;
      });
      isScrollTicking = true;
    }
  }

  function handleScrollUpdates() {
    const scrollY = window.scrollY || window.pageYOffset || 0;

    if (navInner) {
      const shouldBeScrolled = scrollY > 30;
      if (shouldBeScrolled !== isNavScrolled) {
        isNavScrolled = shouldBeScrolled;
        navInner.classList.toggle('is-scrolled', isNavScrolled);
      }

      const shouldBePastHero = scrollY > cachedHeroHeight;
      if (shouldBePastHero !== isNavPastHero) {
        isNavPastHero = shouldBePastHero;
        navInner.classList.toggle('is-past-hero', isNavPastHero);
      }
    }
  }

  window.addEventListener('scroll', onScrollTick, { passive: true });

  /* ============== APP START ============== */
  function startApp() {
    recalculateMetrics();
    initLenis();
    handleScrollUpdates();

    if (typeof gsap !== 'undefined') {
      playHeroAnimation();
    }

    initConceptCards();
    initScrollReveal();
    initSmoothAnchors();
    initGSAPScrollAnimations();
  }

  /* ============== GSAP HERO ENTRANCE ANIMATION ============== */
  function playHeroAnimation() {
    const headline = document.querySelector('.hero-headline');
    const body = document.querySelector('.hero-body');
    const ctaRow = document.querySelector('.hero-headline')?.closest('.lg\\:col-span-6')?.querySelector('[class*="mt-8"]');
    const panel = document.querySelector('.hero-interface-panel');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (headline) tl.fromTo(headline, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 }, 0.15);
    if (body) tl.fromTo(body, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, 0.4);

    // Animate reveal class elements in hero if GSAP available
    const heroReveals = document.querySelectorAll('.hero .reveal');
    heroReveals.forEach((el) => {
      el.classList.add('is-visible');
    });

    if (panel) {
      tl.fromTo(panel, { x: 32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, 0.3);
    }
  }

  /* ============== GSAP SCROLL-TRIGGERED ANIMATIONS ============== */
  function initGSAPScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Contact cards stagger
    const contactCards = document.querySelectorAll('#contact .grid > div, #contact .grid > a');
    if (contactCards.length > 0) {
      gsap.fromTo(contactCards,
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Capability blocks stagger
    const capabilityBlocks = document.querySelectorAll('.capability-block');
    if (capabilityBlocks.length > 0) {
      gsap.fromTo(capabilityBlocks,
        { y: 32, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  /* ============== MOBILE MENU ============== */
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('close-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBackdrop = mobileMenu ? mobileMenu.querySelector('.menu-backdrop') : null;
  const menuLinks = document.querySelectorAll('.menu-link');

  let isMenuOpen = false;

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    if (lenis) lenis.stop();
    isMenuOpen = true;
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    if (lenis) lenis.start();
    isMenuOpen = false;

    setTimeout(() => {
      if (!isMenuOpen) {
        mobileMenu.classList.add('hidden');
      }
    }, 450);
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* ============== PROJECT VIEWER MODAL ============== */
  const conceptsData = {
    aura: {
      name: 'AURA',
      discipline: 'Beauty',
      idea: 'A restrained beauty storefront focused on premium product presentation, clean hierarchy and an effortless path from discovery to decision.',
      image: 'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'AURA — beauty storefront',
    },
    noma: {
      name: 'NOMA',
      discipline: 'Lifestyle',
      idea: 'A premium electronics storefront using clear technical presentation and minimal interface design to make complex products easy to evaluate.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'NOMA — lifestyle storefront',
    },
    form: {
      name: 'FORM',
      discipline: 'Home',
      idea: 'A furniture storefront built around scale, material, space and visual hierarchy rather than marketplace clutter.',
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'FORM — home storefront',
    },
    vela: {
      name: 'VELA',
      discipline: 'Wellness',
      idea: 'A modern fragrance storefront designed with restraint and elevated sensory presentation for direct customer engagement.',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'VELA — wellness storefront',
    },
  };

  const conceptModal = document.getElementById('concept-modal');
  const modalBackdropEl = conceptModal ? conceptModal.querySelector('.modal-backdrop') : null;
  const closeModalBtn = document.getElementById('close-modal');
  const modalImg = document.getElementById('modal-img');
  const modalDiscipline = document.getElementById('modal-discipline');
  const modalConceptTitle = document.getElementById('modal-concept-title');
  const modalIdea = document.getElementById('modal-idea');
  const modalStartProject = document.getElementById('modal-start-project');

  let isModalOpen = false;

  function openConceptViewer(conceptId) {
    const data = conceptsData[conceptId.toLowerCase()];
    if (!data || !conceptModal) return;

    if (modalImg) { modalImg.src = data.image; modalImg.alt = data.imageAlt; }
    if (modalDiscipline) modalDiscipline.textContent = data.discipline;
    if (modalConceptTitle) modalConceptTitle.textContent = data.name;
    if (modalIdea) modalIdea.textContent = data.idea;

    conceptModal.classList.remove('hidden');
    void conceptModal.offsetWidth; // force reflow for transition
    conceptModal.classList.add('is-open');
    conceptModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (lenis) lenis.stop();
    isModalOpen = true;
  }

  function closeConceptViewer() {
    if (!conceptModal) return;
    conceptModal.classList.remove('is-open');
    conceptModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lenis) lenis.start();
    isModalOpen = false;

    setTimeout(() => {
      if (!isModalOpen) conceptModal.classList.add('hidden');
    }, 320);
  }

  function initConceptCards() {
    document.querySelectorAll('[data-concept-id]').forEach((card) => {
      card.addEventListener('click', () => {
        const conceptId = card.getAttribute('data-concept-id');
        if (conceptId) openConceptViewer(conceptId);
      });
    });
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeConceptViewer);
  if (modalBackdropEl) modalBackdropEl.addEventListener('click', closeConceptViewer);

  // Modal "Start a project" — close modal then scroll to contact
  if (modalStartProject) {
    modalStartProject.addEventListener('click', () => {
      closeConceptViewer();
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          if (lenis) {
            lenis.scrollTo(contactSection, { offset: -30 });
          } else {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 200);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isModalOpen) closeConceptViewer();
      if (isMenuOpen) closeMenu();
    }
  });

  /* ============== SCROLL REVEAL (INTERSECTION OBSERVER) ============== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.is-visible)');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              const delay = Math.min(index * 50, 200);
              setTimeout(() => {
                entry.target.classList.add('is-visible');
              }, delay);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: '0px 0px -30px 0px',
        }
      );

      reveals.forEach((el) => observer.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* ============== SMOOTH ANCHOR LINKS ============== */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.length <= 1) return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(target, { offset: -30 });
          } else {
            const top = target.getBoundingClientRect().top + window.scrollY - 30;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    });
  }

  /* ============== INIT LOG ============== */
  console.log('%cAccel Enterprise — Digital Commerce Experiences', 'color:#0066FF;font-weight:600;font-size:13px;letter-spacing:0.08em;');
})();
