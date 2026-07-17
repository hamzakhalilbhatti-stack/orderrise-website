
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const C = {
  bg: 0x050608,
  dark: 0x0d1015,
  surface: 0x151920,
  surface2: 0x1b2028,
  green: 0x25d366,
  greenLight: 0x68ff9b,
  amber: 0xffb547,
  red: 0xff5a67,
  white: 0xf7f8fa,
  muted: 0x9ba3af,
  blue: 0x62b7ff,
  purple: 0x9d7cff
};

const runners = [];
const clock = new THREE.Clock();
let soundEnabled = false;
let audioContext = null;

function beep(frequency = 540, duration = 0.06, volume = 0.025) {
  if (!soundEnabled) return;
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (_) {}
}

function setFallback(canvasId) {
  const fallback = document.querySelector(`[data-fallback-for="${canvasId}"]`);
  if (fallback) fallback.classList.add("show");
}

function createRenderer(canvas, alpha = true) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}

function resizeRunner(runner) {
  const rect = runner.canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const current = runner.renderer.getSize(new THREE.Vector2());
  if (current.x !== width || current.y !== height) {
    runner.renderer.setSize(width, height, false);
    runner.camera.aspect = width / height;
    runner.camera.updateProjectionMatrix();
  }
}

function registerRunner(runner) {
  runners.push(runner);
  resizeRunner(runner);
  const resizeObserver = new ResizeObserver(() => resizeRunner(runner));
  resizeObserver.observe(runner.canvas);
  runner.resizeObserver = resizeObserver;

  runner.active = true;
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      runner.active = entries.some(entry => entry.isIntersecting);
    }, { rootMargin: "250px" });
    observer.observe(runner.canvas);
    runner.visibilityObserver = observer;
  }
}

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = performance.now() * 0.001;
  for (const runner of runners) {
    if (!runner.active) continue;
    resizeRunner(runner);
    if (runner.update) runner.update(dt, t);
    if (runner.controls) runner.controls.update(dt);
    runner.renderer.render(runner.scene, runner.camera);
  }
  requestAnimationFrame(animate);
}

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: options.metalness ?? 0.35,
    roughness: options.roughness ?? 0.42,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    side: options.side ?? THREE.FrontSide
  });
}

function basicMaterial(color, opacity = 1) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
    toneMapped: false
  });
}

function roundedBox(w, h, d, color, radius = 0.12, options = {}) {
  const geometry = new RoundedBoxGeometry(w, h, d, options.segments ?? 4, Math.min(radius, w / 2, h / 2, d / 2));
  const mesh = new THREE.Mesh(geometry, options.basic ? basicMaterial(color, options.opacity ?? 1) : material(color, options));
  mesh.castShadow = options.castShadow ?? true;
  mesh.receiveShadow = options.receiveShadow ?? true;
  return mesh;
}

function cylinder(radiusTop, radiusBottom, height, color, options = {}) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, options.radialSegments ?? 24),
    options.basic ? basicMaterial(color, options.opacity ?? 1) : material(color, options)
  );
  mesh.castShadow = options.castShadow ?? true;
  mesh.receiveShadow = options.receiveShadow ?? true;
  return mesh;
}

function plane(w, h, color, options = {}) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    options.basic ? basicMaterial(color, options.opacity ?? 1) : material(color, options)
  );
  mesh.castShadow = options.castShadow ?? false;
  mesh.receiveShadow = options.receiveShadow ?? false;
  return mesh;
}

function addLights(scene, intensity = 1) {
  const hemi = new THREE.HemisphereLight(0xbfe8ff, 0x07090d, 1.7 * intensity);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 2.6 * intensity);
  key.position.set(7, 12, 9);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -15;
  key.shadow.camera.right = 15;
  key.shadow.camera.top = 15;
  key.shadow.camera.bottom = -15;
  scene.add(key);

  const green = new THREE.PointLight(C.green, 18 * intensity, 18, 2);
  green.position.set(0, 4.5, 1);
  scene.add(green);

  const amber = new THREE.PointLight(C.amber, 9 * intensity, 11, 2);
  amber.position.set(-4, 3, -3);
  scene.add(amber);
}

function createTextSprite(text, options = {}) {
  const scale = options.scale ?? 1;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const fontSize = options.fontSize ?? 44;
  const paddingX = options.paddingX ?? 28;
  const paddingY = options.paddingY ?? 18;
  ctx.font = `${options.weight ?? 700} ${fontSize}px Inter, Arial`;
  const width = Math.ceil(ctx.measureText(text).width + paddingX * 2);
  const height = Math.ceil(fontSize + paddingY * 2);
  canvas.width = width * 2;
  canvas.height = height * 2;
  ctx.scale(2, 2);
  ctx.font = `${options.weight ?? 700} ${fontSize}px Inter, Arial`;
  ctx.textBaseline = "middle";
  ctx.fillStyle = options.background ?? "rgba(8,10,13,.82)";
  const radius = options.radius ?? 18;
  roundRect2D(ctx, 0, 0, width, height, radius);
  ctx.fill();
  if (options.border) {
    ctx.strokeStyle = options.border;
    ctx.lineWidth = 1.5;
    roundRect2D(ctx, 1, 1, width - 2, height - 2, radius);
    ctx.stroke();
  }
  ctx.fillStyle = options.color ?? "#f7f8fa";
  ctx.fillText(text, paddingX, height / 2 + 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    toneMapped: false
  }));
  sprite.scale.set((width / 110) * scale, (height / 110) * scale, 1);
  sprite.userData.texture = texture;
  return sprite;
}

