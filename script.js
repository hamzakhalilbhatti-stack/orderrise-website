
const pillarData = {
  ordering: {
    eyebrow: "System 1",
    title: "Customers Order Naturally. Your System Handles the Complexity.",
    description:
      "WhatsApp messages become structured carts, modifiers, checkout details and tracking updates.",
    features: [
      "Natural-language ordering",
      "Menu discovery",
      "Product modifiers",
      "Cart management",
      "Pickup and delivery",
      "Payment selection",
      "Coupons",
      "Confirmation and tracking"
    ],
    name: "INTELLIGENT ORDERING",
    purpose: "Phone → AI → cart → checkout"
  },
  operations: {
    eyebrow: "System 2",
    title: "Every Team Sees Exactly What They Need.",
    description:
      "Kitchen, inventory and owner workspaces stay connected to the same order record.",
    features: [
      "Kitchen display",
      "Structured tickets",
      "Menu administration",
      "Inventory updates",
      "Receipts",
      "Open and close controls",
      "Staff workspaces"
    ],
    name: "RESTAURANT OPERATIONS",
    purpose: "Kitchen → inventory → owner control"
  },
  growth: {
    eyebrow: "System 3",
    title: "Turn Every Order Into a Customer Relationship.",
    description:
      "Customer profiles, order history, loyalty and promotions update after each completed order.",
    features: [
      "Customer CRM",
      "Order history",
      "Favorite products",
      "Customer levels",
      "Loyalty points",
      "Saved orders",
      "Promotions and coupons",
      "Repeat-order campaigns"
    ],
    name: "CUSTOMERS & GROWTH",
    purpose: "Profile → history → loyalty → reorder"
  },
  delivery: {
    eyebrow: "System 4",
    title: "Control Every Delivery From Dispatch to Completion.",
    description:
      "Drivers receive assignments and update the restaurant and customer as the order progresses.",
    features: [
      "Driver accounts",
      "Order assignment",
      "Delivery statuses",
      "Cash-on-delivery records",
      "Delivery zones",
      "Failed deliveries",
      "Returned deliveries",
      "Customer updates"
    ],
    name: "DELIVERY MANAGEMENT",
    purpose: "Assignment → status → completion"
  },
  intelligence: {
    eyebrow: "System 5",
    title: "Know What Is Happening Without Standing at the Counter.",
    description:
      "Owners review sales, products, customers, discounts and delivery performance.",
    features: [
      "Daily sales",
      "Order totals",
      "Average order value",
      "Top products",
      "Customer performance",
      "Delivery performance",
      "Discount reporting",
      "CSV and PDF exports"
    ],
    name: "OWNER INTELLIGENCE",
    purpose: "Orders → metrics → decisions"
  }
};

function call3D(method, ...args) {
  if (
    window.OrderRise3D &&
    typeof window.OrderRise3D[method] === "function"
  ) {
    window.OrderRise3D[method](...args);
    return;
  }

  window.__orderRisePending3D =
    window.__orderRisePending3D || {};

  window.__orderRisePending3D[method] = args;
}

function initMenu() {
  const button = document.getElementById("menuButton");
  const navigation = document.getElementById("mainNavigation");

  if (!button || !navigation) {
    return;
  }

  button.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");

    document.body.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute(
      "aria-label",
      open ? "Close menu" : "Open menu"
    );
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      document.body.classList.remove("menu-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open menu");
    });
  });
}

function initProgress() {
  const bar = document.getElementById("scrollProgress");

  if (!bar) {
    return;
  }

  function update() {
    const maximum =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percentage =
      maximum > 0
        ? Math.min(100, (window.scrollY / maximum) * 100)
        : 0;

    bar.style.width = `${percentage}%`;
  }

  update();

  window.addEventListener("scroll", update, {
    passive: true
  });

  window.addEventListener("resize", update);
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");

  elements.forEach((element) => {
    element.style.setProperty(
      "--reveal-delay",
      `${Number(element.dataset.delay || 0)}ms`
    );
  });

  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches ||
    !("IntersectionObserver" in window)
  ) {
    elements.forEach((element) => {
      element.classList.add("visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -45px"
    }
  );

  elements.forEach((element) => observer.observe(element));
}

function initTilt() {
  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches ||
    window.matchMedia("(pointer: coarse)").matches
  ) {
    return;
  }

  document
    .querySelectorAll(".tilt-card")
    .forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rectangle =
          card.getBoundingClientRect();

        const x =
          (event.clientX - rectangle.left) /
            rectangle.width -
          0.5;

        const y =
          (event.clientY - rectangle.top) /
            rectangle.height -
          0.5;

        card.style.transform =
          `perspective(850px) ` +
          `rotateX(${-y * 7}deg) ` +
          `rotateY(${x * 9}deg) ` +
          "translateY(-3px)";
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
}

