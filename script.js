
const orderStates = [
  { customer:"Show me the menu", reply:"Here are the most popular items.", cart:"Empty", inventory:"24 burgers", kitchen:"Waiting", driver:"Not required", revenue:"PKR 0", step:"STEP 1 · MENU", title:"The customer asks for the menu.", explanation:"The WhatsApp phone and menu area glow green. No kitchen or stock action is needed yet.", accent:"#25d366" },
  { customer:"Add two chicken burgers", reply:"Two chicken burgers were added to your cart.", cart:"2 burgers", inventory:"22 burgers", kitchen:"Ticket drafted", driver:"Not required", revenue:"PKR 1,598", step:"STEP 2 · CART", title:"Two burgers fly into the cart.", explanation:"The cart turns orange, the burger count changes and inventory reserves two burger items.", accent:"#ff9f43" },
  { customer:"Make one spicy", reply:"One burger is now spicy.", cart:"2 customized burgers", inventory:"22 burgers", kitchen:"Modifier updated", driver:"Not required", revenue:"PKR 1,598", step:"STEP 3 · MODIFIER", title:"The spicy instruction is attached.", explanation:"A red modifier marker appears on one burger and the kitchen ticket receives the change.", accent:"#ff5a67" },
  { customer:"Add extra cheese", reply:"Extra cheese was added to both burgers.", cart:"2 burgers + cheese", inventory:"20 cheese slices", kitchen:"Ticket updated", driver:"Not required", revenue:"PKR 1,798", step:"STEP 4 · ADD-ON", title:"Cheese is added and stock decreases.", explanation:"The cheese layers glow yellow while the inventory shelf removes the reserved slices.", accent:"#ffca5c" },
  { customer:"Apply SAVE10", reply:"SAVE10 applied successfully.", cart:"10% discount", inventory:"Validated", kitchen:"Ticket ready", driver:"Not required", revenue:"PKR 1,618", step:"STEP 5 · COUPON", title:"The coupon changes the final total.", explanation:"The purple promotion badge activates, validates SAVE10 and recalculates the order value.", accent:"#a47cff" },
  { customer:"I want delivery", reply:"Delivery selected. Please confirm your address.", cart:"Delivery order", inventory:"Reserved", kitchen:"Awaiting confirmation", driver:"Available", revenue:"PKR 1,768", step:"STEP 6 · DELIVERY", title:"The delivery station becomes active.", explanation:"The pink delivery zone lights up and an available driver and scooter appear.", accent:"#ff63b8" },
  { customer:"Confirm my order", reply:"Order #1042 is confirmed and sent to the kitchen.", cart:"Confirmed", inventory:"Reserved", kitchen:"Preparing", driver:"Assigned", revenue:"PKR 1,768", step:"STEP 7 · KITCHEN", title:"A real kitchen ticket is created.", explanation:"The amber kitchen screen displays Order #1042 and preparation begins.", accent:"#ffca5c" },
  { customer:"Track my order", reply:"Your order is out for delivery.", cart:"Completed", inventory:"Updated", kitchen:"Ready", driver:"Out for delivery", revenue:"PKR 1,768", step:"STEP 8 · TRACKING", title:"The driver moves along the delivery route.", explanation:"The blue route animates, the customer receives an update and owner revenue is finalized.", accent:"#43c6ff" }
];

const pillarData = {
  ordering: {
    eyebrow:"Pillar 1",
    title:"Customers Order Naturally. Your System Handles the Complexity.",
    description:"A floating phone, interactive cart and order bubbles orbit around an AI core.",
    features:["Natural-language ordering","Menu discovery","Product modifiers","Cart management","Pickup and delivery","Payment selection","Coupons","Confirmation and tracking"]
  },
  operations: {
    eyebrow:"Pillar 2",
    title:"Every Team Sees Exactly What They Need.",
    description:"A cutaway restaurant floor connects the counter, kitchen, inventory room and management office.",
    features:["Owner dashboard","Kitchen display","Menu administration","Inventory management","Receipts","Kitchen tickets","Open and close controls"]
  },
  growth: {
    eyebrow:"Pillar 3",
    title:"Turn Every Order Into a Long-Term Customer Relationship.",
    description:"Customer cards orbit a glowing loyalty core while points and order history update.",
    features:["Customer CRM","Order history","Favorite products","Customer levels","Loyalty points","Saved orders","Promotions and coupons","BOGO and first-order offers"]
  },
  delivery: {
    eyebrow:"Pillar 4",
    title:"Control Every Delivery From Dispatch to Completion.",
    description:"A delivery scooter moves between the restaurant and customer through a simplified animated route.",
    features:["Driver accounts","Secure driver login","Order assignment","Delivery statuses","Cash-on-delivery records","Delivery zones","Failed and returned deliveries","Customer notifications"]
  },
  intelligence: {
    eyebrow:"Pillar 5",
    title:"Know What Is Happening Without Standing at the Counter.",
    description:"A floating glass dashboard displays sample metrics and animated charts.",
    features:["Daily sales","Order totals","Average order value","Top products","Customer performance","Delivery performance","Discounts","CSV and PDF exports","WhatsApp owner reports"]
  }
};

