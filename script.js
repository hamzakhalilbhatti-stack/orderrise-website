
const orderStates = [
  { customer:"Show me the menu", reply:"Here are the most popular items.", cart:"Empty", inventory:"24 burgers", kitchen:"Waiting", driver:"Not required", revenue:"PKR 0" },
  { customer:"Add two chicken burgers", reply:"Two chicken burgers were added to your cart.", cart:"2 burgers", inventory:"22 burgers", kitchen:"Ticket drafted", driver:"Not required", revenue:"PKR 1,598" },
  { customer:"Make one spicy", reply:"One burger is now spicy.", cart:"2 customized burgers", inventory:"22 burgers", kitchen:"Modifier updated", driver:"Not required", revenue:"PKR 1,598" },
  { customer:"Add extra cheese", reply:"Extra cheese was added to both burgers.", cart:"2 burgers + cheese", inventory:"20 cheese slices", kitchen:"Ticket updated", driver:"Not required", revenue:"PKR 1,798" },
  { customer:"Apply SAVE10", reply:"SAVE10 applied successfully.", cart:"10% discount", inventory:"Validated", kitchen:"Ticket ready", driver:"Not required", revenue:"PKR 1,618" },
  { customer:"I want delivery", reply:"Delivery selected. Please confirm your address.", cart:"Delivery order", inventory:"Reserved", kitchen:"Awaiting confirmation", driver:"Available", revenue:"PKR 1,768" },
  { customer:"Confirm my order", reply:"Order #1042 is confirmed and sent to the kitchen.", cart:"Confirmed", inventory:"Reserved", kitchen:"Preparing", driver:"Assigned", revenue:"PKR 1,768" },
  { customer:"Track my order", reply:"Your order is out for delivery.", cart:"Completed", inventory:"Updated", kitchen:"Ready", driver:"Out for delivery", revenue:"PKR 1,768" }
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
  call3D("setPillar", key);
}
function initPillars() {
  if (!document.querySelector("[data-pillar]")) return;
  document.querySelectorAll("[data-pillar]").forEach(button => button.addEventListener("click", () => updatePillar(button.dataset.pillar)));
  updatePillar("ordering");
}

function initDevices() {
  document.querySelectorAll("[data-device]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-device]").forEach(item => item.classList.toggle("active", item === button));
    call3D("focusDevice", button.dataset.device);
  }));
}

function updateAdmin(key) {
  const data = adminData[key];
  document.getElementById("adminModuleLabel").textContent = key;
  document.getElementById("adminModuleTitle").textContent = data[0];
  document.getElementById("adminModuleText").textContent = data[1];
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

document.addEventListener("DOMContentLoaded", () => {
  initMenu();initProgress();initReveal();initTilt();initHeroControls();initOrderDemo();
  initJourney();initPillars();initDevices();initAdmin();initRoi();initFaq();initForm();
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();
});


window.setTimeout(() => {
  if (window.OrderRise3D || window.OrderRisePage3D) return;
  document.querySelectorAll(".webgl-fallback").forEach(fallback => fallback.classList.add("show"));
}, 6500);
