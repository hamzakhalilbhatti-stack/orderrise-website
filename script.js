
const demoScenarios = [
  {
    action: "Show menu",
    customer: "Show me the menu",
    assistant: "Here are the most popular items from the demonstration restaurant.",
    cart: "Empty",
    kitchen: "Waiting",
    delivery: "Not required",
    revenue: "PKR 0"
  },
  {
    action: "Add burgers",
    customer: "Add two chicken burgers",
    assistant: "Two chicken burgers were added. Would you like any changes?",
    cart: "2 items",
    kitchen: "Ticket drafted",
    delivery: "Not selected",
    revenue: "PKR 1,598"
  },
  {
    action: "Make one spicy",
    customer: "Make one spicy",
    assistant: "Done. One burger is spicy and the other remains regular.",
    cart: "2 customized items",
    kitchen: "Instructions updated",
    delivery: "Not selected",
    revenue: "PKR 1,598"
  },
  {
    action: "Apply SAVE10",
    customer: "Apply SAVE10",
    assistant: "The demonstration coupon has been applied successfully.",
    cart: "10% discount",
    kitchen: "Ticket ready",
    delivery: "Not selected",
    revenue: "PKR 1,438"
  },
  {
    action: "Choose delivery",
    customer: "I want delivery",
    assistant: "Delivery selected. Please provide your demonstration address.",
    cart: "Delivery order",
    kitchen: "Awaiting confirmation",
    delivery: "Address required",
    revenue: "PKR 1,588"
  },
  {
    action: "Confirm order",
    customer: "Confirm my order",
    assistant: "Order 1042 is confirmed and has been sent to the kitchen.",
    cart: "Confirmed",
    kitchen: "Preparing",
    delivery: "Driver available",
    revenue: "PKR 1,588"
  }
];

const dashboardViews = [
  {
    name: "Owner",
    title: "Owner Admin Hub",
    description:
      "See active orders, customer information, alerts and restaurant status.",
    metrics: [
      ["Orders today", "128"],
      ["Revenue", "PKR 184K"],
      ["Average order", "PKR 1,438"]
    ]
  },
  {
    name: "Kitchen",
    title: "Kitchen Display",
    description:
      "Accept orders, manage preparation and highlight delayed tickets.",
    metrics: [
      ["New", "8"],
      ["Preparing", "12"],
      ["Ready", "5"]
    ]
  },
  {
    name: "Customer",
    title: "Customer WhatsApp",
    description:
      "Customers order naturally without downloading another application.",
    metrics: [
      ["Cart items", "3"],
      ["Discount", "10%"],
      ["Status", "Confirmed"]
    ]
  },
  {
    name: "Driver",
    title: "Driver Workspace",
    description:
      "Drivers receive assignments and update delivery progress securely.",
    metrics: [
      ["Assigned", "4"],
      ["Delivered", "11"],
      ["COD pending", "PKR 8K"]
    ]
  },
  {
    name: "Reports",
    title: "Owner Intelligence",
    description:
      "Review sales, popular products, customers and delivery performance.",
    metrics: [
      ["Growth", "+18%"],
      ["Top product", "Zinger"],
      ["Repeat rate", "42%"]
    ]
  }
];

function initializeMenu() {
  const button = document.getElementById("menuButton");
  const navigation = document.getElementById("mainNavigation");

  if (!button || !navigation) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    document.body.classList.toggle("menu-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
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

function initializeScrollProgress() {
  const progress = document.getElementById("scrollProgress");

  if (!progress) {
    return;
  }

  function updateProgress() {
    const pageHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const percentage =
      pageHeight > 0
        ? Math.min(100, (window.scrollY / pageHeight) * 100)
        : 0;

    progress.style.width = `${percentage}%`;
  }

  updateProgress();

  window.addEventListener("scroll", updateProgress, {
    passive: true
  });

  window.addEventListener("resize", updateProgress);
}

function initializeReveals() {
  const revealElements = document.querySelectorAll(".reveal");

  revealElements.forEach((element) => {
    const delay = Number(element.dataset.delay || 0);
    element.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach((element) => element.classList.add("visible"));
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
      threshold: 0.12,
      rootMargin: "0px 0px -45px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initializeDemo() {
  const actions = document.getElementById("demoActions");

  if (!actions) {
    return;
  }

  demoScenarios.forEach((scenario, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `demo-action${index === 0 ? " active" : ""}`;
    button.innerHTML = `<span>0${index + 1}</span>${scenario.action}`;
    button.addEventListener("click", () => updateDemo(index));

    actions.appendChild(button);
  });
}

function updateDemo(index) {
  const scenario = demoScenarios[index];

  document.getElementById("customerBubble").textContent = scenario.customer;
  document.getElementById("agentBubble").textContent = scenario.assistant;
  document.getElementById("cartStatus").textContent = scenario.cart;
  document.getElementById("kitchenStatus").textContent = scenario.kitchen;
  document.getElementById("deliveryStatus").textContent = scenario.delivery;
  document.getElementById("revenueStatus").textContent = scenario.revenue;
  document.getElementById("demoStep").textContent =
    `Step ${index + 1}/${demoScenarios.length}`;

  document.querySelectorAll(".demo-action").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === index);
  });
}

function initializeDashboard() {
  const tabs = document.getElementById("dashboardTabs");

  if (!tabs) {
    return;
  }

  dashboardViews.forEach((view, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `tab-button${index === 0 ? " active" : ""}`;
    button.textContent = view.name;
    button.addEventListener("click", () => updateDashboard(index));

    tabs.appendChild(button);
  });

  updateDashboard(0);
}

function updateDashboard(index) {
  const view = dashboardViews[index];

  document.getElementById("dashboardEyebrow").textContent =
    `${view.name} workspace`;

  document.getElementById("dashboardTitle").textContent = view.title;
  document.getElementById("dashboardDescription").textContent =
    view.description;

  document.getElementById("previewTitle").textContent = view.title;

  const metricGrid = document.getElementById("dashboardMetrics");
  const previewMetrics = document.getElementById("previewMetrics");

  metricGrid.innerHTML = "";
  previewMetrics.innerHTML = "";

  view.metrics.forEach(([label, value]) => {
    metricGrid.insertAdjacentHTML(
      "beforeend",
      `<div class="metric">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>`
    );

    previewMetrics.insertAdjacentHTML(
      "beforeend",
      `<div class="preview-metric">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>`
    );
  });

  document.querySelectorAll(".tab-button").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === index);
  });
}