const adminData = {
  orders:["See every order from message to completion.","The camera focuses on active orders, status, value and fulfillment."],
  kitchen:["Move directly into kitchen execution.","View new, preparing, ready and delayed kitchen tickets."],
  receipts:["Keep receipts connected to every order.","Review print status, order totals and payment information."],
  promotions:["Launch promotions without losing control.","Manage coupons, BOGO offers, first-order offers and targeted campaigns."],
  customers:["Expand customer profiles and history.","Review order history, favorites, loyalty and saved orders."],
  deliveries:["Activate the delivery operations area.","Assign drivers and manage delivery statuses and cash collection."],
  reports:["Reveal restaurant intelligence.","Review sales, top products, customers, discounts and delivery performance."],
  staff:["Give each team member the correct workspace.","Control staff access and restaurant responsibilities."],
  inventory:["Open the stock room.","Review item availability, low stock and product usage."],
  menu:["Control products, prices and modifiers.","Manage categories, availability, add-ons and restaurant menus."],
  system:["Manage the restaurant operating system.","Review opening status, integrations, settings and system health."]
};

const journeyFlow = [
  {input:"Customer message", action:"Capture WhatsApp text", output:"Raw order request"},
  {input:"Raw message", action:"Extract product, quantity and intent", output:"Structured order data"},
  {input:"Structured order", action:"Check price, stock and promotions", output:"Validated cart"},
  {input:"Validated cart", action:"Collect address, payment and coupon", output:"Confirmed checkout"},
  {input:"Confirmed order", action:"Create kitchen ticket #1042", output:"Preparing status"},
  {input:"Ready order", action:"Assign driver and dispatch", output:"Customer tracking update"},
  {input:"Completed delivery", action:"Update CRM, loyalty and analytics", output:"Owner intelligence"}
];

const pillarPurpose = {
  ordering:["INTELLIGENT ORDERING","Phone → AI → cart → checkout"],
  operations:["RESTAURANT OPERATIONS","Kitchen + inventory + owner + delivery"],
  growth:["CUSTOMERS & GROWTH","Profiles → loyalty → campaigns → reorder"],
  delivery:["DELIVERY MANAGEMENT","Dispatch → driver → status → completion"],
  intelligence:["OWNER INTELLIGENCE","Orders → metrics → reports → decisions"]
};

const devicePurpose = {
  owner:["OWNER LAPTOP","Orders, revenue, customers and alerts"],
  kitchen:["KITCHEN TABLET","New → preparing → ready kitchen tickets"],
  driver:["DRIVER PHONE","Assignments, status and cash collection"],
  customer:["CUSTOMER WHATSAPP","Menu, cart, checkout and tracking"],
  reports:["REPORTS DESKTOP","Sales, products, customers and delivery"]
};

const adminPurpose = {
  orders:"Message → status → fulfillment",
  kitchen:"Ticket → preparation → ready",
  receipts:"Order → payment → receipt",
  promotions:"Audience → offer → conversion",
  customers:"Profile → history → loyalty",
  deliveries:"Assignment → route → completion",
  reports:"Data → metrics → decisions",
  staff:"Role → access → responsibility",
  inventory:"Usage → stock → alert",
  menu:"Product → price → availability",
  system:"Integration → health → control"
};