function roundRect2D(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function createFloor(sizeX = 13, sizeZ = 9) {
  const group = new THREE.Group();
  const floor = roundedBox(sizeX, 0.35, sizeZ, C.surface, 0.22, { roughness: 0.58 });
  floor.position.y = -0.18;
  group.add(floor);

  const grid = new THREE.GridHelper(Math.max(sizeX, sizeZ), 18, C.green, 0x303740);
  grid.scale.x = sizeX / Math.max(sizeX, sizeZ);
  grid.scale.z = sizeZ / Math.max(sizeX, sizeZ);
  grid.position.y = 0.01;
  grid.material.transparent = true;
  grid.material.opacity = 0.13;
  group.add(grid);
  return group;
}

function createScreen(w = 2.2, h = 1.3, color = C.green, label = "") {
  const group = new THREE.Group();
  const body = roundedBox(w, h, 0.16, C.surface2, 0.09, { metalness: 0.55, roughness: 0.28 });
  group.add(body);
  const display = plane(w * 0.84, h * 0.72, color, { basic: true, opacity: 0.72 });
  display.position.z = 0.09;
  group.add(display);
  if (label) {
    const sprite = createTextSprite(label, { fontSize: 28, scale: 0.55, background: "rgba(5,6,8,.78)", color: "#f7f8fa" });
    sprite.position.set(0, 0, 0.13);
    group.add(sprite);
  }
  group.userData.display = display;
  return group;
}

function createPhone(scale = 1) {
  const group = new THREE.Group();
  const body = roundedBox(2.15, 4.35, 0.34, 0x080a0d, 0.28, { metalness: 0.65, roughness: 0.23 });
  group.add(body);
  const screen = roundedBox(1.88, 3.95, 0.08, 0x111821, 0.19, { basic: true });
  screen.position.z = 0.2;
  group.add(screen);

  const header = roundedBox(1.55, 0.36, 0.035, C.surface2, 0.09, { basic: true });
  header.position.set(0, 1.48, 0.26);
  group.add(header);

  const avatar = cylinder(0.13, 0.13, 0.05, C.green, { basic: true });
  avatar.rotation.x = Math.PI / 2;
  avatar.position.set(-0.58, 1.48, 0.29);
  group.add(avatar);

  const bubble1 = roundedBox(1.42, 0.66, 0.04, C.green, 0.16, { basic: true });
  bubble1.position.set(0.15, 0.62, 0.27);
  group.add(bubble1);

  const bubble2 = roundedBox(1.37, 0.58, 0.04, C.surface2, 0.15, { basic: true });
  bubble2.position.set(-0.16, -0.18, 0.27);
  group.add(bubble2);

  const bubble3 = roundedBox(1.2, 0.5, 0.04, C.surface2, 0.15, { basic: true });
  bubble3.position.set(-0.24, -0.87, 0.27);
  group.add(bubble3);

  const home = cylinder(0.11, 0.11, 0.025, 0x2d333b, { basic: true });
  home.rotation.x = Math.PI / 2;
  home.position.set(0, -1.88, 0.24);
  group.add(home);

  group.scale.setScalar(scale);
  group.userData.bubbles = [bubble1, bubble2, bubble3];
  return group;
}

function createBurger(scale = 1) {
  const group = new THREE.Group();
  const bottom = cylinder(0.48, 0.42, 0.22, 0xe6a54c, { roughness: 0.64 });
  bottom.position.y = 0.11;
  group.add(bottom);
  const patty = cylinder(0.44, 0.44, 0.18, 0x5a2e20, { roughness: 0.8 });
  patty.position.y = 0.31;
  group.add(patty);
  const cheese = roundedBox(0.72, 0.055, 0.72, 0xffc928, 0.03, { roughness: 0.6 });
  cheese.position.y = 0.43;
  cheese.rotation.y = Math.PI / 4;
  group.add(cheese);
  const lettuce = cylinder(0.47, 0.45, 0.08, 0x5bd96a, { roughness: 0.7 });
  lettuce.position.y = 0.51;
  group.add(lettuce);
  const top = cylinder(0.43, 0.5, 0.32, 0xf0b75f, { roughness: 0.58 });
  top.position.y = 0.71;
  group.add(top);
  group.scale.setScalar(scale);
  group.userData.cheese = cheese;
  return group;
}

function createCart() {
  const group = new THREE.Group();
  const basket = roundedBox(2.2, 1.05, 1.45, C.surface2, 0.16, { metalness: 0.45 });
  basket.position.y = 0.8;
  group.add(basket);
  const rim = new THREE.LineSegments(
    new THREE.EdgesGeometry(new RoundedBoxGeometry(2.05, 0.9, 1.3, 3, 0.12)),
    new THREE.LineBasicMaterial({ color: C.greenLight, transparent: true, opacity: 0.55 })
  );
  rim.position.y = 0.8;
  group.add(rim);
  for (const x of [-0.72, 0.72]) {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.07, 10, 24), material(0x20252c, { metalness: 0.2, roughness: 0.6 }));
    wheel.rotation.y = Math.PI / 2;
    wheel.position.set(x, 0.18, 0.58);
    group.add(wheel);
  }
  return group;
}

function createScooter(scale = 1) {
  const group = new THREE.Group();
  const wheelMat = material(0x1b1f25, { roughness: 0.72 });
  for (const z of [-0.75, 0.72]) {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.1, 12, 28), wheelMat);
    wheel.rotation.y = Math.PI / 2;
    wheel.position.set(0, 0.42, z);
    group.add(wheel);
  }
  const body = roundedBox(0.75, 0.45, 1.25, C.green, 0.18, { metalness: 0.35 });
  body.position.set(0, 0.72, 0);
  group.add(body);
  const stem = cylinder(0.055, 0.055, 1.0, C.surface2, { metalness: 0.65 });
  stem.position.set(0, 1.25, -0.42);
  stem.rotation.x = -0.18;
  group.add(stem);
  const handle = roundedBox(0.8, 0.08, 0.08, C.surface2, 0.04, { metalness: 0.65 });
  handle.position.set(0, 1.7, -0.58);
  group.add(handle);
  const bag = roundedBox(0.9, 0.9, 0.72, C.amber, 0.12, { roughness: 0.58 });
  bag.position.set(0, 1.2, 0.42);
  group.add(bag);
  group.scale.setScalar(scale);
  return group;
}

function createLaptop(scale = 1, color = C.green, label = "Owner Hub") {
  const group = new THREE.Group();
  const screenBody = roundedBox(3.4, 2.15, 0.16, C.surface2, 0.13, { metalness: 0.65, roughness: 0.27 });
  screenBody.position.y = 1.35;
  screenBody.rotation.x = -0.08;
  group.add(screenBody);
  const display = plane(3.0, 1.72, color, { basic: true, opacity: 0.68 });
  display.position.set(0, 1.35, 0.09);
  display.rotation.x = -0.08;
  group.add(display);
  const labelSprite = createTextSprite(label, { fontSize: 30, scale: 0.72, background: "rgba(5,6,8,.72)" });
  labelSprite.position.set(0, 1.35, 0.14);
  group.add(labelSprite);
  const base = roundedBox(3.7, 0.16, 2.25, 0x222830, 0.11, { metalness: 0.72, roughness: 0.24 });
  base.position.set(0, 0.23, 0.85);
  base.rotation.x = -0.07;
  group.add(base);
  const track = roundedBox(0.8, 0.025, 0.52, 0x0d1015, 0.05, { roughness: 0.5 });
  track.position.set(0, 0.33, 0.78);
  group.add(track);
  group.scale.setScalar(scale);
  group.userData.display = display;
  return group;
}