function numberValue(id, fallback = 0) {
  const value = Number(document.getElementById(id)?.value);
  return Number.isFinite(value) ? value : fallback;
}

function calculateRoi() {
  const dailyOrders = Math.max(0, numberValue("dailyOrders"));
  const averageOrderValue = Math.max(
    0,
    numberValue("averageOrderValue")
  );

  const missedPercentage = Math.min(
    100,
    Math.max(0, numberValue("missedPercentage"))
  );

  const locations = Math.max(1, numberValue("locations", 1));

  const recoveredOrders =
    dailyOrders * 30 * locations * (missedPercentage / 100);

  const recoveredRevenue = recoveredOrders * averageOrderValue;
  const hoursSaved = (recoveredOrders * 4) / 60;

  document.getElementById("recoveredOrders").textContent =
    Math.round(recoveredOrders).toLocaleString();

  document.getElementById("recoveredRevenue").textContent =
    `PKR ${Math.round(recoveredRevenue).toLocaleString()}`;

  document.getElementById("hoursSaved").textContent =
    `${Math.round(hoursSaved).toLocaleString()} hours`;
}

function initializeRoiCalculator() {
  [
    "dailyOrders",
    "averageOrderValue",
    "missedPercentage",
    "locations"
  ].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", calculateRoi);
  });

  calculateRoi();
}

function initializeFaq() {
  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item?.querySelector(".faq-answer");
      const icon = button.querySelector("span");

      if (!answer) {
        return;
      }

      const isExpanded = button.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".faq-item button").forEach((otherButton) => {
        const otherItem = otherButton.closest(".faq-item");
        const otherAnswer = otherItem?.querySelector(".faq-answer");
        const otherIcon = otherButton.querySelector("span");

        otherButton.setAttribute("aria-expanded", "false");

        if (otherAnswer) {
          otherAnswer.hidden = true;
        }

        if (otherIcon) {
          otherIcon.textContent = "+";
        }
      });

      if (!isExpanded) {
        button.setAttribute("aria-expanded", "true");
        answer.hidden = false;

        if (icon) {
          icon.textContent = "−";
        }
      }
    });
  });
}

function initializeDemoForm() {
  const form = document.getElementById("demoForm");
  const successMessage = document.getElementById("successMessage");

  if (!form || !successMessage) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    successMessage.classList.add("show");
    form.reset();

    successMessage.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });
}

function initializeHeroSequence() {
  const typing = document.getElementById("heroTyping");
  const message = document.getElementById("heroAgentMessage");
  const kitchenStatus = document.getElementById("kitchenHeroStatus");

  if (!typing || !message || !kitchenStatus) {
    return;
  }

  const stages = [
    {
      message: "Checking menu, stock and delivery…",
      kitchen: "Waiting"
    },
    {
      message: "Items validated. Creating kitchen ticket…",
      kitchen: "Ticket received"
    },
    {
      message: "Order confirmed. Driver is available.",
      kitchen: "Preparing"
    }
  ];

  let activeStage = 0;

  function showStage() {
    typing.hidden = false;
    message.style.opacity = "0";

    window.setTimeout(() => {
      message.textContent = stages[activeStage].message;
      kitchenStatus.textContent = stages[activeStage].kitchen;
      message.style.opacity = "1";
      typing.hidden = true;

      activeStage = (activeStage + 1) % stages.length;
    }, 850);
  }

  message.style.transition = "opacity 220ms ease";
  showStage();

  window.setInterval(showStage, 3500);
}

function initializeYear() {
  const year = document.getElementById("currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeMenu();
  initializeScrollProgress();
  initializeReveals();
  initializeDemo();
  initializeDashboard();
  initializeRoiCalculator();
  initializeFaq();
  initializeDemoForm();
  initializeHeroSequence();
  initializeYear();
});
