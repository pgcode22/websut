// script2.js

(function () {
  'use strict';

  /* ============== LENIS SMOOTH SCROLL ============== */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      if (lenis) lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ============== STICKY NAV SCROLL STATE ============== */
  const navInner = document.getElementById('nav-inner');
  const heroSection = document.querySelector('section.hero');

  function handleNavScroll() {
    if (!navInner) return;
    const heroHeight = heroSection ? (heroSection.offsetHeight - 140) : 450;

    if (window.scrollY > 30) {
      navInner.classList.add('is-scrolled');
    } else {
      navInner.classList.remove('is-scrolled');
    }

    if (window.scrollY > heroHeight) {
      navInner.classList.add('is-past-hero');
    } else {
      navInner.classList.remove('is-past-hero');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ============== MOBILE MENU ============== */
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('close-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const backdrop = mobileMenu ? mobileMenu.querySelector('.menu-backdrop') : null;
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
    }, 500);
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* ============== PRODUCT QUICK VIEW MODAL ============== */
  const productsData = {
    aura: {
      name: "AURA",
      category: "Featured Concept · Beauty",
      price: "$88.00",
      rating: "★ 4.9 (128 reviews)",
      image: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=1000&q=80",
      tagline: "Effortless, radiant skin hydration",
      description: "A minimal product experience designed to make premium beauty feel effortless. Formulated with rare botanical extracts and triple-weight hyaluronic acid for deep cell renewal and natural radiance.",
      specs: [
        "50ml / 1.7 fl. oz. frosted glass pump bottle",
        "Dermatologically tested & 100% organic",
        "Fragrance-free & cruelty-free formula",
        "Refillable glass container system"
      ],
      badge: "In Stock · Ready to Ship"
    },
    noma: {
      name: "NOMA",
      category: "Featured Concept · Lifestyle",
      price: "$349.00",
      rating: "★ 5.0 (94 reviews)",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      tagline: "Pure acoustic precision & quiet luxury",
      description: "Premium consumer electronics framed as a quiet object of design rather than a device. Features adaptive hybrid noise-cancellation, custom 40mm titanium drivers, and 40-hour lossless battery performance.",
      specs: [
        "Adaptive Active Noise Cancellation (ANC)",
        "Custom 40mm titanium acoustic drivers",
        "40-hour playback with Fast USB-C Charge",
        "Anodized aluminum & memory foam ear cushions"
      ],
      badge: "Best Seller"
    },
    form: {
      name: "FORM",
      category: "Featured Concept · Home",
      price: "$850.00",
      rating: "★ 4.8 (46 reviews)",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80",
      tagline: "Sculptural seating for quiet interiors",
      description: "Sculptural furniture presented as quiet architecture for the modern interior. Handcrafted from sustainably harvested solid European white oak with a hand-rubbed organic oil finish.",
      specs: [
        "Solid European White Oak framework",
        "Ergonomic contoured seating profile",
        "Dimensions: 68cm W x 72cm D x 78cm H",
        "Handcrafted in limited seasonal editions"
      ],
      badge: "Limited Craft Edition"
    },
    vela: {
      name: "VELA",
      category: "Featured Concept · Wellness",
      price: "$65.00",
      rating: "★ 4.9 (210 reviews)",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=80",
      tagline: "Ritual & atmosphere fragrance",
      description: "An editorial fragrance concept built around restraint, ritual, and soft light. Infused with wild bergamot, smoked cedar, and amber resin in a hand-poured matte ceramic vessel.",
      specs: [
        "300g / 10.5 oz hand-poured soy wax",
        "65-hour clean burn duration",
        "100% organic cotton dual wick",
        "Reusable matte ceramic vessel"
      ],
      badge: "Signature Collection"
    }
  };

  const productModal = document.getElementById('product-modal');
  const modalBackdrop = productModal ? productModal.querySelector('.modal-backdrop') : null;
  const closeModalBtn = document.getElementById('close-modal');
  
  const modalImg = document.getElementById('modal-img');
  const modalBadge = document.getElementById('modal-badge');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalTagline = document.getElementById('modal-tagline');
  const modalPrice = document.getElementById('modal-price');
  const modalRating = document.getElementById('modal-rating');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpecs = document.getElementById('modal-specs');
  
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyVal = document.getElementById('qty-val');
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const addToCartText = document.getElementById('add-to-cart-text');

  let currentQty = 1;
  let isModalOpen = false;

  function openProductModal(productId) {
    const data = productsData[productId.toLowerCase()];
    if (!data || !productModal) return;

    if (modalImg) {
      modalImg.src = data.image;
      modalImg.alt = data.name;
    }
    if (modalBadge) modalBadge.textContent = data.badge;
    if (modalCategory) modalCategory.textContent = data.category;
    if (modalTitle) modalTitle.textContent = data.name;
    if (modalTagline) modalTagline.textContent = data.tagline;
    if (modalPrice) modalPrice.textContent = data.price;
    if (modalRating) modalRating.textContent = data.rating;
    if (modalDesc) modalDesc.textContent = data.description;

    if (modalSpecs) {
      modalSpecs.innerHTML = '';
      data.specs.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        modalSpecs.appendChild(li);
      });
    }

    currentQty = 1;
    if (qtyVal) qtyVal.textContent = '1';
    if (addToCartText) addToCartText.textContent = 'Purchase';

    productModal.classList.remove('hidden');
    void productModal.offsetWidth;
    productModal.classList.add('is-open');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (lenis) lenis.stop();
    isModalOpen = true;
  }

  function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove('is-open');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lenis) lenis.start();
    isModalOpen = false;

    setTimeout(() => {
      if (!isModalOpen) {
        productModal.classList.add('hidden');
      }
    }, 350);
  }

  document.querySelectorAll('[data-product-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      const productId = card.getAttribute('data-product-id');
      if (productId) openProductModal(productId);
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeProductModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProductModal);

  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        if (qtyVal) qtyVal.textContent = currentQty;
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      if (currentQty < 99) {
        currentQty++;
        if (qtyVal) qtyVal.textContent = currentQty;
      }
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      closeProductModal();
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          if (lenis) {
            lenis.scrollTo(contactSection);
          } else {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 150);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isModalOpen) closeProductModal();
      if (isMenuOpen) closeMenu();
    }
  });

  /* ============== SCROLL REVEAL ============== */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const delay = Math.min(index * 60, 240);
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ============== GSAP SCROLLTRIGGER ANIMATIONS ============== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis with GSAP ScrollTrigger
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // GSAP Staggered Character Entrance Animation for Hero Main Title (Stacked 2 Lines)
    const heroMainTitle = document.querySelector('.hero-main-title');
    if (heroMainTitle) {
      const lineAccel = heroMainTitle.querySelector('.line-accel');
      const lineEnterprise = heroMainTitle.querySelector('.line-enterprise');

      if (lineAccel && lineEnterprise) {
        // Format ACCEL
        const accelChars = Array.from(lineAccel.textContent.trim()).map(char => 
          `<span class="hero-char inline-block will-change-transform opacity-0">${char}</span>`
        ).join('');
        lineAccel.innerHTML = accelChars;

        // Format ENTERPRISE to stretch across the exact width of ACCEL
        const enterpriseChars = Array.from(lineEnterprise.textContent.trim()).map(char => 
          `<span class="hero-char inline-block will-change-transform opacity-0">${char}</span>`
        ).join('');
        lineEnterprise.innerHTML = enterpriseChars;

        const allChars = heroMainTitle.querySelectorAll('.hero-char');
        gsap.fromTo(allChars, 
          {
            y: '100%',
            opacity: 0,
            rotateX: -35,
            scale: 0.88,
            filter: 'blur(10px)'
          },
          {
            y: '0%',
            opacity: 1,
            rotateX: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.025,
            ease: 'power4.out',
            delay: 0.1
          }
        );
      }
    }

    // GSAP Animation for Testimonial Cards Stack
    const testimonialStack = document.getElementById('testimonial-stack');
    if (testimonialStack) {
      gsap.fromTo(testimonialStack,
        { y: 50, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#testimonials',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // GSAP Staggered Animation for Contact Cards
    const contactCards = document.querySelectorAll('#contact .grid > div, #contact .grid > a');
    if (contactCards.length > 0) {
      gsap.fromTo(contactCards,
        { y: 45, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }


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

  /* ============== STAGGERED TESTIMONIALS SYSTEM ============== */
  const testimonialsData = [
    {
      id: 1,
      quote: "My favorite partner for taking our online store to the next level. The difference in both presentation and performance was huge.",
      author: "Alex",
      role: "Founder",
      company: "Northstar Commerce",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      quote: "Accel Enterprise helped us turn a dated online store into something that actually feels like a serious brand.",
      author: "Sarah",
      role: "Marketing Director",
      company: "Urban Supply Co.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      quote: "We finally have an ecommerce experience that matches the quality of the products we're selling.",
      author: "Daniel",
      role: "CEO",
      company: "Meridian Goods",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      quote: "Their understanding of ecommerce goes beyond just making things look good. They actually think about the customer journey.",
      author: "Emma",
      role: "Founder",
      company: "Haven Collective",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: 5,
      quote: "Accel Enterprise made the entire process feel straightforward. We launched faster and with a much stronger online presence.",
      author: "Ryan",
      role: "Operations Lead",
      company: "Nova Retail",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: 6,
      quote: "Our online store feels completely different now. Cleaner, faster, and much easier for customers to navigate.",
      author: "Olivia",
      role: "Founder",
      company: "Maison Collective",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: 7,
      quote: "They understood what our business needed instead of forcing us into a generic template.",
      author: "Hamza",
      role: "Director",
      company: "Vertex Commerce",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: 8,
      quote: "One of the best decisions we've made for our digital storefront.",
      author: "Adam",
      role: "Founder",
      company: "Prime Market",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
    }
  ];

  const testimonialStack = document.getElementById('testimonial-stack');
  const testimonialPrev = document.getElementById('testimonial-prev');
  const testimonialNext = document.getElementById('testimonial-next');
  const testimonialCounter = document.getElementById('testimonial-counter');

  let activeTestimonialIndex = 0;
  let isTestimonialAnimating = false;
  const cardElements = [];

  function initTestimonialStack() {
    if (!testimonialStack) return;
    testimonialStack.innerHTML = '';

    testimonialsData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.setAttribute('data-index', index);

      card.innerHTML = `
        <div class="flex items-center justify-between mb-5">
          <svg class="w-8 h-8 text-accel-blue opacity-80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-full">Verified Client</span>
        </div>
        <p class="text-base sm:text-lg text-slate-800 font-medium leading-relaxed mb-6">
          "${item.quote}"
        </p>
        <div class="flex items-center gap-3.5 pt-4 border-t border-slate-100">
          <img src="${item.avatar}" alt="${item.author}" class="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm" loading="lazy" />
          <div>
            <h4 class="text-sm font-semibold text-slate-900">${item.author}</h4>
            <p class="text-xs text-slate-500 font-medium">${item.role}</p>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        if (isTestimonialAnimating) return;
        if (activeTestimonialIndex !== index) {
          goToTestimonial(index);
        }
      });

      testimonialStack.appendChild(card);
      cardElements.push(card);
    });

    updateTestimonialPositions();
  }

  function updateTestimonialPositions() {
    const isSmallScreen = window.innerWidth < 640;
    const total = testimonialsData.length;

    cardElements.forEach((card, index) => {
      let pos = index - activeTestimonialIndex;
      const half = Math.floor(total / 2);
      if (pos > half) pos -= total;
      if (pos < -half) pos += total;

      let translateX = 0;
      let translateY = 0;
      let rotate = 0;
      let scale = 1;
      let opacity = 0;
      let zIndex = 1;
      let pointerEvents = 'none';

      if (pos === 0) {
        translateX = 0;
        translateY = 0;
        rotate = 0;
        scale = 1;
        opacity = 1;
        zIndex = 10;
        pointerEvents = 'auto';
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
        if (pos === 1) {
          translateX = isSmallScreen ? 20 : 140;
          translateY = isSmallScreen ? 10 : 16;
          rotate = isSmallScreen ? 2.5 : 3.5;
          scale = 0.94;
          opacity = 0.78;
          zIndex = 8;
          pointerEvents = 'auto';
        } else if (pos === -1) {
          translateX = isSmallScreen ? -20 : -140;
          translateY = isSmallScreen ? 10 : 16;
          rotate = isSmallScreen ? -2.5 : -3.5;
          scale = 0.94;
          opacity = 0.78;
          zIndex = 8;
          pointerEvents = 'auto';
        } else if (pos === 2) {
          translateX = isSmallScreen ? 38 : 260;
          translateY = isSmallScreen ? 18 : 30;
          rotate = isSmallScreen ? 4.5 : 6;
          scale = 0.86;
          opacity = 0.42;
          zIndex = 6;
          pointerEvents = 'auto';
        } else if (pos === -2) {
          translateX = isSmallScreen ? -38 : -260;
          translateY = isSmallScreen ? 18 : 30;
          rotate = isSmallScreen ? -4.5 : -6;
          scale = 0.86;
          opacity = 0.42;
          zIndex = 6;
          pointerEvents = 'auto';
        } else {
          translateX = pos > 0 ? (isSmallScreen ? 60 : 380) : (isSmallScreen ? -60 : -380);
          translateY = 40;
          rotate = pos > 0 ? 8 : -8;
          scale = 0.75;
          opacity = 0;
          zIndex = 1;
          pointerEvents = 'none';
        }
      }

      card.style.transform = `translate3d(calc(-50% + ${translateX}px), ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`;
      card.style.zIndex = zIndex;
      card.style.opacity = opacity;
      card.style.pointerEvents = pointerEvents;
    });

    if (testimonialCounter) {
      testimonialCounter.textContent = `${String(activeTestimonialIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
  }

  function goToTestimonial(newIndex) {
    if (isTestimonialAnimating) return;
    isTestimonialAnimating = true;
    activeTestimonialIndex = (newIndex + testimonialsData.length) % testimonialsData.length;
    updateTestimonialPositions();

    setTimeout(() => {
      isTestimonialAnimating = false;
    }, 550);
  }

  if (testimonialPrev) {
    testimonialPrev.addEventListener('click', () => {
      goToTestimonial(activeTestimonialIndex - 1);
    });
  }

  if (testimonialNext) {
    testimonialNext.addEventListener('click', () => {
      goToTestimonial(activeTestimonialIndex + 1);
    });
  }

  initTestimonialStack();
  window.addEventListener('resize', updateTestimonialPositions, { passive: true });

  /* ============== ANIMATED GRADIENT FOOTER SCROLL PROGRESS ============== */
  const footerGradientLayer = document.getElementById('footer-gradient-layer');

  function updateFooterGradient() {
    if (!footerGradientLayer) return;
    const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScrollHeight <= 0) return;

    const currentScroll = window.scrollY;
    const progress = Math.min(Math.max(currentScroll / totalScrollHeight, 0), 1);
    
    const opacity = 0.35 + progress * 0.65;
    footerGradientLayer.style.opacity = opacity.toFixed(2);
  }

  window.addEventListener('scroll', updateFooterGradient, { passive: true });
  updateFooterGradient();

  /* ============== INIT ============== */
  console.log('%cAccel Enterprise — Bloom Field Pure CSS Gradient', 'color:#0066FF;font-weight:600;font-size:14px;letter-spacing:0.1em;');
})();