function initHeroControls() {
  const controls =
    document.querySelectorAll("[data-hero-focus]");

  controls.forEach((button) => {
    button.addEventListener("click", () => {
      controls.forEach((item) => {
        item.classList.toggle(
          "active",
          item === button
        );
      });

      call3D(
        "focusHero",
        button.dataset.heroFocus
      );
    });
  });

  const sound =
    document.getElementById("soundToggle");

  if (!sound) {
    return;
  }

  sound.addEventListener("click", () => {
    const enabled =
      sound.getAttribute("aria-pressed") !==
      "true";

    sound.setAttribute(
      "aria-pressed",
      String(enabled)
    );

    sound.textContent =
      enabled ? "Sound on" : "Sound off";

    call3D("setSound", enabled);
  });
}

function updatePillar(key) {
  const data = pillarData[key];

  if (!data) {
    return;
  }

  const eyebrow =
    document.getElementById("pillarEyebrow");

  const title =
    document.getElementById("pillarTitle");

  const description =
    document.getElementById(
      "pillarDescription"
    );

  const features =
    document.getElementById("pillarFeatures");

  const sceneName =
    document.getElementById("pillarSceneName");

  const scenePurpose =
    document.getElementById(
      "pillarScenePurpose"
    );

  if (eyebrow) {
    eyebrow.textContent = data.eyebrow;
  }

  if (title) {
    title.textContent = data.title;
  }

  if (description) {
    description.textContent = data.description;
  }

  if (features) {
    features.innerHTML = data.features
      .map((feature) => `<li>${feature}</li>`)
      .join("");
  }

  if (sceneName) {
    sceneName.textContent = data.name;
  }

  if (scenePurpose) {
    scenePurpose.textContent = data.purpose;
  }

  document
    .querySelectorAll("[data-pillar]")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.pillar === key
      );
    });
}

function initPillars() {
  const buttons =
    document.querySelectorAll("[data-pillar]");

  if (!buttons.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      updatePillar(button.dataset.pillar);
    });
  });

  updatePillar("ordering");
}

function numberValue(id, fallback = 0) {
  const value = Number(
    document.getElementById(id)?.value
  );

  return Number.isFinite(value)
    ? value
    : fallback;
}

function calculateRoi() {
  const dailyOrders = Math.max(
    0,
    numberValue("dailyOrders")
  );

  const averageOrderValue = Math.max(
    0,
    numberValue("averageOrderValue")
  );

  const missedPercentage = Math.min(
    100,
    Math.max(
      0,
      numberValue("missedPercentage")
    )
  );

  const locations = Math.max(
    1,
    numberValue("locations", 1)
  );

  const recoveredOrders =
    dailyOrders *
    30 *
    locations *
    (missedPercentage / 100);

  const recoveredRevenue =
    recoveredOrders * averageOrderValue;

  const savedHours =
    (recoveredOrders * 4) / 60;

  const ordersElement =
    document.getElementById(
      "recoveredOrders"
    );

  const revenueElement =
    document.getElementById(
      "recoveredRevenue"
    );

  const hoursElement =
    document.getElementById("hoursSaved");

  if (ordersElement) {
    ordersElement.textContent =
      Math.round(
        recoveredOrders
      ).toLocaleString();
  }

  if (revenueElement) {
    revenueElement.textContent =
      `PKR ${Math.round(
        recoveredRevenue
      ).toLocaleString()}`;
  }

  if (hoursElement) {
    hoursElement.textContent =
      `${Math.round(
        savedHours
      ).toLocaleString()} hours`;
  }
}

function initRoi() {
  const ids = [
    "dailyOrders",
    "averageOrderValue",
    "missedPercentage",
    "locations"
  ];

  ids.forEach((id) => {
    document
      .getElementById(id)
      ?.addEventListener(
        "input",
        calculateRoi
      );
  });

  if (
    document.getElementById(
      "recoveredOrders"
    )
  ) {
    calculateRoi();
  }
}

