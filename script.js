
const adminHubData = {
  orders: {
    eyebrow: "LIVE ORDERS",
    title: "See every active order and its current state.",
    description:
      "Review customer details, items, totals, fulfillment method, payment status and the next restaurant action.",
    features: ['Natural-language ordering', 'Menu discovery', 'Product modifiers', 'Cart management', 'Pickup and delivery'],
    metrics: [["New", "8"], ["Preparing", "12"], ["Ready", "5"]],
    headers: ["Order", "Customer", "Status", "Total"],
    rows: [
      ["#1042", "Ahmed", "Preparing", "PKR 1,410"],
      ["#1041", "Sara", "Ready", "PKR 2,250"],
      ["#1040", "Usman", "Out for delivery", "PKR 1,680"]
    ]
  },
  kitchen: {
    eyebrow: "KITCHEN DISPLAY",
    title: "Give the kitchen a clear preparation queue.",
    description:
      "Tickets contain items, quantities, modifiers, priority and preparation status without requiring staff to read customer chat history.",
    features: ['Structured kitchen tickets', 'Preparation status', 'Priority handling', 'Modifier visibility'],
    metrics: [["Waiting", "6"], ["Avg. prep", "14 min"], ["Delayed", "1"]],
    headers: ["Ticket", "Items", "Priority", "Status"],
    rows: [
      ["#1042", "2 burgers", "Normal", "Preparing"],
      ["#1041", "Pizza + drink", "High", "Ready"],
      ["#1039", "4 meals", "Normal", "Queued"]
    ]
  },
  receipts: {
    eyebrow: "RECEIPTS",
    title: "Keep a consistent record of every completed sale.",
    description:
      "Generate order summaries containing items, discounts, delivery fees, payment method and final total.",
    features: ['Itemized order summary', 'Discount and fee breakdown', 'Payment method record', 'Printable receipt data'],
    metrics: [["Today", "128"], ["Paid", "116"], ["COD", "12"]],
    headers: ["Receipt", "Method", "Discount", "Total"],
    rows: [
      ["R-1042", "Cash", "SAVE10", "PKR 1,410"],
      ["R-1041", "Card", "—", "PKR 2,250"],
      ["R-1040", "COD", "—", "PKR 1,680"]
    ]
  },
  promotions: {
    eyebrow: "PROMOTIONS",
    title: "Control offers without changing order calculations manually.",
    description:
      "Create coupons and customer campaigns while keeping eligibility, limits and discount reporting visible.",
    features: ['Coupons', 'First-order offers', 'BOGO campaigns', 'Redemption reporting'],
    metrics: [["Active", "4"], ["Redemptions", "37"], ["Revenue", "PKR 42K"]],
    headers: ["Campaign", "Offer", "Used", "Status"],
    rows: [
      ["SAVE10", "10% off", "24", "Active"],
      ["FIRSTORDER", "PKR 200", "9", "Active"],
      ["WEEKEND", "Free fries", "4", "Scheduled"]
    ]
  },
  customers: {
    eyebrow: "CUSTOMER CRM",
    title: "Turn completed orders into useful customer history.",
    description:
      "Store order history, favorite products, loyalty status and permission-based promotion activity.",
    features: ['Customer CRM', 'Order history', 'Favorite products', 'Loyalty points and levels'],
    metrics: [["Customers", "1,842"], ["Repeat rate", "42%"], ["VIP", "86"]],
    headers: ["Customer", "Orders", "Favorite", "Level"],
    rows: [
      ["Ahmed", "12", "Zinger Burger", "Gold"],
      ["Sara", "8", "Pepperoni Pizza", "Silver"],
      ["Usman", "5", "Chicken Meal", "Member"]
    ]
  },
  deliveries: {
    eyebrow: "DELIVERIES",
    title: "Assign orders and track delivery status clearly.",
    description:
      "Manage driver assignment, order state, cash collection and failed or returned deliveries without claiming unsupported live GPS.",
    features: ['Driver accounts', 'Order assignment', 'Delivery statuses', 'Cash-on-delivery records'],
    metrics: [["Assigned", "4"], ["Delivered", "18"], ["COD pending", "PKR 8K"]],
    headers: ["Order", "Driver", "Status", "Cash"],
    rows: [
      ["#1042", "Ali K.", "Assigned", "PKR 1,410"],
      ["#1040", "Hamza R.", "Out", "PKR 1,680"],
      ["#1038", "Bilal S.", "Delivered", "Collected"]
    ]
  },
  reports: {
    eyebrow: "OWNER REPORTS",
    title: "Understand sales and operations without combining spreadsheets.",
    description:
      "Review order totals, average order value, product performance, customer activity, discounts and delivery results.",
    features: ['Daily sales', 'Average order value', 'Top products', 'Customer and delivery performance'],
    metrics: [["Revenue", "PKR 184K"], ["AOV", "PKR 1,438"], ["Growth", "+18%"]],
    headers: ["Report", "Today", "Previous", "Change"],
    rows: [
      ["Orders", "128", "111", "+15%"],
      ["Revenue", "184K", "156K", "+18%"],
      ["Repeat rate", "42%", "38%", "+4 pts"]
    ]
  },
  inventory: {
    eyebrow: "INVENTORY",
    title: "Connect sold items with available restaurant stock.",
    description:
      "Reserve ingredients when orders are confirmed and highlight products approaching a low-stock threshold.",
    features: ['Automatic stock reservation', 'Low-stock alerts', 'Product availability', 'Reserved quantity visibility'],
    metrics: [["Products", "64"], ["Low stock", "5"], ["Unavailable", "2"]],
    headers: ["Item", "Available", "Reserved", "State"],
    rows: [
      ["Burger patties", "22", "2", "Normal"],
      ["Cheese slices", "8", "2", "Low"],
      ["Coke cans", "41", "0", "Normal"]
    ]
  },
  menu: {
    eyebrow: "MENU",
    title: "Keep prices, products and modifiers controlled in one place.",
    description:
      "Manage availability, categories, prices, extras, sizes and customer-facing product descriptions.",
    features: ['Menu categories', 'Prices and availability', 'Sizes and extras', 'Customer-facing descriptions'],
    metrics: [["Products", "48"], ["Categories", "7"], ["Hidden", "3"]],
    headers: ["Product", "Price", "Category", "State"],
    rows: [
      ["Zinger Burger", "PKR 700", "Burgers", "Available"],
      ["Loaded Fries", "PKR 450", "Sides", "Available"],
      ["Family Box", "PKR 2,900", "Deals", "Hidden"]
    ]
  },
  system: {
    eyebrow: "SYSTEM",
    title: "Control restaurant settings and connected services.",
    description:
      "Manage restaurant status, roles, notification rules, integrations and operational safeguards.",
    features: ['Restaurant open and close controls', 'Roles and permissions', 'Notification rules', 'Integration settings'],
    metrics: [["Restaurant", "Open"], ["WhatsApp", "Connected"], ["Alerts", "2"]],
    headers: ["Setting", "Value", "Owner", "State"],
    rows: [
      ["Ordering", "Enabled", "Admin", "Active"],
      ["Kitchen alerts", "Instant", "Manager", "Active"],
      ["Daily report", "11:00 PM", "Owner", "Scheduled"]
    ]
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

      const stageStatuses = {
        phone: "WhatsApp message received",
        ai: "AI extracted product, quantity and instructions",
        cart: "Cart, modifiers and checkout prepared",
        kitchen: "Kitchen ticket created",
        inventory: "Inventory reserved automatically",
        delivery: "Delivery workflow and driver assignment prepared",
        owner: "Owner reports and customer history updated",
        overview: "One order moving through the complete restaurant"
      };

      const status = document.getElementById("heroStatusText");
      if (status) {
        status.textContent =
          stageStatuses[button.dataset.heroFocus] ||
          stageStatuses.overview;
      }

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

function updateAdminHub(key) {
  const data = adminHubData[key];

  if (!data) {
    return;
  }

  const eyebrow = document.getElementById("adminModuleEyebrow");
  const title = document.getElementById("adminModuleTitle");
  const description = document.getElementById("adminModuleDescription");
  const features = document.getElementById("adminModuleFeatures");
  const metrics = document.getElementById("adminModuleMetrics");
  const table = document.getElementById("adminSampleTable");

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

  if (metrics) {
    metrics.innerHTML = data.metrics
      .map(
        ([label, value]) => `
          <article>
            <span>${label}</span>
            <strong>${value}</strong>
          </article>
        `
      )
      .join("");
  }

  if (table) {
    const header = `
      <div class="admin-table-row admin-table-head">
        ${data.headers.map((item) => `<span>${item}</span>`).join("")}
      </div>
    `;

    const rows = data.rows
      .map(
        (row) => `
          <div class="admin-table-row">
            ${row
              .map(
                (item, index) =>
                  `<span${index === 2 ? ' class="status-live"' : ""}>${item}</span>`
              )
              .join("")}
          </div>
        `
      )
      .join("");

    table.innerHTML = header + rows;
  }

  document
    .querySelectorAll("[data-admin-module]")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.adminModule === key
      );
    });
}

function initAdminHub() {
  const buttons = document.querySelectorAll("[data-admin-module]");

  if (!buttons.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      updateAdminHub(button.dataset.adminModule);
    });
  });

  updateAdminHub("orders");
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
    initAdminHub();
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
