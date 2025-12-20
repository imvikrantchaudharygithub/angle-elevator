window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const sections = gsap.utils.toArray("[data-floor]");
  const railProgress = document.querySelector(".rail-progress");
  const heroFloorTag = document.querySelector(".hero-floor-tag");
  const floorSelector = document.querySelector(".floor-selector");
  const panelToggle = document.querySelector(".panel-toggle");
  const floorPanelNumber = document.querySelector(".panel-floor");
  const floorPanelName = document.querySelector(".panel-name");
  const floorPanelDots = document.querySelectorAll(".panel-dot");
  const doorFloorLabel = document.querySelector(".door-floor-label");

  sections.forEach((section, index) => {
    if (section.classList.contains("simulator")) {
      return;
    }
    
    gsap
      .timeline({
      scrollTrigger: {
        trigger: section,
          start: "top bottom",
          end: "top 60%",
        scrub: true,
      },
      })
      .fromTo(
      section,
        { y: 120, opacity: 0, filter: "blur(12px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
    );

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => updateFloor(section),
      onEnterBack: () => updateFloor(section),
    });
  });

  function updateFloor(section) {
    if (!section) return;
    const label = section.dataset.floorName || section.dataset.floor || "Floor";
    const floorIndex = sections.indexOf(section);
    const numericLabel =
      section.dataset.floorIndex ||
      (floorIndex >= 0 ? floorIndex.toString().padStart(2, "0") : "00");

    if (heroFloorTag) heroFloorTag.textContent = label;
    if (doorFloorLabel) doorFloorLabel.textContent = label;
    if (floorPanelNumber) floorPanelNumber.textContent = numericLabel;
    if (floorPanelName) floorPanelName.textContent = label;

    if (floorPanelDots.length) {
      floorPanelDots.forEach((dot, idx) => {
        dot.style.backgroundColor =
          idx === (floorIndex % floorPanelDots.length)
            ? getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()
            : "rgba(255,255,255,0.25)";
      });
    }

    if (railProgress && floorIndex >= 0) {
      const progress = (floorIndex + 1) / sections.length;
      railProgress.style.height = `${progress * 100}%`;
    }
  }

  const heroCab = document.querySelector(".hero-cab");
  if (heroCab) {
    gsap.to(heroCab, {
      rotateY: 10,
      rotateX: -8,
      yPercent: -15,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  const cards = document.querySelectorAll(".holo-card, .spec-grid article, .quote-grid article");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => tilt(card, event));
    card.addEventListener("mouseleave", () => resetTilt(card));
  });

  function tilt(card, event) {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    gsap.to(card, { rotateX: -y, rotateY: x, duration: 0.4 });
  }

  function resetTilt(card) {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out" });
  }

  const mosaicFigures = gsap.utils.toArray(".mosaic figure");
  mosaicFigures.forEach((figure, idx) => {
    gsap.fromTo(
      figure,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: figure,
          start: "top 80%",
          end: "bottom 60%",
          scrub: true,
        },
      }
    );
  });

  // Timeline animation moved to statsPanorama function

  initSimulator();
  initDoorSequence();
  initCityParallax();
  heroParallax();
  deckAnimations();
  storiesMotion();
  statsPanorama();
  floorFlow();
  initFloorSelector();
  immersiveBoost();
  holoCardsDepth();
  contactFormDepth();
  mosaicDepth();
  heroVisualDepth();
  navDepth();
  heroCopyDepth();
  specGridDepth();
  initVideoSlider();
  initFloorNavButtons();

  function initSimulator() {
    const simulator = document.querySelector(".simulator-viewport");
    const cab = document.querySelector(".sim-cab");
    if (!simulator || !cab) return;

    const gridLayer = document.querySelector(".sim-layer.grid");
    const particles = document.querySelector(".sim-layer.particles");
    const modeEl = document.querySelector(".sim-mode");
    const velocityEl = document.querySelector(".sim-velocity");
    const ambientEl = document.querySelector(".sim-ambient");
    const diagnosticsEl = document.querySelector(".sim-diagnostics");

    const simStates = [
      { progress: 0, mode: "Feather Glide", velocity: "0.3 m/s", ambient: "Lunar dusk", diagnostics: "All systems green" },
      { progress: 0.33, mode: "Skyline Drift", velocity: "0.8 m/s", ambient: "Prismatic dawn", diagnostics: "Energy reclaim 12%" },
      { progress: 0.66, mode: "Helix Sprint", velocity: "1.5 m/s", ambient: "Solar bloom", diagnostics: "Guardian AI engaged" },
      { progress: 1, mode: "Cloud Dock", velocity: "0.0 m/s", ambient: "Stratosphere calm", diagnostics: "Doors opening" },
    ];

    let currentState = -1;

    ScrollTrigger.matchMedia({
      "(min-width: 961px)": () => {
        if (!cab || !gridLayer || !particles) return;
        
        gsap.set([cab, particles], { clearProps: "transform" });
        
        const simTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".simulator",
            start: "top 20%",
            end: "+=100%",
            scrub: true,
            onUpdate: ({ progress }) => updateSimState(progress),
          },
        });

        simTimeline.fromTo(cab, 
          { y: "0%" }, 
          { y: "-250%", ease: "none", force3D: true }
        );
        simTimeline.fromTo(gridLayer, 
          { backgroundPositionY: "0px" }, 
          { backgroundPositionY: "-280px", ease: "none", force3D: true }, 
          0
        );
        simTimeline.fromTo(particles, 
          { y: "0%" }, 
          { y: "-40%", ease: "none", force3D: true }, 
          0
        );

        return () => simTimeline.kill();
      },
      "(max-width: 767px)": () => {
        const simTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".simulator",
            start: "top 20%",
            end: "+=140%",
            scrub: true,
            onUpdate: ({ progress }) => updateSimState(progress),
          },
        });

        simTimeline.to(cab, { yPercent: -180, ease: "none" });
        simTimeline.to(gridLayer, { backgroundPositionY: -140, ease: "none" }, 0);
        simTimeline.to(particles, { yPercent: -20, ease: "none" }, 0);

        return () => simTimeline.kill();
      },
    });

    function updateSimState(progress) {
      for (let i = simStates.length - 1; i >= 0; i -= 1) {
        if (progress >= simStates[i].progress) {
          if (currentState !== i) {
            currentState = i;
            const state = simStates[i];
            if (modeEl) modeEl.textContent = state.mode;
            if (velocityEl) velocityEl.textContent = state.velocity;
            if (ambientEl) ambientEl.textContent = state.ambient;
            if (diagnosticsEl) diagnosticsEl.textContent = state.diagnostics;
          }
          break;
        }
      }
    }
  }

  function initDoorSequence() {
    const overlay = document.querySelector(".door-overlay");
    if (!overlay) return;
    const leftDoor = overlay.querySelector(".door-left");
    const rightDoor = overlay.querySelector(".door-right");
    const dots = overlay.querySelectorAll(".indicator-dot");
    const accentColor =
      getComputedStyle(document.documentElement).getPropertyValue("--accent") || "#7cffe1";

    gsap.set([leftDoor, rightDoor], { xPercent: 0 });
    gsap.timeline({ defaults: { ease: "power3.inOut" } })
      .fromTo(
        dots,
        { backgroundColor: "rgba(255,255,255,0.15)" },
        { backgroundColor: accentColor.trim(), stagger: 0.15, duration: 0.4 }
      )
      .to(leftDoor, { xPercent: -105, duration: 1.5 }, 0.2)
      .to(rightDoor, { xPercent: 105, duration: 1.5 }, 0.2)
      .to(overlay, {
        autoAlpha: 0,
        duration: 0.6,
        pointerEvents: "none",
        onComplete: () => overlay.remove(),
      }, 1.4);
  }

  function initCityParallax() {
    const cityLayers = document.querySelectorAll(".city-layer");
    if (!cityLayers.length) return;

    cityLayers.forEach((layer, index) => {
      gsap.to(layer, {
        yPercent: -40 - index * 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=160%",
          scrub: true,
        },
      });
    });
  }

  function heroParallax() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    ScrollTrigger.matchMedia({
      "(min-width: 768px)": () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=130%",
            scrub: true,
          },
        });

        tl.to(".hero-cab", { rotateY: 18, rotateX: -6, yPercent: -12 }, 0)
          .fromTo(".hero-copy", { y: 0 }, { y: -80 }, 0)
          .fromTo(".hero-metrics", { opacity: 1 }, { opacity: 0.5, y: -40 }, 0)
          .fromTo(".hero-marquee", { y: 0 }, { y: -40 }, 0)
          .fromTo(".hero-axis", { scaleY: 1 }, { scaleY: 1.2 }, 0);

        return () => tl.kill();
      },
    });
  }

  function deckAnimations() {
    const decks = gsap.utils.toArray(".deck");
    decks.forEach((deck) => {
      const content = deck.querySelector(".deck-content");
      const media =
        deck.querySelector(".deck-media") ||
        deck.querySelector(".timeline") ||
        deck.querySelector(".spec-grid");
      const angle = (parseInt(deck.dataset.floorIndex || "0", 10) % 2 === 0 ? 1 : -1) * 6;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: deck,
          start: "top 80%",
          end: "bottom 45%",
          scrub: true,
        },
      });

      if (content) {
        tl.fromTo(
          content,
          { y: 80, opacity: 0, rotateX: 6, rotateY: angle },
          { y: 0, opacity: 1, rotateX: 0, rotateY: 0, duration: 1 }
        );
      }

      if (media) {
        tl.fromTo(
          media,
          { y: 120, opacity: 0, rotateX: -6, rotateY: -angle },
          { y: 0, opacity: 1, rotateX: 0, rotateY: 0, duration: 1 },
          0.05
        );
      }
    });
  }

  function storiesMotion() {
    const stories = document.querySelector(".stories");
    if (!stories) return;

    const mediaHero = stories.querySelector(".media-hero iframe");
    if (mediaHero) {
      gsap.fromTo(
        mediaHero,
        { scale: 0.9, rotateX: 8, rotateY: -6 },
        {
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          scrollTrigger: {
            trigger: stories,
            start: "top 80%",
            end: "top 40%",
            scrub: true,
          },
        }
      );
    }

    const reelCards = gsap.utils.toArray(".media-reel iframe");
    if (reelCards.length) {
      gsap.from(reelCards, {
        y: 80,
        opacity: 0,
        rotateX: -8,
        rotateY: 6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".media-reel",
          start: "top 85%",
          end: "bottom 60%",
          scrub: true,
        },
      });
    }

    const quoteCards = gsap.utils.toArray(".quote-grid article");
    if (quoteCards.length) {
      gsap.from(quoteCards, {
        y: 60,
        opacity: 0,
        rotateX: 10,
        rotateY: -8,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".quote-grid",
          start: "top 80%",
          once: true,
        },
      });
    }
  }

  function statsPanorama() {
    const specCards = gsap.utils.toArray(".spec-grid article");
    if (specCards.length) {
      gsap.from(specCards, {
        y: 70,
        opacity: 0,
        rotateY: -10,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".spec-grid",
          start: "top 85%",
          once: true,
        },
      });
    }

    const timelineSteps = gsap.utils.toArray(".timeline-step");
    if (timelineSteps.length) {
      gsap.from(timelineSteps, {
        xPercent: -12,
        opacity: 0,
        rotateY: 8,
        stagger: 0.12,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 90%",
          once: true,
        },
      });
    }
  }

  function floorFlow() {
    sections.forEach((section) => {
      const label = section.querySelector(".floor-label");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 40%",
          scrub: true,
        },
      });

      tl.fromTo(
        section,
        { opacity: 0.85, scale: 0.98 },
        { opacity: 1, scale: 1 }
      );

      if (label) {
        tl.fromTo(
          label,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0
        );
      }
    });
  }

  function immersiveBoost() {
    const sim = document.querySelector(".simulator");
    const cab = document.querySelector(".sim-cab");
    const shaft = document.querySelector(".sim-shaft");
    const glow = document.querySelector(".sim-layer.glow");
    if (!sim || !cab || !shaft) return;

    ScrollTrigger.matchMedia({
      "(min-width: 768px) and (max-width: 960px)": () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sim,
            start: "top 85%",
            end: "top 30%",
            scrub: true,
          },
        });
        tl.fromTo(cab, { rotateY: -10, rotateX: 10, scale: 0.9 }, { rotateY: 0, rotateX: 0, scale: 1, ease: "power3.out" })
          .fromTo(shaft, { scaleY: 0.8, opacity: 0.6 }, { scaleY: 1, opacity: 1 }, 0)
          .fromTo(glow, { opacity: 0.4, scale: 0.9 }, { opacity: 0.9, scale: 1.05 }, 0);
        return () => tl.kill();
      },
      "(max-width: 767px)": () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sim,
            start: "top 90%",
            end: "top 50%",
            scrub: true,
          },
        });
        tl.fromTo(cab, { rotateY: -8, rotateX: 8, scale: 0.94 }, { rotateY: 0, rotateX: 0, scale: 1, ease: "power3.out" })
          .fromTo(shaft, { scaleY: 0.85, opacity: 0.7 }, { scaleY: 1, opacity: 1 }, 0);
        return () => tl.kill();
      },
    });
  }

  function holoCardsDepth() {
    const holoCards = gsap.utils.toArray(".holo-card");
    if (!holoCards.length) return;

    holoCards.forEach((card, index) => {
      const angle = (index % 2 === 0 ? 1 : -1) * 15;
      
      gsap.fromTo(
        card,
        { 
          y: 100, 
          opacity: 0, 
          rotateX: 20, 
          rotateY: angle,
          scale: 0.85,
          transformPerspective: 1000
        },
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0, 
          rotateY: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        }
      );
    });
  }

  function contactFormDepth() {
    const contactCard = document.querySelector(".contact-card");
    const contactForm = document.querySelector(".contact-form");
    if (!contactCard && !contactForm) return;

    if (contactCard) {
      gsap.fromTo(
        contactCard,
        { 
          y: 120, 
          opacity: 0, 
          rotateX: 15, 
          rotateY: -12,
          scale: 0.9,
          transformPerspective: 1200
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-slab",
            start: "top 75%",
            once: true,
          },
        }
      );
    }

    if (contactForm) {
      const formElements = gsap.utils.toArray(".contact-form label, .contact-form button");
      gsap.from(formElements, {
        y: 80,
        opacity: 0,
        rotateX: 12,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
        transformPerspective: 1000,
        scrollTrigger: {
          trigger: contactForm,
          start: "top 80%",
          once: true,
        },
      });
    }
  }

  function mosaicDepth() {
    const mosaicSections = gsap.utils.toArray(".mosaic");
    mosaicSections.forEach((mosaic) => {
      const figures = gsap.utils.toArray(mosaic.querySelectorAll("figure"));
      
      figures.forEach((figure, index) => {
        const angleX = (index % 2 === 0 ? 1 : -1) * 18;
        const angleY = ((index + 1) % 3 === 0 ? 1 : -1) * 12;
        
        gsap.fromTo(
          figure,
          { 
            scale: 0.75, 
            opacity: 0,
            rotateX: angleX,
            rotateY: angleY,
            z: -100,
            transformPerspective: 1500
          },
          {
            scale: 1,
            opacity: 1,
            rotateX: 0,
            rotateY: 0,
            z: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: figure,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    });
  }

  function heroVisualDepth() {
    const heroVisual = document.querySelector(".hero-visual");
    const heroGlow = document.querySelector(".hero-glow");
    const heroFloorTag = document.querySelector(".hero-floor-tag");
    const heroAside = document.querySelector(".hero-aside");

    if (heroVisual) {
      gsap.fromTo(
        heroVisual,
        { 
          scale: 0.85, 
          opacity: 0,
          rotateX: 25,
          rotateY: 15,
          z: -200,
          transformPerspective: 2000
        },
        {
          scale: 1,
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          z: 0,
          duration: 1.8,
          ease: "power4.out",
          delay: 0.5
        }
      );
    }

    if (heroGlow) {
      gsap.fromTo(
        heroGlow,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1.2,
          opacity: 0.8,
          duration: 2.5,
          ease: "power2.out",
          delay: 0.8
        }
      );
    }

    if (heroFloorTag) {
      gsap.fromTo(
        heroFloorTag,
        { y: 50, opacity: 0, rotateX: 20 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
          delay: 1.2
        }
      );
    }

    if (heroAside) {
      const asideItems = gsap.utils.toArray(heroAside.querySelectorAll("div"));
      gsap.from(asideItems, {
        x: 40,
        opacity: 0,
        rotateY: 15,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        delay: 1.4
      });
    }
  }

  function navDepth() {
    const nav = document.querySelector(".nav");
    if (!nav) return;

    const logo = nav.querySelector(".logo");
    const navLinks = gsap.utils.toArray(".nav-links a");
    const ctaButton = nav.querySelector(".cta");

    if (logo) {
      gsap.fromTo(
        logo,
        { x: -80, opacity: 0, rotateY: -25 },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1.2,
          ease: "power4.out",
          delay: 0.3
        }
      );
    }

    if (navLinks.length) {
      gsap.from(navLinks, {
        y: -40,
        opacity: 0,
        rotateX: -20,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.6
      });
    }

    if (ctaButton) {
      gsap.fromTo(
        ctaButton,
        { x: 60, opacity: 0, rotateY: 25, scale: 0.9 },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.9
        }
      );
    }
  }

  function heroCopyDepth() {
    const heroCopy = document.querySelector(".hero-copy");
    const heroFootnote = document.querySelector(".hero-footnote");
    const heroMarquee = document.querySelector(".hero-marquee");

    if (heroCopy) {
      const eyebrow = heroCopy.querySelector(".eyebrow");
      const h1 = heroCopy.querySelector("h1");
      const p = heroCopy.querySelector("p");
      const actions = heroCopy.querySelector(".hero-actions");
      const metrics = heroCopy.querySelector(".hero-metrics");

      if (eyebrow) {
        gsap.fromTo(
          eyebrow,
          { y: -30, opacity: 0, rotateX: -15 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.4
          }
        );
      }

      if (h1) {
        gsap.fromTo(
          h1,
          { y: 60, opacity: 0, rotateX: 15, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 1.4,
            ease: "power4.out",
            delay: 0.6
          }
        );
      }

      if (p) {
        gsap.fromTo(
          p,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.9
          }
        );
      }

      if (actions) {
        const buttons = gsap.utils.toArray(actions.querySelectorAll(".cta"));
        gsap.from(buttons, {
          y: 50,
          opacity: 0,
          rotateX: 20,
          scale: 0.9,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
          delay: 1.1
        });
      }

      if (metrics) {
        const metricItems = gsap.utils.toArray(metrics.querySelectorAll("div"));
        gsap.from(metricItems, {
          y: 40,
          opacity: 0,
          rotateY: -15,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          delay: 1.3
        });
      }
    }

    if (heroFootnote) {
      const footnoteItems = gsap.utils.toArray(heroFootnote.querySelectorAll("div"));
      gsap.from(footnoteItems, {
        y: 50,
        opacity: 0,
        rotateX: 18,
        stagger: 0.1,
        duration: 1.1,
        ease: "power3.out",
        delay: 1.5
      });
    }

    if (heroMarquee) {
      const marqueeItems = gsap.utils.toArray(heroMarquee.querySelectorAll("span"));
      gsap.from(marqueeItems, {
        x: -60,
        opacity: 0,
        rotateY: -20,
        stagger: 0.08,
        duration: 1.2,
        ease: "power3.out",
        delay: 1.7
      });
    }
  }

  function specGridDepth() {
    const specGrid = document.querySelector(".spec-grid");
    if (!specGrid) return;

    const specs = gsap.utils.toArray(specGrid.querySelectorAll("article"));
    
    // Set initial positions to prevent overlap
    gsap.set(specs, {
      y: 0,
      opacity: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 0.95,
      force3D: true
    });
    
    specs.forEach((spec, index) => {
      const angleY = (index % 2 === 0 ? 1 : -1) * 15;
      
      gsap.fromTo(
        spec,
        { 
          y: 40, 
          opacity: 0,
          rotateX: 8,
          rotateY: angleY,
          scale: 0.95,
          transformPerspective: 1200,
          force3D: true,
          immediateRender: false
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          force3D: true,
          scrollTrigger: {
            trigger: specGrid,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
            refreshPriority: -1,
            markers: false
          },
        }
      );
    });
  }

  function initFloorSelector() {
    if (!floorSelector || !panelToggle) return;

    floorSelector.innerHTML = "";
    sections.forEach((section) => {
      const button = document.createElement("button");
      const label = section.dataset.floorName || section.dataset.floor || "Floor";
      const numeric =
        section.dataset.floorIndex ||
        sections.indexOf(section).toString().padStart(2, "0");

      button.textContent = `${numeric} · ${label}`;
      button.addEventListener("click", () => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        toggleSelector(false);
      });
      floorSelector.appendChild(button);
    });

    panelToggle.addEventListener("click", () => {
      const expanded = panelToggle.getAttribute("aria-expanded") === "true";
      toggleSelector(!expanded);
    });

    function toggleSelector(open) {
      panelToggle.setAttribute("aria-expanded", open);
      floorSelector.hidden = !open;
      floorSelector.classList.toggle("open", open);
    }

    toggleSelector(false);
  }

  function initVideoSlider() {
    const track = document.querySelector(".shorts-track");
    const prevBtn = document.querySelector(".slider-prev");
    const nextBtn = document.querySelector(".slider-next");
    const slider = document.querySelector(".shorts-slider");
    
    if (!track || !prevBtn || !nextBtn || !slider) return;
    
    const slides = track.querySelectorAll(".short-slide");
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Touch swipe variables
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    function updateSlider() {
      const translateX = -currentIndex * 100;
      track.style.transform = `translateX(${translateX}%)`;
      
      // Update button states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === totalSlides - 1;
    }
    
    function goToSlide(index) {
      if (index >= 0 && index < totalSlides) {
        currentIndex = index;
        updateSlider();
      }
    }
    
    function nextSlide() {
      goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
      goToSlide(currentIndex - 1);
    }
    
    // Button click handlers
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);
    
    // Touch swipe handlers
    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });
    
    slider.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });
    
    slider.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      
      const diff = startX - currentX;
      const threshold = 50; // Minimum swipe distance
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // Swiped left - go to next
          nextSlide();
        } else {
          // Swiped right - go to previous
          prevSlide();
        }
      }
      
      startX = 0;
      currentX = 0;
    });
    
    // Mouse drag handlers for desktop
    let mouseDown = false;
    let startMouseX = 0;
    
    slider.addEventListener("mousedown", (e) => {
      mouseDown = true;
      startMouseX = e.clientX;
      slider.style.cursor = "grabbing";
    });
    
    slider.addEventListener("mousemove", (e) => {
      if (!mouseDown) return;
      e.preventDefault();
    });
    
    slider.addEventListener("mouseup", (e) => {
      if (!mouseDown) return;
      mouseDown = false;
      slider.style.cursor = "grab";
      
      const diff = startMouseX - e.clientX;
      const threshold = 50;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    });
    
    slider.addEventListener("mouseleave", () => {
      if (mouseDown) {
        mouseDown = false;
        slider.style.cursor = "grab";
      }
    });
    
    slider.style.cursor = "grab";
    
    // Initialize
    updateSlider();
  }

  function initFloorNavButtons() {
    const upBtn = document.querySelector(".floor-up");
    const downBtn = document.querySelector(".floor-down");
    
    if (!upBtn || !downBtn || !sections.length) return;
    
    let currentSectionIndex = 0;
    
    function getCurrentSectionIndex() {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        
        if (scrollPosition >= sectionTop) {
          return i;
        }
      }
      return 0;
    }
    
    function updateButtonStates() {
      currentSectionIndex = getCurrentSectionIndex();
      upBtn.disabled = currentSectionIndex === 0;
      downBtn.disabled = currentSectionIndex === sections.length - 1;
    }
    
    function scrollToSection(index) {
      if (index >= 0 && index < sections.length) {
        sections[index].scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
        
        setTimeout(updateButtonStates, 600);
      }
    }
    
    upBtn.addEventListener("click", () => {
      const targetIndex = getCurrentSectionIndex() - 1;
      if (targetIndex >= 0) {
        scrollToSection(targetIndex);
      }
    });
    
    downBtn.addEventListener("click", () => {
      const targetIndex = getCurrentSectionIndex() + 1;
      if (targetIndex < sections.length) {
        scrollToSection(targetIndex);
      }
    });
    
    window.addEventListener("scroll", updateButtonStates, { passive: true });
    
    updateButtonStates();
  }
});