function createTablet(scale = 1, color = C.amber, label = "Kitchen") {
  const group = new THREE.Group();
  const body = roundedBox(2.4, 3.2, 0.2, C.surface2, 0.2, { metalness: 0.62, roughness: 0.28 });
  group.add(body);
  const display = plane(2.08, 2.76, color, { basic: true, opacity: 0.65 });
  display.position.z = 0.12;
  group.add(display);
  const sprite = createTextSprite(label, { fontSize: 30, scale: 0.58, background: "rgba(5,6,8,.72)" });
  sprite.position.set(0, 0, 0.17);
  group.add(sprite);
  group.scale.setScalar(scale);
  group.userData.display = display;
  return group;
}

function createDashboardPanel(w = 3.2, h = 2.1, color = C.green, label = "Dashboard") {
  const group = new THREE.Group();
  const body = roundedBox(w, h, 0.16, C.surface2, 0.12, { metalness: 0.55, roughness: 0.3, transparent: true, opacity: 0.94 });
  group.add(body);
  const display = plane(w * 0.87, h * 0.78, 0x0b1115, { basic: true });
  display.position.z = 0.09;
  group.add(display);
  const labelSprite = createTextSprite(label, { fontSize: 26, scale: 0.58, background: "rgba(37,211,102,.12)", color: "#68ff9b" });
  labelSprite.position.set(0, h * 0.25, 0.13);
  group.add(labelSprite);
  const bars = [];
  for (let i = 0; i < 5; i++) {
    const bar = roundedBox(0.23, 0.55 + i * 0.15, 0.05, i === 4 ? C.greenLight : color, 0.04, { basic: true });
    bar.position.set(-0.75 + i * 0.37, -0.32 + (bar.geometry.parameters?.height || 0) * 0.05, 0.13);
    group.add(bar);
    bars.push(bar);
  }
  group.userData.bars = bars;
  group.userData.display = display;
  return group;
}

function createKitchen() {
  const group = new THREE.Group();
  const counter = roundedBox(3.1, 0.75, 1.45, 0x242a31, 0.14, { metalness: 0.5, roughness: 0.4 });
  counter.position.y = 0.38;
  group.add(counter);
  for (const x of [-0.8, 0, 0.8]) {
    const burner = cylinder(0.27, 0.27, 0.05, 0x090b0e, { metalness: 0.65 });
    burner.position.set(x, 0.79, 0);
    group.add(burner);
  }
  const screen = createScreen(2.1, 1.25, C.amber, "KITCHEN");
  screen.position.set(0, 1.65, -0.35);
  screen.rotation.x = -0.08;
  group.add(screen);
  const ticket = roundedBox(0.95, 1.25, 0.05, C.white, 0.06, { basic: true });
  ticket.position.set(1.25, 1.65, -0.2);
  ticket.rotation.y = -0.18;
  group.add(ticket);
  const ticketLabel = createTextSprite("#1042 · 2 BURGERS", { fontSize: 24, scale: 0.42, background: "rgba(5,6,8,.88)", color: "#68ff9b" });
  ticketLabel.position.set(1.25, 1.65, -0.15);
  group.add(ticketLabel);
  const label = createTextSprite("KITCHEN", { fontSize: 28, scale: 0.55, background: "rgba(255,181,71,.13)", color: "#ffb547" });
  label.position.set(0, 2.55, 0);
  group.add(label);
  group.userData.ticket = ticket;
  group.userData.ticketLabel = ticketLabel;
  group.userData.screen = screen;
  return group;
}

function createInventory() {
  const group = new THREE.Group();
  const back = roundedBox(3, 2.6, 0.28, 0x242a31, 0.1, { metalness: 0.55 });
  back.position.set(0, 1.3, -0.45);
  group.add(back);
  for (const y of [0.5, 1.3, 2.1]) {
    const shelf = roundedBox(3.0, 0.08, 1.1, 0x353c45, 0.04, { metalness: 0.72 });
    shelf.position.set(0, y, 0);
    group.add(shelf);
  }
  const boxes = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const box = roundedBox(0.52, 0.42, 0.66, row === 0 ? C.amber : 0x8d6842, 0.07, { roughness: 0.72 });
      box.position.set(-1.05 + col * 0.7, 0.76 + row * 0.8, 0);
      group.add(box);
      boxes.push(box);
    }
  }
  const label = createTextSprite("INVENTORY", { fontSize: 28, scale: 0.55, background: "rgba(104,255,155,.12)", color: "#68ff9b" });
  label.position.set(0, 3.15, 0);
  group.add(label);
  group.userData.boxes = boxes;
  return group;
}

function createDeliveryStation() {
  const group = new THREE.Group();
  const pad = roundedBox(3.2, 0.24, 2.4, 0x1f252c, 0.18, { roughness: 0.6 });
  pad.position.y = 0.12;
  group.add(pad);
  const scooter = createScooter(0.72);
  scooter.position.set(0, 0.1, 0);
  scooter.rotation.y = Math.PI / 2;
  group.add(scooter);
  const station = createScreen(1.8, 1.1, C.blue, "DELIVERY");
  station.position.set(-0.85, 1.55, -0.72);
  station.rotation.y = 0.22;
  group.add(station);
  const label = createTextSprite("DELIVERY", { fontSize: 28, scale: 0.55, background: "rgba(98,183,255,.12)", color: "#62b7ff" });
  label.position.set(0, 2.75, 0);
  group.add(label);
  group.userData.scooter = scooter;
  return group;
}

function createOwnerZone() {
  const group = new THREE.Group();
  const desk = roundedBox(3.25, 0.25, 1.65, 0x2c333b, 0.12, { metalness: 0.45 });
  desk.position.y = 0.78;
  group.add(desk);
  for (const x of [-1.2, 1.2]) {
    const leg = roundedBox(0.16, 1.45, 0.16, 0x242a31, 0.05, { metalness: 0.55 });
    leg.position.set(x, 0.05, 0);
    group.add(leg);
  }
  const laptop = createLaptop(0.65, C.green, "OWNER");
  laptop.position.set(0, 0.65, -0.1);
  group.add(laptop);
  const panel = createDashboardPanel(2.0, 1.35, C.green, "SALES");
  panel.position.set(0, 2.55, -0.5);
  panel.rotation.x = -0.07;
  group.add(panel);
  const label = createTextSprite("OWNER INTELLIGENCE", { fontSize: 28, scale: 0.55, background: "rgba(37,211,102,.12)", color: "#68ff9b" });
  label.position.set(0, 3.5, 0);
  group.add(label);
  group.userData.panel = panel;
  return group;
}

