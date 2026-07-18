/* ========================================================================
   EDIT THESE VALUES BEFORE PUBLISHING
   - WhatsApp number: international format, digits only, without + or spaces.
   - Empty or placeholder contact values are handled safely by the interface.
   ======================================================================== */
const SITE_CONFIG = Object.freeze({
  brandName: "OrderRise",
  restaurantDemoName: "Order rise Demo",
  whatsappNumber: "YOUR_NUMBER",
  bookingUrl: "YOUR_BOOKING_LINK",
  email: "hamzakhalilbhattibrothers@gmail.com",
  linkedinUrl: "www.linkedin.com/in/hamza-khalil-34380923a",
  fiverrUrl: "YOUR_FIVERR_URL",
  monthlyPrice: 50,
  currency: "USD"
});

(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  root.classList.add("js");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const currencySymbols = { USD: "$", EUR: "€", GBP: "£", PKR: "Rs", AED: "AED" };
  let toastTimer = null;

  const isPlaceholder = (value) => {
    if (!value || typeof value !== "string") return true;
    return /YOUR_|example\.com|REPLACE|PLACEHOLDER/i.test(value.trim());
  };

  const safeExternalUrl = (value) => {
    if (isPlaceholder(value)) return null;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
    } catch {
      return null;
    }
  };

  const validEmail = (value) => {
    if (isPlaceholder(value)) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? value.trim() : null;
  };

  const getWhatsAppUrl = () => {
    if (isPlaceholder(SITE_CONFIG.whatsappNumber)) return null;
    const digits = String(SITE_CONFIG.whatsappNumber).replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) return null;
    const message = encodeURIComponent("Hi, I would like to see the WhatsApp restaurant ordering demo.");
    return `https://wa.me/${digits}?text=${message}`;
  };

  const showToast = (message) => {
    const toast = doc.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
  };

  const applyConfiguration = () => {
    const brand = SITE_CONFIG.brandName?.trim() || "OrderRise";
    const demoName = SITE_CONFIG.restaurantDemoName?.trim() || "Restaurant Demo";
    const whatsappUrl = getWhatsAppUrl();
    const bookingUrl = safeExternalUrl(SITE_CONFIG.bookingUrl);
    const email = validEmail(SITE_CONFIG.email);
    const linkedin = safeExternalUrl(SITE_CONFIG.linkedinUrl);
    const fiverr = safeExternalUrl(SITE_CONFIG.fiverrUrl);

    doc.querySelectorAll("[data-brand-name]").forEach((element) => { element.textContent = brand; });
    doc.querySelectorAll("[data-demo-name]").forEach((element) => { element.textContent = demoName; });
    doc.querySelectorAll("[data-monthly-price]").forEach((element) => { element.textContent = String(SITE_CONFIG.monthlyPrice ?? 50); });
    doc.querySelectorAll("[data-currency-symbol]").forEach((element) => {
      element.textContent = currencySymbols[SITE_CONFIG.currency] || `${SITE_CONFIG.currency || "USD"} `;
    });
    doc.querySelectorAll("[data-current-year]").forEach((element) => { element.textContent = String(new Date().getFullYear()); });

    doc.title = `WhatsApp AI Ordering Agent for Restaurants | ${brand}`;
    const ogTitle = doc.querySelector('meta[property="og:title"]');
    const twitterTitle = doc.querySelector('meta[name="twitter:title"]');
    if (ogTitle) ogTitle.content = `WhatsApp AI Ordering Agent for Restaurants | ${brand}`;
    if (twitterTitle) twitterTitle.content = `WhatsApp AI Ordering Agent for Restaurants | ${brand}`;

    const links = { whatsapp: whatsappUrl, booking: bookingUrl };
    doc.querySelectorAll("[data-action]").forEach((link) => {
      const type = link.dataset.action;
      const destination = links[type];
      if (destination) {
        link.href = destination;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.removeAttribute("aria-disabled");
      } else {
        link.href = "#contact";
        link.setAttribute("aria-disabled", "true");
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const field = type === "whatsapp" ? "whatsappNumber" : "bookingUrl";
          showToast(`This demo link is ready for your details. Replace ${field} in SITE_CONFIG inside script.js.`);
        });
      }
    });

    const contactLinks = {
      email: email ? `mailto:${email}` : null,
      linkedin,
      fiverr
    };
    Object.entries(contactLinks).forEach(([type, destination]) => {
      const link = doc.querySelector(`[data-contact-link="${type}"]`);
      if (!link || !destination) return;
      link.href = destination;
      link.hidden = false;
      if (type !== "email") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    });
  };

  const initHeader = () => {
    const header = doc.querySelector("[data-header]");
    const menuButton = doc.querySelector("[data-menu-button]");
    const mobileMenu = doc.querySelector("[data-mobile-menu]");
    if (!header) return;

    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (!menuButton || !mobileMenu) return;
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      mobileMenu.classList.remove("is-open");
      doc.body.classList.remove("menu-open");
    };
    const openMenu = () => {
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation");
      mobileMenu.classList.add("is-open");
      doc.body.classList.add("menu-open");
    };

    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      open ? closeMenu() : openMenu();
    });
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    }, { passive: true });
  };

  const initFaq = () => {
    const buttons = [...doc.querySelectorAll(".faq-item button")];
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        const panelId = button.getAttribute("aria-controls");
        const panel = panelId ? doc.getElementById(panelId) : null;
        if (!panel) return;

        buttons.forEach((otherButton) => {
          if (otherButton === button) return;
          otherButton.setAttribute("aria-expanded", "false");
          const otherPanel = doc.getElementById(otherButton.getAttribute("aria-controls"));
          if (otherPanel) otherPanel.hidden = true;
        });

        button.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;
      });
    });
  };

  const initRevealAnimations = () => {
    const reveals = [...doc.querySelectorAll(".reveal")];
    if (!reveals.length) return;
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      reveals.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px" });
    reveals.forEach((item) => observer.observe(item));
  };

  const initWorkflow = () => {
    const workflow = doc.querySelector("[data-workflow]");
    if (!workflow) return;
    const nodes = [...workflow.querySelectorAll("[data-workflow-node]")];
    if (!nodes.length) return;

    const animate = () => {
      workflow.classList.add("is-animated");
      if (reducedMotion.matches) {
        nodes.forEach((node) => node.classList.add("is-active"));
        return;
      }
      nodes.forEach((node, index) => {
        window.setTimeout(() => node.classList.add("is-active"), index * 420);
      });
    };

    if (!("IntersectionObserver" in window)) {
      animate();
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animate();
        currentObserver.disconnect();
      }
    }, { threshold: 0.32 });
    observer.observe(workflow);
  };

  const initActiveNavigation = () => {
    if (!("IntersectionObserver" in window)) return;
    const links = [...doc.querySelectorAll(".desktop-nav a")];
    const map = new Map(links.map((link) => [link.getAttribute("href")?.slice(1), link]));
    const sections = [...map.keys()].map((id) => doc.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.remove("is-active"));
        map.get(entry.target.id)?.classList.add("is-active");
      });
    }, { rootMargin: "-35% 0px -58%", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  };

  const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));
  const waitUntilVisible = () => {
    if (!doc.hidden) return Promise.resolve();
    return new Promise((resolve) => {
      const onVisible = () => {
        if (doc.hidden) return;
        doc.removeEventListener("visibilitychange", onVisible);
        resolve();
      };
      doc.addEventListener("visibilitychange", onVisible);
    });
  };

  const initChatDemo = () => {
    const log = doc.querySelector("[data-chat-log]");
    if (!log) return;
    log.classList.add("chat-enhanced");

    const demoName = SITE_CONFIG.restaurantDemoName?.trim() || "Restaurant Demo";
    const messages = [
      { side: "customer", text: "Hi, what’s on the menu?", time: "11:02 PM", pause: 1100 },
      { side: "assistant", text: `👋 Welcome to ${demoName}!\n\nToday’s popular choices:\n\n🌮 Chicken Tacos — $5.00\n🍔 Classic Burger — $6.50\n🍟 Loaded Fries — $4.00\n🥤 Soft Drinks — $2.00\n\nWhat would you like to order?`, time: "11:02 PM", typing: 1200, pause: 1450 },
      { side: "customer", text: "2 chicken tacos and a coke", time: "11:03 PM", pause: 1150 },
      { side: "assistant", text: "Added to your cart 🛒\n\n2× Chicken Tacos\n1× Coke\n\nWould you like pickup or delivery?", time: "11:03 PM", typing: 1000, pause: 1300 },
      { side: "customer", text: "Delivery", time: "11:03 PM", pause: 1050 },
      { side: "assistant", text: "Please send your delivery address.", time: "11:03 PM", typing: 850, pause: 1050 },
      { side: "customer", text: "123 Main Street", time: "11:04 PM", pause: 1100 },
      { side: "assistant", text: "Perfect. Your total is $12.00.\n\nWould you like to pay by cash or card on delivery?", time: "11:04 PM", typing: 1050, pause: 1300 },
      { side: "customer", text: "Cash", time: "11:04 PM", pause: 1050 },
      { side: "assistant", text: "✅ Order confirmed!\n\nEstimated delivery time: 25–30 minutes.\n\nType TRACK ORDER anytime for an update.", time: "11:04 PM", typing: 1200, pause: 3100, confirmed: true }
    ];

    const dateLabel = log.querySelector(".chat-date");
    const fallback = log.querySelector(".chat-fallback");
    const clearMessages = () => {
      [...log.children].forEach((child) => {
        if (child !== dateLabel && child !== fallback) child.remove();
      });
      log.scrollTop = 0;
    };

    const addTyping = () => {
      const bubble = doc.createElement("div");
      bubble.className = "message message-assistant typing-message is-entering";
      const dots = doc.createElement("span");
      dots.className = "typing-dots";
      dots.innerHTML = "<i></i><i></i><i></i>";
      bubble.appendChild(dots);
      log.appendChild(bubble);
      log.scrollTo({ top: log.scrollHeight, behavior: reducedMotion.matches ? "auto" : "smooth" });
      return bubble;
    };

    const addMessage = (message) => {
      const bubble = doc.createElement("div");
      bubble.className = `message message-${message.side} is-entering${message.confirmed ? " confirmed" : ""}`;
      bubble.appendChild(doc.createTextNode(message.text));
      const time = doc.createElement("time");
      time.textContent = message.time;
      bubble.appendChild(time);
      log.appendChild(bubble);
      log.scrollTo({ top: log.scrollHeight, behavior: reducedMotion.matches ? "auto" : "smooth" });
    };

    if (reducedMotion.matches) {
      clearMessages();
      messages.forEach(addMessage);
      log.scrollTop = log.scrollHeight;
      return;
    }

    const run = async () => {
      while (true) {
        clearMessages();
        await wait(450);
        for (const message of messages) {
          await waitUntilVisible();
          if (message.side === "assistant") {
            const typing = addTyping();
            await wait(message.typing || 900);
            typing.remove();
          }
          addMessage(message);
          await wait(message.pause || 1100);
        }
        await wait(350);
      }
    };

    run().catch(() => {
      clearMessages();
      messages.slice(-4).forEach(addMessage);
    });
  };

  const initSmoothAnchors = () => {
    doc.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = doc.querySelector(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      });
    });
  };

  const init = () => {
    applyConfiguration();
    initHeader();
    initFaq();
    initRevealAnimations();
    initWorkflow();
    initActiveNavigation();
    initChatDemo();
    initSmoothAnchors();
  };

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