function initFaq() {
  document
    .querySelectorAll(".faq-item button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const currentItem =
          button.closest(".faq-item");

        const currentAnswer =
          currentItem?.querySelector(
            ".faq-answer"
          );

        const currentlyOpen =
          button.getAttribute(
            "aria-expanded"
          ) === "true";

        document
          .querySelectorAll(
            ".faq-item button"
          )
          .forEach((otherButton) => {
            const otherItem =
              otherButton.closest(
                ".faq-item"
              );

            const otherAnswer =
              otherItem?.querySelector(
                ".faq-answer"
              );

            const icon =
              otherButton.querySelector("span");

            otherButton.setAttribute(
              "aria-expanded",
              "false"
            );

            if (otherAnswer) {
              otherAnswer.hidden = true;
            }

            if (icon) {
              icon.textContent = "+";
            }
          });

        if (
          !currentlyOpen &&
          currentAnswer
        ) {
          button.setAttribute(
            "aria-expanded",
            "true"
          );

          currentAnswer.hidden = false;

          const icon =
            button.querySelector("span");

          if (icon) {
            icon.textContent = "−";
          }
        }
      });
    });
}

function initForm() {
  const form =
    document.getElementById("demoForm");

  const success =
    document.getElementById(
      "successMessage"
    );

  if (!form || !success) {
    return;
  }

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      success.classList.add("show");

      success.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });

      form.reset();
    }
  );
}