function createAICore(scale = 1) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.75, 3),
    new THREE.MeshStandardMaterial({
      color: C.green,
      emissive: C.green,
      emissiveIntensity: 1.4,
      metalness: 0.35,
      roughness: 0.2,
      transparent: true,
      opacity: 0.92
    })
  );
  group.add(core);
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.025, 8, 80), basicMaterial(C.greenLight, 0.7));
  ring1.rotation.x = Math.PI / 2;
  group.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.018, 8, 80), basicMaterial(C.green, 0.36));
  ring2.rotation.y = Math.PI / 2.7;
  group.add(ring2);
  const label = createTextSprite("AI ORDER CORE", { fontSize: 28, scale: 0.52, background: "rgba(37,211,102,.12)", color: "#68ff9b" });
  label.position.set(0, 1.65, 0);
  group.add(label);
  group.scale.setScalar(scale);
  group.userData.core = core;
  group.userData.rings = [ring1, ring2];
  return group;
}

function createRestaurant(scale = 1) {
  const root = new THREE.Group();
  root.add(createFloor(13, 9));

  const backWall = roundedBox(13, 3.6, 0.16, 0x14181e, 0.06, { transparent: true, opacity: 0.68, roughness: 0.65 });
  backWall.position.set(0, 1.8, -4.35);
  root.add(backWall);

  const leftWall = roundedBox(0.16, 3.6, 5.3, 0x14181e, 0.06, { transparent: true, opacity: 0.42, roughness: 0.65 });
  leftWall.position.set(-6.4, 1.8, -1.75);
  root.add(leftWall);

  const kitchen = createKitchen();
  kitchen.position.set(-3.2, 0, -2.0);
  kitchen.rotation.y = 0.03;
  root.add(kitchen);

  const inventory = createInventory();
  inventory.position.set(3.15, 0, -2.05);
  root.add(inventory);

  const delivery = createDeliveryStation();
  delivery.position.set(3.2, 0, 2.1);
  root.add(delivery);

  const owner = createOwnerZone();
  owner.position.set(-3.0, 0, 2.0);
  root.add(owner);

  const core = createAICore(0.72);
  core.position.set(0, 1.55, 0.05);
  root.add(core);

  root.scale.setScalar(scale);
  root.userData = { kitchen, inventory, delivery, owner, core };
  return root;
}

function createCurvePath(points, color = C.green) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.32);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 100, 0.035, 8, false),
    basicMaterial(color, 0.54)
  );
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 18, 18),
    new THREE.MeshBasicMaterial({ color: C.greenLight, toneMapped: false })
  );
  const light = new THREE.PointLight(C.greenLight, 7, 2.6, 2);
  orb.add(light);
  return { curve, tube, orb };
}

function setupScene(canvasId, cameraPosition, target = new THREE.Vector3()) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  try {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(C.bg);
    scene.fog = new THREE.FogExp2(C.bg, 0.025);
    const renderer = createRenderer(canvas);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.copy(cameraPosition);
    const controls = new OrbitControls(camera, canvas);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 28;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.update();
    const runner = { canvas, renderer, scene, camera, controls, active: true, update: null };
    registerRunner(runner);
    return runner;
  } catch (error) {
    console.error(`OrderRise 3D failed for ${canvasId}`, error);
    setFallback(canvasId);
    return null;
  }
}

function buildHero() {
  const runner = setupScene("hero3dCanvas", new THREE.Vector3(13.5, 9.2, 14.5), new THREE.Vector3(0, 1.2, 0));
  if (!runner) return null;
  addLights(runner.scene, 1.05);

  const world = new THREE.Group();
  runner.scene.add(world);
  const restaurant = createRestaurant(0.88);
  restaurant.position.set(1.2, 0, 0);
  world.add(restaurant);

  const phone = createPhone(0.82);
  phone.position.set(-6.8, 3.15, 0.5);
  phone.rotation.set(-0.06, 0.38, -0.1);
  world.add(phone);

  const path = createCurvePath([
    new THREE.Vector3(-5.9, 2.9, 0.45),
    new THREE.Vector3(-2.4, 2.35, 0.3),
    new THREE.Vector3(1.2, 1.55, 0.05),
    new THREE.Vector3(-1.8, 1.55, -1.5),
    new THREE.Vector3(4.1, 1.5, -1.55),
    new THREE.Vector3(4.15, 1.35, 2.0),
    new THREE.Vector3(-1.6, 2.0, 1.75)
  ]);
  world.add(path.tube, path.orb);

  const message = createTextSprite("NEW WHATSAPP ORDER", { fontSize: 28, scale: 0.72, background: "rgba(37,211,102,.14)", color: "#68ff9b", border: "rgba(104,255,155,.35)" });
  message.position.set(-5.3, 5.6, 0.4);
  world.add(message);

  const cameraGoals = {
    overview: [new THREE.Vector3(13.5, 9.2, 14.5), new THREE.Vector3(0, 1.2, 0)],
    phone: [new THREE.Vector3(-2.8, 4.7, 7.6), new THREE.Vector3(-6.5, 2.6, 0.4)],
    kitchen: [new THREE.Vector3(-4.8, 5.0, 6.3), new THREE.Vector3(-1.7, 1.2, -1.7)],
    inventory: [new THREE.Vector3(8.6, 4.8, 5.8), new THREE.Vector3(4.0, 1.3, -1.8)],
    delivery: [new THREE.Vector3(8.5, 4.5, 8.2), new THREE.Vector3(4.1, 1.2, 1.9)],
    owner: [new THREE.Vector3(-6.8, 5.1, 7.0), new THREE.Vector3(-1.4, 1.7, 1.8)]
  };
  let cameraGoal = cameraGoals.overview[0].clone();
  let targetGoal = cameraGoals.overview[1].clone();
  let phase = -1;
  let mouseX = 0, mouseY = 0;
  runner.canvas.addEventListener("pointermove", event => {
    const rect = runner.canvas.getBoundingClientRect();
    mouseX = (event.clientX - rect.left) / rect.width - 0.5;
    mouseY = (event.clientY - rect.top) / rect.height - 0.5;
  });

  runner.update = (dt, t) => {
    phone.position.y = 3.15 + Math.sin(t * 1.25) * 0.12;
    phone.rotation.z = -0.1 + Math.sin(t * 0.7) * 0.025;
    restaurant.userData.core.userData.core.rotation.y += dt * 0.55;
    restaurant.userData.core.userData.rings[0].rotation.z += dt * 0.35;
    restaurant.userData.core.userData.rings[1].rotation.x += dt * 0.28;
    restaurant.userData.delivery.userData.scooter.position.z = Math.sin(t * 0.6) * 0.2;
    restaurant.userData.owner.userData.panel.userData.bars.forEach((bar, i) => {
      bar.scale.y = 0.72 + Math.sin(t * 1.2 + i * 0.5) * 0.16;
    });
    const progress = (t * 0.095) % 1;
    path.orb.position.copy(path.curve.getPointAt(progress));
    path.orb.scale.setScalar(0.8 + Math.sin(t * 5) * 0.2);
    world.rotation.y += (mouseX * 0.07 - world.rotation.y) * 0.018;
    world.rotation.x += (-mouseY * 0.025 - world.rotation.x) * 0.018;
    runner.camera.position.lerp(cameraGoal, 0.055);
    runner.controls.target.lerp(targetGoal, 0.07);

    const nextPhase = Math.floor(progress * 6);
    if (nextPhase !== phase) {
      phase = nextPhase;
      const status = ["Message received","AI understanding","Kitchen ticket","Stock validated","Driver assigned","Owner updated"][phase] || "Connected";
      const node = document.getElementById("heroStatusText");
      if (node) node.textContent = status;
      beep(440 + phase * 55, 0.045, 0.018);
    }
  };

  return {
    focus(key) {
      const pair = cameraGoals[key] || cameraGoals.overview;
      cameraGoal = pair[0].clone();
      targetGoal = pair[1].clone();
      beep(620, 0.05, 0.02);
    }
  };
}