function call3D(method, ...args) {
  if (window.OrderRise3D && typeof window.OrderRise3D[method] === "function") {
    window.OrderRise3D[method](...args);
    return;
  }
  window.__orderRisePending3D = window.__orderRisePending3D || {};
  window.__orderRisePending3D[method] = args;
}

function initMenu() {
  const button = document.getElementById("menuButton");
  const nav = document.getElementById("mainNavigation");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    button.setAttribute("aria-expanded","false");
  }));
}

function initProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  };
  update();
  addEventListener("scroll", update, {passive:true});
  addEventListener("resize", update);
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  els.forEach(el => el.style.setProperty("--reveal-delay", `${Number(el.dataset.delay || 0)}ms`));
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(el => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, {threshold:.1, rootMargin:"0px 0px -40px"});
  els.forEach(el => observer.observe(el));
}

function initTilt() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
  document.querySelectorAll(".tilt-card").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(850px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => card.style.transform = "");
  });
}

function initHeroControls() {
  document.querySelectorAll("[data-hero-focus]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-hero-focus]").forEach(item => item.classList.toggle("active", item === button));
      call3D("focusHero", button.dataset.heroFocus);
    });
  });
  const sound = document.getElementById("soundToggle");
  if (sound) {
    sound.addEventListener("click", () => {
      const enabled = sound.getAttribute("aria-pressed") !== "true";
      sound.setAttribute("aria-pressed", String(enabled));
      sound.textContent = enabled ? "Sound on" : "Sound off";
      call3D("setSound", enabled);
    });
  }
}

function updateOrderDemo(index) {
  const state = orderStates[index];
  document.getElementById("orderDemoCustomer").textContent = state.customer;
  document.getElementById("orderDemoReply").textContent = state.reply;
  document.getElementById("cartStatus").textContent = state.cart;
  document.getElementById("inventoryStatus").textContent = state.inventory;
  document.getElementById("kitchenStatus").textContent = state.kitchen;
  document.getElementById("driverStatus").textContent = state.driver;
  document.getElementById("revenueStatus").textContent = state.revenue;
  document.getElementById("demoExplanationStep").textContent = state.step;
  document.getElementById("demoExplanationTitle").textContent = state.title;
  document.getElementById("demoExplanationText").textContent = state.explanation;
  const explanation = document.getElementById("demoExplanation");
  explanation.style.borderLeftColor = state.accent;
  explanation.style.boxShadow = `0 0 30px ${state.accent}22`;
  document.querySelectorAll("[data-order-step]").forEach((button, i) => button.classList.toggle("active", i === index));
  call3D("setOrderStage", index);
}
function initOrderDemo() {
  if (!document.querySelector("[data-order-step]")) return;
  document.querySelectorAll("[data-order-step]").forEach(button => {
    button.addEventListener("click", () => updateOrderDemo(Number(button.dataset.orderStep)));
  });
  updateOrderDemo(0);
}

function setJourneyStage(index) {
  document.querySelectorAll(".journey-step").forEach((step, i) => step.classList.toggle("active", i === index));
  const titles = ["Capture","Understand","Validate","Checkout","Kitchen","Delivery","Owner Intelligence"];
  const visual = [
    "“I need two burgers.”",
    "Product: Chicken Burger · Quantity: 2 · Confidence: High",
    "Price, availability, modifiers, inventory and promotions checked",
    "Name, address, payment and confirmation collected",
    "Order #1042 · 2 × Chicken Burger · Status: Accepted",
    "Driver assigned · Customer notified",
    "Sales, loyalty, product and delivery performance updated"
  ];
  const label = document.getElementById("journeyLabel");
  const text = document.getElementById("journeyVisualText");
  const counter = document.getElementById("journeyCounter");
  if (label) label.textContent = titles[index];
  if (text) text.textContent = visual[index];
  if (counter) counter.textContent = `Scene ${index + 1} / 7`;
  const flow = journeyFlow[index];
  document.getElementById("journeyInput").textContent = flow.input;
  document.getElementById("journeyAction").textContent = flow.action;
  document.getElementById("journeyOutput").textContent = flow.output;
  call3D("setJourneyStage", index);
}
function initJourney() {
  const steps = document.querySelectorAll(".journey-step");
  if (!steps.length) return;
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setJourneyStage(Number(visible.target.dataset.journeyStage));
  }, {threshold:[.25,.5,.75], rootMargin:"-20% 0px -45%"});
  steps.forEach(step => observer.observe(step));
  setJourneyStage(0);
}