function initMiniWhatsAppDemo() {
  const chatLog =
    document.getElementById("miniChatLog");

  const quickReplies =
    document.getElementById(
      "miniQuickReplies"
    );

  const typing =
    document.getElementById("miniTyping");

  const resetButton =
    document.getElementById(
      "miniResetDemo"
    );

  if (
    !chatLog ||
    !quickReplies ||
    !typing ||
    !resetButton
  ) {
    return;
  }

  const menu = {
    "zinger burger": {
      name: "Zinger Burger",
      price: 700
    }
  };

  const initialRevenue = 18400;

  let cart = [];
  let couponRate = 0;
  let deliveryMode = "";
  let deliveryFee = 0;
  let ticketNumber = "";
  let orderConfirmed = false;
  let isResponding = false;

  const flows = [
    {
      label: "Show me the menu",
      progress: 12,
      progressLabel: "Menu displayed",
      category: "MENU DISCOVERY",
      title:
        "OrderRise presents a structured menu inside WhatsApp.",
      explanation:
        "The customer can browse without downloading another application.",
      response:
        "Here’s today’s menu: 🍔 Chicken Burger — Rs 650 · 🌶️ Zinger Burger — Rs 700 · 🍟 Fries — Rs 250 · 🥤 Coke — Rs 150.",
      action() {}
    },
    {
      label: "Add two zinger burgers",
      progress: 34,
      progressLabel: "Cart created",
      category: "CART MANAGEMENT",
      title:
        "Two products become a structured cart.",
      explanation:
        "OrderRise understands the product and quantity, calculates the subtotal and reserves stock.",
      response:
        "Added 2× Zinger Burger. The estimated subtotal is Rs 1,400.",
      action() {
        addToCart("zinger burger", 2);
        setStatus(
          "miniStatStock",
          "22 burgers reserved"
        );
      }
    },
    {
      label: "Make one spicy",
      progress: 45,
      progressLabel: "Modifier understood",
      category: "ORDER MODIFIER",
      title:
        "The instruction is attached to the correct item.",
      explanation:
        "The kitchen-ready order now includes one extra-spicy burger.",
      response:
        "Got it — one Zinger Burger is marked extra spicy 🌶️.",
      action() {
        const burger = cart.find(
          (item) =>
            item.key === "zinger burger"
        );

        if (!burger) {
          botSay(
            "Add the burgers first, then I can make one spicy."
          );

          return false;
        }

        burger.modifier =
          "1 burger: extra spicy";

        renderCart();
        return true;
      }
    },
    {
      label: "Apply SAVE10",
      progress: 56,
      progressLabel: "Coupon validated",
      category: "PROMOTION",
      title:
        "The discount is applied consistently.",
      explanation:
        "OrderRise validates SAVE10 and recalculates the final total.",
      response:
        "Coupon SAVE10 applied — you received 10% off 🎉.",
      action() {
        if (!cart.length) {
          botSay(
            "Your cart is empty. Add an item before applying SAVE10."
          );

          return false;
        }

        couponRate = 0.1;
        renderCart();
        return true;
      }
    },
    {
      label: "I want delivery",
      progress: 68,
      progressLabel: "Delivery selected",
      category: "FULFILLMENT",
      title:
        "The order enters the delivery workflow.",
      explanation:
        "OrderRise prepares address collection, adds the delivery fee and marks driver assignment as pending.",
      response:
        "Delivery selected. A Rs 150 delivery fee was added.",
      action() {
        deliveryMode = "Delivery";
        deliveryFee = 150;

        document.getElementById(
          "miniDeliveryMode"
        ).textContent =
          "Delivery selected · Rs 150 fee";

        setStatus(
          "miniStatDriver",
          "Pending address"
        );

        renderCart();
        return true;
      }
    },
    {
      label: "Confirm order",
      progress: 88,
      progressLabel: "Kitchen preparing",
      category: "ORDER CONFIRMATION",
      title:
        "A kitchen ticket is created and work begins.",
      explanation:
        "The cart becomes ticket #1042, inventory is updated and a driver is assigned.",
      response:
        "Order confirmed ✅ Ticket #1042 was sent to the kitchen. Estimated time: 18 minutes.",
      action() {
        if (!cart.length) {
          botSay(
            "Your cart is empty — add something before confirming."
          );

          return false;
        }

        ticketNumber = "1042";
        orderConfirmed = true;

        setStatus(
          "miniStatTicket",
          "#1042 · Preparing"
        );

        setStatus(
          "miniStatStock",
          "Inventory updated"
        );

        setStatus(
          "miniStatDriver",
          deliveryMode
            ? "Assigned · Ali K."
            : "Pickup order"
        );

        updateRevenue();
        return true;
      }
    },
    {
      label: "Track my order",
      progress: 100,
      progressLabel: "Order in progress",
      category: "CUSTOMER UPDATE",
      title:
        "The customer receives status without calling staff.",
      explanation:
        "OrderRise reads the active ticket and returns the current preparation or delivery status.",
      response:
        "Order #1042 is being prepared. Estimated time: 18 minutes. We’ll message you when it leaves the restaurant.",
      action() {
        if (
          !ticketNumber ||
          !orderConfirmed
        ) {
          botSay(
            "There is no active order yet. Confirm your order first."
          );

          return false;
        }

        setStatus(
          "miniStatDriver",
          deliveryMode
            ? "Ali K. · Ready soon"
            : "Pickup · Ready soon"
        );

        return true;
      }
    }
  ];

  function formatMoney(value) {
    return `Rs ${Math.round(
      value
    ).toLocaleString()}`;
  }

  function subtotal() {
    return cart.reduce(
      (total, item) =>
        total + item.price * item.qty,
      0
    );
  }

  function discount() {
    return subtotal() * couponRate;
  }

  function orderTotal() {
    return (
      subtotal() -
      discount() +
      deliveryFee
    );
  }

  function addToCart(key, quantity) {
    const product = menu[key];

    const existing = cart.find(
      (item) => item.key === key
    );

    if (!product) {
      return;
    }

    if (existing) {
      existing.qty += quantity;
    } else {
      cart.push({
        key,
        name: product.name,
        price: product.price,
        qty: quantity,
        modifier: ""
      });
    }

    renderCart();
  }

  function renderCart() {
    const lines =
      document.getElementById(
        "miniCartLines"
      );

    const total =
      document.getElementById(
        "miniCartTotal"
      );

    const value =
      document.getElementById(
        "miniCartTotalValue"
      );

    if (!lines || !total || !value) {
      return;
    }

    if (!cart.length) {
      lines.innerHTML =
        '<div class="mini-cart-empty">No items yet — try “Show me the menu”.</div>';

      total.hidden = true;
      return;
    }

    const rows = cart.map((item) => {
      const modifier = item.modifier
        ? `<small class="mini-cart-modifier">${item.modifier}</small>`
        : "";

      return `
        <div class="mini-cart-line">
          <span>
            ${item.qty}× ${item.name}
            ${modifier}
          </span>
          <strong>
            ${formatMoney(
              item.price * item.qty
            )}
          </strong>
        </div>
      `;
    });

    if (couponRate) {
      rows.push(`
        <div class="mini-cart-line">
          <span>SAVE10 discount</span>
          <strong>
            −${formatMoney(discount())}
          </strong>
        </div>
      `);
    }

    if (deliveryFee) {
      rows.push(`
        <div class="mini-cart-line">
          <span>Delivery fee</span>
          <strong>
            ${formatMoney(deliveryFee)}
          </strong>
        </div>
      `);
    }

    lines.innerHTML = rows.join("");
    total.hidden = false;
    value.textContent =
      formatMoney(orderTotal());
  }

  function addBubble(text, sender) {
    const bubble =
      document.createElement("div");

    bubble.className =
      sender === "user"
        ? "mini-bubble mini-user"
        : "mini-bubble mini-bot";

    bubble.textContent = text;
    chatLog.appendChild(bubble);
    chatLog.scrollTop =
      chatLog.scrollHeight;
  }

  function botSay(text) {
    addBubble(text, "bot");
  }

  function userSay(text) {
    addBubble(text, "user");
  }

  function setStatus(id, value) {
    const element =
      document.getElementById(id);

    if (!element) {
      return;
    }

    element.textContent = value;
    element.classList.add("on");
  }

  function updateRevenue() {
    const revenue =
      orderConfirmed
        ? initialRevenue + orderTotal()
        : initialRevenue;

    setStatus(
      "miniStatRevenue",
      formatMoney(revenue)
    );
  }

  function updateExplanation(flow) {
    const container =
      document.getElementById(
        "miniProcessExplanation"
      );

    if (!container) {
      return;
    }

    const category =
      container.querySelector("span");

    const title =
      container.querySelector("strong");

    const body =
      container.querySelector("p");

    if (category) {
      category.textContent = flow.category;
    }

    if (title) {
      title.textContent = flow.title;
    }

    if (body) {
      body.textContent = flow.explanation;
    }
  }

  function updateProgress(flow) {
    const label =
      document.getElementById(
        "miniProgressLabel"
      );

    const value =
      document.getElementById(
        "miniProgressValue"
      );

    if (label) {
      label.textContent =
        flow.progressLabel;
    }

    if (value) {
      value.textContent =
        `${flow.progress}%`;
    }
  }

  function disableButtons(disabled) {
    quickReplies
      .querySelectorAll("button")
      .forEach((button) => {
        button.disabled = disabled;
      });
  }

  function runFlow(flow, activeButton) {
    if (isResponding) {
      return;
    }

    isResponding = true;
    disableButtons(true);

    quickReplies
      .querySelectorAll("button")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          button === activeButton
        );
      });

    userSay(flow.label);
    typing.hidden = false;

    window.setTimeout(() => {
      const result = flow.action();

      if (result !== false) {
        botSay(flow.response);
        updateExplanation(flow);
        updateProgress(flow);
      }

      typing.hidden = true;
      disableButtons(false);
      isResponding = false;
    }, 360);
  }

  function renderQuickReplies() {
    quickReplies.innerHTML = "";

    flows.forEach((flow) => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className =
        "mini-qr-button";

      button.textContent = flow.label;

      button.addEventListener(
        "click",
        () => runFlow(flow, button)
      );

      quickReplies.appendChild(button);
    });
  }

  function resetDemo() {
    cart = [];
    couponRate = 0;
    deliveryMode = "";
    deliveryFee = 0;
    ticketNumber = "";
    orderConfirmed = false;
    isResponding = false;

    chatLog.innerHTML = `
      <div class="mini-bubble mini-bot">
        Hey! 👋 Welcome to Taco Heat. What can I get started for you?
      </div>
    `;

    document.getElementById(
      "miniDeliveryMode"
    ).textContent =
      "Pickup or delivery not selected";

    const initialValues = {
      miniStatTicket: "Not created",
      miniStatStock: "Normal",
      miniStatDriver: "Unassigned",
      miniStatRevenue:
        formatMoney(initialRevenue)
    };

    Object.entries(initialValues)
      .forEach(([id, value]) => {
        const element =
          document.getElementById(id);

        if (element) {
          element.textContent = value;
          element.classList.remove("on");
        }
      });

    document.getElementById(
      "miniProgressLabel"
    ).textContent =
      "Waiting for customer";

    document.getElementById(
      "miniProgressValue"
    ).textContent = "0%";

    const explanation =
      document.getElementById(
        "miniProcessExplanation"
      );

    if (explanation) {
      explanation.querySelector(
        "span"
      ).textContent = "CUSTOMER INPUT";

      explanation.querySelector(
        "strong"
      ).textContent =
        "Choose “Show me the menu” to begin.";

      explanation.querySelector(
        "p"
      ).textContent =
        "Each quick reply demonstrates one practical restaurant action.";
    }

    quickReplies
      .querySelectorAll("button")
      .forEach((button) => {
        button.disabled = false;
        button.classList.remove("active");
      });

    typing.hidden = true;
    renderCart();
  }

  renderQuickReplies();
  renderCart();

  resetButton.addEventListener(
    "click",
    resetDemo
  );
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initMenu();
    initProgress();
    initReveal();
    initTilt();
    initHeroControls();
    initMiniWhatsAppDemo();
    initPillars();
    initRoi();
    initFaq();
    initForm();

    const year =
      document.getElementById(
        "currentYear"
      );

    if (year) {
      year.textContent =
        new Date().getFullYear();
    }
  }
);

window.setTimeout(() => {
  if (
    window.OrderRise3D ||
    window.OrderRisePage3D
  ) {
    return;
  }

  document
    .querySelectorAll(
      ".webgl-fallback"
    )
    .forEach((fallback) => {
      fallback.classList.add("show");
    });
}, 6500);