function buildOrderDemo() {
  const runner = setupScene("orderDemoCanvas", new THREE.Vector3(10.5, 7.3, 12.2), new THREE.Vector3(0, 1.1, 0));
  if (!runner) return null;
  addLights(runner.scene, 0.9);

  const world = new THREE.Group();
  runner.scene.add(world);
  world.add(createFloor(12, 8));

  const phone = createPhone(0.58);
  phone.position.set(-4.6, 2.4, 0.2);
  phone.rotation.y = 0.35;
  world.add(phone);

  const cart = createCart();
  cart.position.set(-0.9, 0, 0.8);
  world.add(cart);

  const burger1 = createBurger(0.78);
  const burger2 = createBurger(0.78);
  burger1.position.set(-1.3, 1.25, 0.75);
  burger2.position.set(-0.45, 1.25, 0.75);
  burger1.visible = burger2.visible = false;
  world.add(burger1, burger2);

  const spicy = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), basicMaterial(C.red));
  spicy.position.set(-1.3, 2.1, 0.75);
  spicy.visible = false;
  world.add(spicy);

  const inventory = createInventory();
  inventory.scale.setScalar(0.72);
  inventory.position.set(3.9, 0, -1.8);
  world.add(inventory);

  const kitchen = createKitchen();
  kitchen.scale.setScalar(0.7);
  kitchen.position.set(3.6, 0, 1.85);
  world.add(kitchen);
  kitchen.userData.ticket.visible = false;
  kitchen.userData.ticketLabel.visible = false;

  const scooter = createScooter(0.62);
  scooter.position.set(3.8, 0.08, 2.9);
  scooter.rotation.y = Math.PI / 2;
  scooter.visible = false;
  world.add(scooter);

  const dashboard = createDashboardPanel(2.45, 1.55, C.green, "REVENUE");
  dashboard.position.set(0.2, 4.25, -2.4);
  dashboard.rotation.x = -0.08;
  world.add(dashboard);

  const coupon = createTextSprite("SAVE10 APPLIED", { fontSize: 28, scale: 0.66, background: "rgba(37,211,102,.14)", color: "#68ff9b" });
  coupon.position.set(-0.8, 3.15, 0.6);
  coupon.visible = false;
  world.add(coupon);

  const route = createCurvePath([
    new THREE.Vector3(3.7, 0.55, 2.9),
    new THREE.Vector3(1.8, 0.5, 3.2),
    new THREE.Vector3(-0.2, 0.5, 3.4),
    new THREE.Vector3(-2.4, 0.5, 2.9)
  ], C.blue);
  route.tube.visible = route.orb.visible = false;
  world.add(route.tube, route.orb);

  let stage = 0;
  let transitionStart = performance.now() * 0.001;

  function applyStage(next) {
    stage = next;
    transitionStart = performance.now() * 0.001;
    burger1.visible = burger2.visible = stage >= 1;
    spicy.visible = stage >= 2;
    burger1.userData.cheese.visible = burger2.userData.cheese.visible = stage >= 3;
    coupon.visible = stage >= 4;
    scooter.visible = stage >= 5;
    kitchen.userData.ticket.visible = kitchen.userData.ticketLabel.visible = stage >= 6;
    route.tube.visible = route.orb.visible = stage >= 7;

    inventory.userData.boxes.forEach((box, i) => {
      box.visible = i < (stage >= 3 ? 9 : stage >= 1 ? 10 : 12);
    });
    dashboard.userData.bars.forEach((bar, i) => {
      bar.scale.y = stage === 0 ? 0.45 : 0.75 + i * 0.1 + stage * 0.03;
    });
    if (stage >= 1) {
      burger1.position.set(-4.0, 2.25, 0.25);
      burger2.position.set(-4.0, 1.5, 0.25);
    }
    beep(480 + stage * 55, 0.055, 0.022);
  }

  runner.update = (dt, t) => {
    phone.position.y = 2.4 + Math.sin(t * 1.2) * 0.09;
    dashboard.position.y = 4.25 + Math.sin(t * 0.8) * 0.08;
    const elapsed = Math.min(1, (t - transitionStart) / 1.1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    if (stage >= 1 && elapsed < 1) {
      burger1.position.lerpVectors(new THREE.Vector3(-4.0,2.25,.25), new THREE.Vector3(-1.3,1.25,.75), eased);
      burger2.position.lerpVectors(new THREE.Vector3(-4.0,1.5,.25), new THREE.Vector3(-.45,1.25,.75), eased);
    }
    if (spicy.visible) spicy.position.y = 2.1 + Math.sin(t * 3) * 0.08;
    if (coupon.visible) coupon.position.y = 3.15 + Math.sin(t * 1.4) * 0.08;
    if (scooter.visible) {
      scooter.position.x = stage >= 7 ? 3.8 - ((t * 0.55) % 1) * 6.2 : 3.8;
    }
    if (route.orb.visible) route.orb.position.copy(route.curve.getPointAt((t * 0.18) % 1));
    kitchen.userData.screen.userData.display.material.opacity = 0.55 + Math.sin(t * 2.2) * 0.12;
  };
  applyStage(0);
  return { setStage: applyStage };
}