function updatePillar(key) {
  const data = pillarData[key];
  document.getElementById("pillarEyebrow").textContent = data.eyebrow;
  document.getElementById("pillarTitle").textContent = data.title;
  document.getElementById("pillarDescription").textContent = data.description;
  document.getElementById("pillarFeatures").innerHTML = data.features.map(item => `<li>${item}</li>`).join("");
  document.querySelectorAll("[data-pillar]").forEach(button => button.classList.toggle("active", button.dataset.pillar === key));
  const purpose = pillarPurpose[key];
  document.getElementById("pillarSceneName").textContent = purpose[0];
  document.getElementById("pillarScenePurpose").textContent = purpose[1];
  call3D("setPillar", key);
}
function initPillars() {
  if (!document.querySelector("[data-pillar]")) return;
  document.querySelectorAll("[data-pillar]").forEach(button => button.addEventListener("click", () => updatePillar(button.dataset.pillar)));
  updatePillar("ordering");
}

function initDevices() {
  document.querySelectorAll("[data-device]").forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.device;
    document.querySelectorAll("[data-device]").forEach(item => item.classList.toggle("active", item === button));
    const purpose = devicePurpose[key];
    document.getElementById("deviceSceneName").textContent = purpose[0];
    document.getElementById("deviceScenePurpose").textContent = purpose[1];
    call3D("focusDevice", key);
  }));
}

function updateAdmin(key) {
  const data = adminData[key];
  document.getElementById("adminModuleLabel").textContent = key;
  document.getElementById("adminModuleTitle").textContent = data[0];
  document.getElementById("adminModuleText").textContent = data[1];
  document.getElementById("adminSceneName").textContent = `${key.toUpperCase()} MODULE`;
  document.getElementById("adminScenePurpose").textContent = adminPurpose[key];
  document.querySelectorAll("[data-admin-module]").forEach(button => button.classList.toggle("active", button.dataset.adminModule === key));
  call3D("focusAdmin", key);
}
function initAdmin() {
  if (!document.querySelector("[data-admin-module]")) return;
  document.querySelectorAll("[data-admin-module]").forEach(button => button.addEventListener("click", () => updateAdmin(button.dataset.adminModule)));
  updateAdmin("orders");
}

function numberValue(id, fallback=0) {
  const value = Number(document.getElementById(id)?.value);
  return Number.isFinite(value) ? value : fallback;
}
function calculateRoi() {
  const daily = Math.max(0, numberValue("dailyOrders"));
  const average = Math.max(0, numberValue("averageOrderValue"));
  const missed = Math.min(100, Math.max(0, numberValue("missedPercentage")));
  const locations = Math.max(1, numberValue("locations",1));
  const orders = daily * 30 * locations * missed / 100;
  const revenue = orders * average;
  const hours = orders * 4 / 60;
  document.getElementById("recoveredOrders").textContent = Math.round(orders).toLocaleString();
  document.getElementById("recoveredRevenue").textContent = `PKR ${Math.round(revenue).toLocaleString()}`;
  document.getElementById("hoursSaved").textContent = `${Math.round(hours).toLocaleString()} hours`;
}
function initRoi() {
  ["dailyOrders","averageOrderValue","missedPercentage","locations"].forEach(id => document.getElementById(id)?.addEventListener("input", calculateRoi));
  if (document.getElementById("recoveredOrders")) calculateRoi();
}

function initFaq() {
  document.querySelectorAll(".faq-item button").forEach(button => {
    button.addEventListener("click", () => {
      const answer = button.parentElement.querySelector(".faq-answer");
      const open = button.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq-item button").forEach(other => {
        other.setAttribute("aria-expanded","false");
        other.querySelector("span").textContent = "+";
        other.parentElement.querySelector(".faq-answer").hidden = true;
      });
      if (!open) {
        button.setAttribute("aria-expanded","true");
        button.querySelector("span").textContent = "−";
        answer.hidden = false;
      }
    });
  });
}

function initForm() {
  const form = document.getElementById("demoForm");
  const success = document.getElementById("successMessage");
  if (!form || !success) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    success.classList.add("show");
    success.scrollIntoView({behavior:"smooth", block:"nearest"});
    form.reset();
  });
}


