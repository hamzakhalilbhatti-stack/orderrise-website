const demoScenarios = [
  { action:"Show menu", customer:"Show me the menu", assistant:"Here are the most popular items.", cart:"Empty", kitchen:"Waiting", delivery:"Not required", revenue:"PKR 0" },
  { action:"Add burgers", customer:"Add two chicken burgers", assistant:"Two chicken burgers were added. Would you like any changes?", cart:"2 items", kitchen:"Ticket drafted", delivery:"Not selected", revenue:"PKR 1,598" },
  { action:"Make one spicy", customer:"Make one spicy", assistant:"Done. One burger is spicy and the other remains regular.", cart:"2 customized items", kitchen:"Instructions updated", delivery:"Not selected", revenue:"PKR 1,598" },
  { action:"Apply SAVE10", customer:"Apply SAVE10", assistant:"The demonstration coupon has been applied.", cart:"10% discount", kitchen:"Ticket ready", delivery:"Not selected", revenue:"PKR 1,438" },
  { action:"Choose delivery", customer:"I want delivery", assistant:"Delivery selected. Please provide your address.", cart:"Delivery order", kitchen:"Awaiting confirmation", delivery:"Address required", revenue:"PKR 1,588" },
  { action:"Confirm order", customer:"Confirm my order", assistant:"Order 1042 is confirmed and sent to the kitchen.", cart:"Confirmed", kitchen:"Preparing", delivery:"Driver available", revenue:"PKR 1,588" }
];

const dashboardViews = [
  { name:"Owner", title:"Owner Admin Hub", description:"See active orders, customer information, alerts and restaurant status.", metrics:[["Orders today","128"],["Revenue","PKR 184K"],["Average order","PKR 1,438"]] },
  { name:"Kitchen", title:"Kitchen Display", description:"Accept orders, manage preparation and highlight delayed tickets.", metrics:[["New","8"],["Preparing","12"],["Ready","5"]] },
  { name:"Customer", title:"Customer WhatsApp", description:"Customers order naturally without downloading another app.", metrics:[["Cart items","3"],["Discount","10%"],["Status","Confirmed"]] },
  { name:"Driver", title:"Driver Workspace", description:"Drivers receive assignments and update delivery progress.", metrics:[["Assigned","4"],["Delivered","11"],["COD pending","PKR 8K"]] },
  { name:"Reports", title:"Owner Intelligence", description:"Review sales, popular products, customers and delivery performance.", metrics:[["Growth","+18%"],["Top product","Zinger"],["Repeat rate","42%"]] }
];

function initMenu() {
  const button = document.getElementById("menuButton");
  const nav = document.getElementById("mainNavigation");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function initDemo() {
  const container = document.getElementById("demoActions");
  if (!container) return;

  demoScenarios.forEach((scenario, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "demo-action" + (index === 0 ? " active" : "");
    button.innerHTML = `<span>0${index + 1}</span>${scenario.action}`;
    button.addEventListener("click", () => updateDemo(index));
    container.appendChild(button);
  });
}

function updateDemo(index) {
  const item = demoScenarios[index];
  document.getElementById("customerBubble").textContent = item.customer;
  document.getElementById("agentBubble").textContent = item.assistant;
  document.getElementById("cartStatus").textContent = item.cart;
  document.getElementById("kitchenStatus").textContent = item.kitchen;
  document.getElementById("deliveryStatus").textContent = item.delivery;
  document.getElementById("revenueStatus").textContent = item.revenue;
  document.getElementById("demoStep").textContent = `Step ${index + 1}/${demoScenarios.length}`;

  document.querySelectorAll(".demo-action").forEach((button, i) => {
    button.classList.toggle("active", i === index);
  });
}

function initDashboard() {
  const container = document.getElementById("dashboardTabs");
  if (!container) return;

  dashboardViews.forEach((view, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab-button" + (index === 0 ? " active" : "");
    button.textContent = view.name;
    button.addEventListener("click", () => updateDashboard(index));
    container.appendChild(button);
  });

  updateDashboard(0);
}

function updateDashboard(index) {
  const view = dashboardViews[index];
  document.getElementById("dashboardEyebrow").textContent = `${view.name} workspace`;
  document.getElementById("dashboardTitle").textContent = view.title;
  document.getElementById("dashboardDescription").textContent = view.description;
  document.getElementById("previewTitle").textContent = view.title;

  const metrics = document.getElementById("dashboardMetrics");
  const preview = document.getElementById("previewMetrics");
  metrics.innerHTML = "";
  preview.innerHTML = "";

  view.metrics.forEach(([label, value]) => {
    metrics.insertAdjacentHTML("beforeend", `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`);
    preview.insertAdjacentHTML("beforeend", `<div class="preview-metric"><span>${label}</span><strong>${value}</strong></div>`);
  });

  document.querySelectorAll(".tab-button").forEach((button, i) => {
    button.classList.toggle("active", i === index);
  });
}

function numberValue(id, fallback = 0) {
  const value = Number(document.getElementById(id)?.value);
  return Number.isFinite(value) ? value : fallback;
}

function calculateRoi() {
  const dailyOrders = Math.max(0, numberValue("dailyOrders"));
  const averageOrder = Math.max(0, numberValue("averageOrderValue"));
  const missed = Math.min(100, Math.max(0, numberValue("missedPercentage")));
  const locations = Math.max(1, numberValue("locations", 1));

  const recovered = dailyOrders * 30 * locations * (missed / 100);
  const revenue = recovered * averageOrder;
  const hours = (recovered * 4) / 60;

  document.getElementById("recoveredOrders").textContent = Math.round(recovered).toLocaleString();
  document.getElementById("recoveredRevenue").textContent = `PKR ${Math.round(revenue).toLocaleString()}`;
  document.getElementById("hoursSaved").textContent = `${Math.round(hours).toLocaleString()} hours`;
}

function initRoi() {
  ["dailyOrders","averageOrderValue","missedPercentage","locations"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", calculateRoi);
  });
  calculateRoi();
}

function initForm() {
  const form = document.getElementById("demoForm");
  const success = document.getElementById("successMessage");
  if (!form || !success) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    success.classList.add("show");
    form.reset();
    success.scrollIntoView({ behavior:"smooth", block:"nearest" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initDemo();
  initDashboard();
  initRoi();
  initForm();

  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();
});