function buildJourney() {
  const runner = setupScene("journeyCanvas", new THREE.Vector3(12.5, 8.5, 13.5), new THREE.Vector3(0, 1.2, 0));
  if (!runner) return null;
  addLights(runner.scene, 0.95);
  const world = new THREE.Group();
  runner.scene.add(world);

  const restaurant = createRestaurant(0.82);
  restaurant.position.set(0.8, 0, 0);
  world.add(restaurant);

  const phone = createPhone(0.7);
  phone.position.set(-6.2, 2.8, 0.3);
  phone.rotation.y = 0.38;
  world.add(phone);

  const message = createTextSprite("I NEED TWO BURGERS", { fontSize: 28, scale: 0.66, background: "rgba(37,211,102,.15)", color: "#68ff9b" });
  message.position.set(-5.4, 5.1, 0.3);
  world.add(message);

  const infoGroup = new THREE.Group();
  ["PRODUCT: CHICKEN BURGER","QUANTITY: 2","MODIFIER: NONE","CONFIDENCE: HIGH"].forEach((text, i) => {
    const sprite = createTextSprite(text, { fontSize: 23, scale: 0.48, background: "rgba(13,16,21,.9)", color: i === 3 ? "#68ff9b" : "#f7f8fa" });
    sprite.position.set(Math.cos(i * Math.PI / 2) * 2.4, 2.4 + (i % 2) * 0.8, Math.sin(i * Math.PI / 2) * 1.8);
    infoGroup.add(sprite);
  });
  infoGroup.position.set(0.7, 0, 0);
  world.add(infoGroup);

  const checks = new THREE.Group();
  ["PRICE ✓","STOCK ✓","MODIFIERS ✓","PROMOTION ✓"].forEach((text, i) => {
    const sprite = createTextSprite(text, { fontSize: 22, scale: 0.46, background: "rgba(37,211,102,.13)", color: "#68ff9b" });
    sprite.position.set(2.4 + (i % 2) * 1.4, 2.2 + Math.floor(i / 2) * 0.72, -1.4);
    checks.add(sprite);
  });
  world.add(checks);

  const checkout = new THREE.Group();
  ["CUSTOMER","DELIVERY","ADDRESS","PAYMENT","COUPON","CONFIRM"].forEach((text, i) => {
    const sprite = createTextSprite(text, { fontSize: 21, scale: 0.43, background: "rgba(98,183,255,.12)", color: "#cde8ff" });
    const angle = i / 6 * Math.PI * 2;
    sprite.position.set(-5.1 + Math.cos(angle) * 1.6, 2.8 + Math.sin(angle) * 1.25, 0.4);
    checkout.add(sprite);
  });
  world.add(checkout);

  const driverRoute = createCurvePath([
    new THREE.Vector3(3.4, 0.7, 2.0),
    new THREE.Vector3(5.2, 0.7, 3.2),
    new THREE.Vector3(2.4, 0.7, 4.0),
    new THREE.Vector3(-0.4, 0.7, 3.8)
  ], C.blue);
  world.add(driverRoute.tube, driverRoute.orb);

  const ownerStats = new THREE.Group();
  ["LOYALTY +20","DAILY SALES +1,768","TOP PRODUCT: BURGER","DELIVERY: COMPLETE"].forEach((text, i) => {
    const sprite = createTextSprite(text, { fontSize: 22, scale: 0.48, background: "rgba(37,211,102,.12)", color: "#68ff9b" });
    sprite.position.set(-3.4 + (i % 2) * 2.2, 3.3 + Math.floor(i / 2) * 0.75, 2.1);
    ownerStats.add(sprite);
  });
  world.add(ownerStats);

  const goals = [
    [new THREE.Vector3(-1.9,4.7,7.8),new THREE.Vector3(-5.8,2.4,.2)],
    [new THREE.Vector3(7.2,5.7,8.5),new THREE.Vector3(.7,1.8,0)],
    [new THREE.Vector3(8.4,5.2,4.8),new THREE.Vector3(3.5,1.5,-1.8)],
    [new THREE.Vector3(-2.8,4.5,7.1),new THREE.Vector3(-5.4,2.5,.2)],
    [new THREE.Vector3(-5.2,4.8,5.6),new THREE.Vector3(-2.0,1.4,-1.7)],
    [new THREE.Vector3(8.5,4.7,8.4),new THREE.Vector3(3.7,1.2,2.1)],
    [new THREE.Vector3(-6.5,5.0,7.2),new THREE.Vector3(-2.0,2.0,2.0)]
  ];

  let stage = 0;
  let cameraGoal = goals[0][0].clone();
  let targetGoal = goals[0][1].clone();

  function setStage(next) {
    stage = Math.max(0, Math.min(6, next));
    cameraGoal = goals[stage][0].clone();
    targetGoal = goals[stage][1].clone();
    message.visible = stage === 0;
    infoGroup.visible = stage === 1;
    checks.visible = stage === 2;
    checkout.visible = stage === 3;
    restaurant.userData.kitchen.userData.ticket.visible = restaurant.userData.kitchen.userData.ticketLabel.visible = stage === 4;
    driverRoute.tube.visible = driverRoute.orb.visible = stage === 5;
    ownerStats.visible = stage === 6;
    beep(500 + stage * 52, .05, .019);
  }

  runner.update = (dt, t) => {
    phone.position.y = 2.8 + Math.sin(t * 1.1) * .1;
    infoGroup.rotation.y += dt * .2;
    checkout.rotation.z = Math.sin(t * .45) * .04;
    if (driverRoute.orb.visible) driverRoute.orb.position.copy(driverRoute.curve.getPointAt((t * .17) % 1));
    ownerStats.children.forEach((child, i) => child.position.y += Math.sin(t * 1.1 + i) * .0008);
    restaurant.userData.core.userData.core.rotation.y += dt * .6;
    restaurant.userData.core.userData.rings[0].rotation.z += dt * .35;
    runner.camera.position.lerp(cameraGoal, .045);
    runner.controls.target.lerp(targetGoal, .06);
  };
  setStage(0);
  return { setStage };
}