/* ==========================================================
   Compact WhatsApp order demonstration
   ========================================================== */

function initMiniWhatsAppDemo() {
  const chatLog = document.getElementById("miniChatLog");
  const quickReplies = document.getElementById("miniQuickReplies");
  const typing = document.getElementById("miniTyping");
  const resetButton = document.getElementById("miniResetDemo");

  if (!chatLog || !quickReplies || !typing || !resetButton) {
    return;
  }

  const menu = {
    "chicken burger": {
      name: "Chicken Burger",
      price: 650
    },
    "zinger burger": {
      name: "Zinger Burger",
      price: 700
    },
    "fries": {
      name: "Fries",
      price: 250
    },
    "coke": {
      name: "Coke",
      price: 150
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

  const flowDefinitions = [
    {
      label: "Show me the menu",
      threeDStage: 0,
      progress: 12,
      progressLabel: "Menu displayed",
      category: "MENU DISCOVERY",
      title: "OrderRise presents a structured restaurant menu.",
      explanation:
        "The customer remains inside WhatsApp while OrderRise converts the restaurant menu into an easy conversation.",
      response:
        "Here’s today’s menu: 🍔 Chicken Burger — Rs 650 · 🌶️ Zinger Burger — Rs 700 · 🍟 Fries — Rs 250 · 🥤 Coke — Rs 150. What would you like?",
      action() {}
    },
    {
      label: "Add two zinger burgers",
      threeDStage: 1,
      progress: 34,
      progressLabel: "Cart created",
      category: "CART MANAGEMENT",
      title: "Two products are converted into a structured cart.",
      explanation:
        "OrderRise understands the product and quantity, calculates the subtotal and reserves two burgers from available stock.",
      response:
        "Added 2× Zinger Burger to your cart. The estimated subtotal is Rs 1,400.",
      action() {
        addToCart("zinger burger", 2);
        setStatus("miniStatStock", "22 burgers reserved");
      }
    },
    {
      label: "Make one spicy",
      threeDStage: 2,
      progress: 45,
      progressLabel: "Modifier understood",
      category: "ORDER MODIFIER",
      title: "A natural-language instruction is attached to one item.",
      explanation:
        "The customer does not need a complicated form. OrderRise adds the spicy instruction directly to the kitchen-ready order.",
      response:
        "Got it — one Zinger Burger is marked extra spicy 🌶️.",
      action() {
        const burger = cart.find((item) => item.key === "zinger burger");

        if (!burger) {
          botSay("Add the burgers first, then I can make one spicy.");
          return false;
        }

        burger.modifier = "1 burger: extra spicy";
        renderCart();
        return true;
      }
    },
    {
      label: "Apply SAVE10",
      threeDStage: 4,
      progress: 56,
      progressLabel: "Coupon validated",
      category: "PROMOTION",
      title: "The coupon is validated and the order total changes.",
      explanation:
        "OrderRise applies the restaurant promotion consistently and displays the discounted total before confirmation.",
      response:
        "Coupon SAVE10 applied — you received 10% off 🎉.",
      action() {
        if (cart.length === 0) {
          botSay("Your cart is empty. Add an item before applying SAVE10.");
          return false;
        }

        couponRate = 0.1;
        renderCart();
        return true;
      }
    },
    {
      label: "I want delivery",
      threeDStage: 5,
      progress: 68,
      progressLabel: "Delivery selected",
      category: "FULFILLMENT",
      title: "The order changes from an unassigned cart to a delivery workflow.",
      explanation:
        "OrderRise prepares to collect the address, adds the delivery fee and marks the driver stage as pending.",
      response:
        "Delivery selected. Please share your address and phone number. A Rs 150 delivery fee was added.",
      action() {
        deliveryMode = "Delivery";
        deliveryFee = 150;
        document.getElementById("miniDeliveryMode").textContent =
          "Delivery selected · Rs 150 fee";
        setStatus("miniStatDriver", "Pending address");
        renderCart();
        return true;
      }
    },
    {
      label: "Confirm order",
      threeDStage: 6,
      progress: 88,
      progressLabel: "Kitchen preparing",
      category: "ORDER CONFIRMATION",
      title: "A kitchen ticket is created and operational work begins.",
      explanation:
        "The conversational cart becomes ticket #1042, inventory is finalized, the kitchen starts preparation and a driver is assigned.",
      response:
        "Order confirmed ✅ Ticket #1042 was sent to the kitchen. Estimated preparation time: 18 minutes.",
      action() {
        if (cart.length === 0) {
          botSay("Your cart is empty — add something before confirming.");
          return false;
        }

        ticketNumber = "1042";
        orderConfirmed = true;

        setStatus("miniStatTicket", "#1042 · Preparing");
        setStatus("miniStatStock", "Inventory updated");

        if (deliveryMode) {
          setStatus("miniStatDriver", "Assigned · Ali K.");
        } else {
          setStatus("miniStatDriver", "Pickup order");
        }

        updateRevenue();
        return true;
      }
    },
    {
      label: "Track my order",
      threeDStage: 7,
      progress: 100,
      progressLabel: "Order in progress",
      category: "CUSTOMER UPDATE",
      title: "The customer receives a clear order status without calling staff.",
      explanation:
        "OrderRise reads the active ticket and returns its current kitchen or delivery status through WhatsApp.",
      response:
        "Order #1042 is being prepared. Estimated time: 18 minutes. We’ll message you again when it leaves the restaurant.",
      action() {
        if (!ticketNumber || !orderConfirmed) {
          botSay("There is no active order yet. Confirm your order first.");
          return false;
        }

        setStatus(
          "miniStatDriver",
          deliveryMode ? "Ali K. · Ready soon" : "Pickup · Ready soon"
        );

        return true;
      }
    }
  ];

  function formatMoney(value) {
    return `Rs ${Math.round(value).toLocaleString()}`;
  }

  function getSubtotal() {
    return cart.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );
  }

  function getDiscount() {
    return getSubtotal() * couponRate;
  }

  function getOrderTotal() {
    return getSubtotal() - getDiscount() + deliveryFee;
  }

  function addToCart(key, qty) {
    const product = menu[key];
    const existing = cart.find((item) => item.key === key);

    if (!product) {
      return;
    }

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        key,
        name: product.name,
        price: product.price,
        qty,
        modifier: ""
      });
    }

    renderCart();
  }

  function renderCart() {
    const container = document.getElementById("miniCartLines");
    const totalElement = document.getElementById("miniCartTotal");
    const totalValue = document.getElementById("miniCartTotalValue");

    if (!container || !totalElement || !totalValue) {
      return;
    }

    if (cart.length === 0) {
      container.innerHTML =
        '<div class="mini-cart-empty">No items yet — try “Show me the menu”.</div>';
      totalElement.hidden = true;
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
          <strong>${formatMoney(item.price * item.qty)}</strong>
        </div>
      `;
    });

    if (couponRate > 0) {
      rows.push(`
        <div class="mini-cart-line">
          <span>SAVE10 discount</span>
          <strong>−${formatMoney(getDiscount())}</strong>
        </div>
      `);
    }

    if (deliveryFee > 0) {
      rows.push(`
        <div class="mini-cart-line">
          <span>Delivery fee</span>
          <strong>${formatMoney(deliveryFee)}</strong>
        </div>
      `);
    }

    container.innerHTML = rows.join("");
    totalElement.hidden = false;
    totalValue.textContent = formatMoney(getOrderTotal());
  }

  function createBubble(text, sender) {
    const bubble = document.createElement("div");
    bubble.className =
      sender === "user"
        ? "mini-bubble mini-user"
        : "mini-bubble mini-bot";

    bubble.textContent = text;
    chatLog.appendChild(bubble);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function botSay(text) {
    createBubble(text, "bot");
  }

  function userSay(text) {
    createBubble(text, "user");
  }

  function setStatus(id, value) {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    element.textContent = value;
    element.classList.add("on");
  }

  function updateRevenue() {
    const revenue = orderConfirmed
      ? initialRevenue + getOrderTotal()
      : initialRevenue;

    setStatus("miniStatRevenue", formatMoney(revenue));
  }

  function updateExplanation(flow) {
    const explanation = document.getElementById("miniProcessExplanation");
    const category = explanation?.querySelector("span");
    const title = explanation?.querySelector("strong");
    const body = explanation?.querySelector("p");

    if (!explanation || !category || !title || !body) {
      return;
    }

    category.textContent = flow.category;
    title.textContent = flow.title;
    body.textContent = flow.explanation;

    const colorByStage = {
      0: "#25d366",
      1: "#ff9f43",
      2: "#ff5a67",
      4: "#a47cff",
      5: "#ff63b8",
      6: "#ffca5c",
      7: "#43c6ff"
    };

    const color = colorByStage[flow.threeDStage] || "#25d366";
    explanation.style.borderLeftColor = color;
    explanation.style.boxShadow = `0 0 28px ${color}1f`;
    category.style.color = color;
  }

  function updateProgress(flow) {
    const label = document.getElementById("miniProgressLabel");
    const value = document.getElementById("miniProgressValue");

    if (label) {
      label.textContent = flow.progressLabel;
    }

    if (value) {
      value.textContent = `${flow.progress}%`;
    }
  }

  function setButtonsDisabled(disabled) {
    quickReplies
      .querySelectorAll("button")
      .forEach((button) => {
        button.disabled = disabled;
      });
  }

  function synchronizeLargeDemo(flow) {
    if (
      typeof updateOrderDemo === "function" &&
      document.getElementById("orderDemoCanvas")
    ) {
      updateOrderDemo(flow.threeDStage);
    }
  }

  function runFlow(flow, button) {
    if (isResponding) {
      return;
    }

    isResponding = true;
    setButtonsDisabled(true);

    quickReplies
      .querySelectorAll("button")
      .forEach((item) => item.classList.toggle("active", item === button));

    userSay(flow.label);
    typing.hidden = false;

    window.setTimeout(() => {
      const actionResult = flow.action();

      if (actionResult !== false) {
        botSay(flow.response);
        updateExplanation(flow);
        updateProgress(flow);
        synchronizeLargeDemo(flow);
      }

      typing.hidden = true;
      setButtonsDisabled(false);
      isResponding = false;
    }, 360);
  }

  function renderQuickReplies() {
    quickReplies.innerHTML = "";

    flowDefinitions.forEach((flow) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mini-qr-button";
      button.textContent = flow.label;
      button.addEventListener("click", () => runFlow(flow, button));
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

    document.getElementById("miniDeliveryMode").textContent =
      "Pickup or delivery not selected";

    document.getElementById("miniStatTicket").textContent = "Not created";
    document.getElementById("miniStatStock").textContent = "Normal";
    document.getElementById("miniStatDriver").textContent = "Unassigned";
    document.getElementById("miniStatRevenue").textContent =
      formatMoney(initialRevenue);

    document
      .querySelectorAll(
        "#miniStatTicket, #miniStatStock, #miniStatDriver, #miniStatRevenue"
      )
      .forEach((element) => element.classList.remove("on"));

    document.getElementById("miniProgressLabel").textContent =
      "Waiting for customer";

    document.getElementById("miniProgressValue").textContent = "0%";

    const explanation = document.getElementById("miniProcessExplanation");
    const category = explanation.querySelector("span");
    const title = explanation.querySelector("strong");
    const body = explanation.querySelector("p");

    category.textContent = "CUSTOMER INPUT";
    category.style.color = "#68ff9b";
    title.textContent = "Choose “Show me the menu” to begin.";
    body.textContent =
      "Each reply demonstrates how one WhatsApp message becomes structured restaurant work.";

    explanation.style.borderLeftColor = "#25d366";
    explanation.style.boxShadow = "none";

    quickReplies
      .querySelectorAll("button")
      .forEach((button) => {
        button.disabled = false;
        button.classList.remove("active");
      });

    typing.hidden = true;
    renderCart();

    if (
      typeof updateOrderDemo === "function" &&
      document.getElementById("orderDemoCanvas")
    ) {
      updateOrderDemo(0);
    }
  }

  renderQuickReplies();
  renderCart();
  resetButton.addEventListener("click", resetDemo);
}


document.addEventListener("DOMContentLoaded", () => {
  initMenu();initProgress();initReveal();initTilt();initHeroControls();initMiniWhatsAppDemo();initOrderDemo();
  initJourney();initPillars();initDevices();initAdmin();initRoi();initFaq();initForm();
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();
});


window.setTimeout(() => {
  if (window.OrderRise3D || window.OrderRisePage3D) return;
  document.querySelectorAll(".webgl-fallback").forEach(fallback => fallback.classList.add("show"));
}, 6500);