function buildPillars() {
  const runner = setupScene("pillarCanvas", new THREE.Vector3(10.8, 7.3, 12), new THREE.Vector3(0,1.1,0));
  if (!runner) return null;
  addLights(runner.scene, .92);
  const root = new THREE.Group();
  runner.scene.add(root);
  root.add(createFloor(12,8));

  const groups = {};

  const ordering = new THREE.Group();
  const orderCore = createAICore(.82);
  orderCore.position.set(.4,1.65,0);
  ordering.add(orderCore);
  const orderPhone = createPhone(.65);
  orderPhone.position.set(-3.8,2.6,.4);
  orderPhone.rotation.y=.35;
  ordering.add(orderPhone);
  const orderCart = createCart();
  orderCart.scale.setScalar(.75);
  orderCart.position.set(3.1,0,.5);
  ordering.add(orderCart);
  for(let i=0;i<5;i++){
    const s=createTextSprite(["MENU","MODIFIER","COUPON","PAYMENT","TRACKING"][i],{fontSize:22,scale:.43,background:"rgba(37,211,102,.12)",color:"#68ff9b"});
    const a=i/5*Math.PI*2;s.position.set(.4+Math.cos(a)*3.0,2.2+Math.sin(a)*1.2,Math.sin(a)*1.4);ordering.add(s);
  }
  groups.ordering=ordering;root.add(ordering);

  const operations=createRestaurant(.74);
  operations.position.set(0,0,0);
  groups.operations=operations;root.add(operations);

  const growth=new THREE.Group();
  const loyaltyCore=createAICore(.8);loyaltyCore.position.set(0,1.7,0);growth.add(loyaltyCore);
  for(let i=0;i<7;i++){
    const card=roundedBox(1.8,1.05,.08,i%2?C.surface2:0x243129,.11,{metalness:.38,roughness:.38});
    const a=i/7*Math.PI*2;card.position.set(Math.cos(a)*3.4,1.9+Math.sin(a*2)*.5,Math.sin(a)*2.4);card.rotation.y=-a+Math.PI/2;
    const label=createTextSprite(["VIP","LOYALTY +20","FAVORITES","ORDER HISTORY","LEVEL 3","SAVE10","REORDER"][i],{fontSize:20,scale:.34,background:"rgba(5,6,8,.72)",color:"#68ff9b"});label.position.z=.08;card.add(label);growth.add(card);
  }
  groups.growth=growth;root.add(growth);

  const delivery=new THREE.Group();
  const restaurantMarker=roundedBox(2.3,1.3,2.1,C.surface2,.18,{metalness:.45});restaurantMarker.position.set(-3,0.65,0);delivery.add(restaurantMarker);
  const customer=roundedBox(1.8,1.8,1.8,0x25303a,.22,{metalness:.35});customer.position.set(3.4,.9,0);delivery.add(customer);
  const scooter=createScooter(.72);scooter.position.set(-2.1,.1,0);scooter.rotation.y=Math.PI/2;delivery.add(scooter);
  const droute=createCurvePath([new THREE.Vector3(-2.2,.7,0),new THREE.Vector3(0,.7,1.9),new THREE.Vector3(3.0,.7,0)],C.blue);delivery.add(droute.tube,droute.orb);
  groups.delivery=delivery;delivery.userData={scooter,route:droute};root.add(delivery);

  const intelligence=new THREE.Group();
  const centerPanel=createDashboardPanel(4.3,2.7,C.green,"OWNER INTELLIGENCE");centerPanel.position.set(0,2,0);intelligence.add(centerPanel);
  const panels=[];
  [["DAILY SALES",C.green],["TOP PRODUCTS",C.amber],["CUSTOMERS",C.purple],["DELIVERY",C.blue]].forEach((item,i)=>{
    const panel=createDashboardPanel(2.2,1.4,item[1],item[0]);const a=i/4*Math.PI*2;panel.position.set(Math.cos(a)*3.5,1.8,Math.sin(a)*2.3);panel.rotation.y=-a+Math.PI/2;intelligence.add(panel);panels.push(panel);
  });
  intelligence.userData={centerPanel,panels};groups.intelligence=intelligence;root.add(intelligence);

  Object.values(groups).forEach(g=>g.visible=false);
  let current="ordering";groups[current].visible=true;
  runner.update=(dt,t)=>{
    orderCore.userData.core.rotation.y+=dt*.6;
    orderCore.userData.rings[0].rotation.z+=dt*.35;
    orderPhone.position.y=2.6+Math.sin(t*1.2)*.1;
    growth.rotation.y+=dt*.09;
    loyaltyCore.userData.rings[0].rotation.z+=dt*.4;
    if(delivery.visible){
      delivery.userData.route.orb.position.copy(delivery.userData.route.curve.getPointAt((t*.18)%1));
      delivery.userData.scooter.position.x=-2.1+((t*.35)%1)*4.9;
      delivery.userData.scooter.position.z=Math.sin(((t*.35)%1)*Math.PI)*1.8;
    }
    if(intelligence.visible){
      intelligence.userData.panels.forEach((p,i)=>p.position.y=1.8+Math.sin(t*.9+i)*.15);
      intelligence.userData.centerPanel.userData.bars.forEach((bar,i)=>bar.scale.y=.78+Math.sin(t*1.3+i*.4)*.15);
    }
    root.rotation.y=Math.sin(t*.15)*.08;
  };
  return{setPillar(key){if(!groups[key])return;groups[current].visible=false;current=key;groups[current].visible=true;beep(570,.05,.02);}};
}

function buildDevices() {
  const runner=setupScene("deviceCanvas",new THREE.Vector3(12.5,7.5,14.5),new THREE.Vector3(0,1.5,0));
  if(!runner)return null;
  addLights(runner.scene,.95);
  const world=new THREE.Group();runner.scene.add(world);world.add(createFloor(14,9));

  const devices={};
  const owner=createLaptop(.9,C.green,"OWNER ADMIN HUB");owner.position.set(-2.3,.2,.6);owner.rotation.y=.18;world.add(owner);devices.owner=owner;
  const kitchen=createTablet(.78,C.amber,"KITCHEN DISPLAY");kitchen.position.set(2.5,2.15,-1.0);kitchen.rotation.y=-.32;world.add(kitchen);devices.kitchen=kitchen;
  const driver=createPhone(.55);driver.position.set(-5.0,2.0,-1.5);driver.rotation.y=.55;world.add(driver);const dl=createTextSprite("DRIVER",{fontSize:22,scale:.42,background:"rgba(98,183,255,.13)",color:"#62b7ff"});dl.position.set(-5,4.4,-1.5);world.add(dl);devices.driver=driver;
  const customer=createPhone(.52);customer.position.set(5.0,2.15,1.1);customer.rotation.y=-.55;world.add(customer);const cl=createTextSprite("CUSTOMER WHATSAPP",{fontSize:22,scale:.42,background:"rgba(37,211,102,.13)",color:"#68ff9b"});cl.position.set(5,4.55,1.1);world.add(cl);devices.customer=customer;
  const reports=createDashboardPanel(4.0,2.5,C.green,"REPORTS DASHBOARD");reports.position.set(.4,3.8,-3.0);reports.rotation.x=-.08;world.add(reports);devices.reports=reports;

  const goals={
    owner:[new THREE.Vector3(7.8,5.4,9.4),new THREE.Vector3(-2.3,1.4,.6)],
    kitchen:[new THREE.Vector3(8.0,5.5,5.5),new THREE.Vector3(2.5,2,-1)],
    driver:[new THREE.Vector3(-.6,4.4,6.5),new THREE.Vector3(-5,2,-1.5)],
    customer:[new THREE.Vector3(9.2,4.5,7.2),new THREE.Vector3(5,2,1)],
    reports:[new THREE.Vector3(7.2,6.2,7.2),new THREE.Vector3(.4,3.3,-3)]
  };
  let cameraGoal=goals.owner[0].clone(),targetGoal=goals.owner[1].clone();
  runner.update=(dt,t)=>{
    owner.position.y=.2+Math.sin(t*.8)*.08;
    kitchen.position.y=2.15+Math.sin(t*.9+1)*.12;
    driver.position.y=2+Math.sin(t*1.05+2)*.11;
    customer.position.y=2.15+Math.sin(t*.95+3)*.1;
    reports.position.y=3.8+Math.sin(t*.7+4)*.13;
    runner.camera.position.lerp(cameraGoal,.05);runner.controls.target.lerp(targetGoal,.065);
  };
  return{focus(key){const pair=goals[key]||goals.owner;cameraGoal=pair[0].clone();targetGoal=pair[1].clone();beep(600,.045,.018);}};
}

function buildAdmin() {
  const runner=setupScene("adminCanvas",new THREE.Vector3(11.5,8.4,13.5),new THREE.Vector3(0,1.4,0));
  if(!runner)return null;
  addLights(runner.scene,.9);
  const world=new THREE.Group();runner.scene.add(world);world.add(createFloor(12,8));
  const corePanel=createDashboardPanel(4.3,2.7,C.green,"ADMIN HUB");corePanel.position.set(0,2,0);world.add(corePanel);
  const names=["orders","kitchen","receipts","promotions","customers","deliveries","reports","staff","inventory","menu","system"];
  const nodes={};
  const lineMat=new THREE.LineBasicMaterial({color:C.green,transparent:true,opacity:.24});
  names.forEach((name,i)=>{
    const angle=i/names.length*Math.PI*2;
    const radius=i%2?4.3:3.7;
    const node=roundedBox(1.55,.72,.16,C.surface2,.13,{metalness:.5,roughness:.35});
    node.position.set(Math.cos(angle)*radius,1.75+Math.sin(angle*2)*.65,Math.sin(angle)*2.8);
    node.rotation.y=-angle+Math.PI/2;
    const label=createTextSprite(name.toUpperCase(),{fontSize:20,scale:.36,background:"rgba(5,6,8,.72)",color:"#f7f8fa"});label.position.z=.1;node.add(label);
    world.add(node);nodes[name]=node;
    const geometry=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,2,0),node.position.clone()]);
    world.add(new THREE.Line(geometry,lineMat));
  });
  let active="orders";
  function highlight(key){
    active=key;
    Object.entries(nodes).forEach(([name,node])=>{
      node.material.emissive.set(name===key?C.green:0x000000);
      node.material.emissiveIntensity=name===key?.8:0;
      node.scale.setScalar(name===key?1.18:1);
    });
    beep(620,.045,.018);
  }
  runner.update=(dt,t)=>{
    world.rotation.y+=dt*.025;
    corePanel.position.y=2+Math.sin(t*.8)*.11;
    corePanel.userData.bars.forEach((bar,i)=>bar.scale.y=.78+Math.sin(t*1.2+i*.5)*.16);
    Object.values(nodes).forEach((node,i)=>node.position.y+=Math.sin(t+i)*.0008);
  };
  highlight("orders");
  return{focus:highlight};
}

function buildFinal() {
  const runner=setupScene("finalCanvas",new THREE.Vector3(13,8.5,14),new THREE.Vector3(0,1.2,0));
  if(!runner)return null;
  runner.controls.enabled=false;
  addLights(runner.scene,.85);
  const restaurant=createRestaurant(.82);runner.scene.add(restaurant);
  const phone=createPhone(.62);phone.position.set(-6,2.9,.4);phone.rotation.y=.35;runner.scene.add(phone);
  const path=createCurvePath([new THREE.Vector3(-5.3,2.7,.4),new THREE.Vector3(-1.5,2,0),new THREE.Vector3(0,1.4,0),new THREE.Vector3(3,1.4,1.7),new THREE.Vector3(-2.4,2.2,1.8)]);runner.scene.add(path.tube,path.orb);
  runner.update=(dt,t)=>{
    const cycle=(t*.035)%1;
    const distance=13+cycle*7;
    runner.camera.position.set(Math.cos(t*.08)*distance,8.5+cycle*3,Math.sin(t*.08)*distance+9);
    runner.camera.lookAt(0,1.2,0);
    path.orb.position.copy(path.curve.getPointAt((t*.1)%1));
    phone.position.y=2.9+Math.sin(t)*.1;
  };
  return{};
}

const hero = buildHero();
const orderDemo = buildOrderDemo();
const journey = buildJourney();
const pillars = buildPillars();
const devices = buildDevices();
const admin = buildAdmin();
buildFinal();

window.OrderRise3D = {
  focusHero: key => hero?.focus(key),
  setOrderStage: stage => orderDemo?.setStage(stage),
  setJourneyStage: stage => journey?.setStage(stage),
  setPillar: key => pillars?.setPillar(key),
  focusDevice: key => devices?.focus(key),
  focusAdmin: key => admin?.focus(key),
  setSound: enabled => {
    soundEnabled = Boolean(enabled);
    if (soundEnabled) beep(660,.07,.022);
  }
};

if (window.__orderRisePending3D) {
  for (const [method,args] of Object.entries(window.__orderRisePending3D)) {
    if (typeof window.OrderRise3D[method] === "function") window.OrderRise3D[method](...(args || []));
  }
  delete window.__orderRisePending3D;
}

animate();
