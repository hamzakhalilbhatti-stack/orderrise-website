
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
  blue: 0x43c6ff,
  purple: 0xa47cff,
  orange: 0xff9f43,
  pink: 0xff63b8,
  cyan: 0x4de2c5,
  yellow: 0xffca5c
};

const PROCESS_COLORS = [C.green, C.purple, C.orange, C.amber, C.blue, C.pink, C.cyan];
const PROCESS_NAMES = ["WHATSAPP", "AI UNDERSTANDS", "CART & CHECKOUT", "KITCHEN", "INVENTORY", "DELIVERY", "OWNER"];

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
  renderer.toneMappingExposure = 1.28;
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
  const ambient = new THREE.AmbientLight(0xffffff, 0.72 * intensity);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xcbeeff, 0x101328, 2.35 * intensity);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 3.4 * intensity);
  key.position.set(7, 12, 9);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -15;
  key.shadow.camera.right = 15;
  key.shadow.camera.top = 15;
  key.shadow.camera.bottom = -15;
  scene.add(key);

  const fills = [
    [C.green, -5, 4.5, 3, 15],
    [C.purple, 0, 5.2, -2, 13],
    [C.amber, -4, 3.2, -3, 11],
    [C.blue, 4, 3.5, -3, 11],
    [C.pink, 4, 3.0, 3, 10],
    [C.cyan, -4, 3.2, 3, 10]
  ];
  fills.forEach(([color, x, y, z, power]) => {
    const light = new THREE.PointLight(color, power * intensity, 12, 2);
    light.position.set(x, y, z);
    scene.add(light);
  });
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
    depthTest: false,
    toneMapped: false
  }));
  sprite.renderOrder = 100;
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
  const floor = roundedBox(sizeX, 0.35, sizeZ, 0x101a2b, 0.22, { roughness: 0.52, metalness: 0.12 });
  floor.position.y = -0.18;
  group.add(floor);

  const grid = new THREE.GridHelper(Math.max(sizeX, sizeZ), 18, C.blue, 0x334357);
  grid.scale.x = sizeX / Math.max(sizeX, sizeZ);
  grid.scale.z = sizeZ / Math.max(sizeX, sizeZ);
  grid.position.y = 0.01;
  grid.material.transparent = true;
  grid.material.opacity = 0.24;
  group.add(grid);
  return group;
}

function hexCss(color) {
  return `#${Number(color).toString(16).padStart(6, "0")}`;
}

function createZonePad(width, depth, color, number, label) {
  const group = new THREE.Group();
  const pad = roundedBox(width, 0.10, depth, color, 0.16, { basic: true, opacity: 0.20 });
  pad.position.y = 0.03;
  group.add(pad);
  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new RoundedBoxGeometry(width, 0.10, depth, 3, 0.14)),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.88 })
  );
  edge.position.y = 0.03;
  group.add(edge);
  const marker = createTextSprite(`${number}  ${label}`, {
    fontSize: 30,
    scale: 0.58,
    background: "rgba(4,8,17,.93)",
    color: hexCss(color),
    border: `${hexCss(color)}aa`
  });
  marker.position.set(0, 0.32, depth * 0.43);
  group.add(marker);
  group.userData.pad = pad;
  return group;
}

function createStageMarker(number, label, color) {
  const group = new THREE.Group();
  const disc = cylinder(0.28, 0.28, 0.10, color, { basic: true });
  disc.rotation.x = Math.PI / 2;
  group.add(disc);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.035, 8, 32), basicMaterial(color, 0.8));
  group.add(ring);
  const numberSprite = createTextSprite(String(number), { fontSize: 34, scale: 0.32, background: "rgba(4,8,17,.96)", color: "#ffffff", border: hexCss(color) });
  numberSprite.position.set(0, 0, 0.12);
  group.add(numberSprite);
  const labelSprite = createTextSprite(label, { fontSize: 24, scale: 0.42, background: "rgba(4,8,17,.93)", color: hexCss(color), border: `${hexCss(color)}88` });
  labelSprite.position.set(0, 0.65, 0);
  group.add(labelSprite);
  group.userData = { disc, ring, labelSprite, color };
  return group;
}

function setGroupHighlight(group, color, active) {
  if (!group) return;
  group.traverse(object => {
    if (!object.isMesh) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach(mat => {
      if (!mat || !mat.isMeshStandardMaterial) return;
      if (!mat.userData.baseEmissive) {
        mat.userData.baseEmissive = mat.emissive.clone();
        mat.userData.baseEmissiveIntensity = mat.emissiveIntensity;
      }
      if (active) {
        mat.emissive.set(color);
        mat.emissiveIntensity = Math.max(mat.userData.baseEmissiveIntensity || 0, 0.48);
      } else {
        mat.emissive.copy(mat.userData.baseEmissive);
        mat.emissiveIntensity = mat.userData.baseEmissiveIntensity || 0;
      }
    });
  });
}

function activateMarkers(markers, activeIndex) {
  markers.forEach((marker, index) => {
    const active = index === activeIndex;
    marker.scale.setScalar(active ? 1.28 : 0.92);
    marker.userData.ring.material.opacity = active ? 1 : 0.28;
    marker.userData.disc.material.opacity = active ? 1 : 0.55;
    marker.userData.labelSprite.material.opacity = active ? 1 : 0.62;
  });
}

function createScreen(w = 2.2, h = 1.3, color = C.green, label = "") {
  const group = new THREE.Group();
  const body = roundedBox(w, h, 0.16, 0x263247, 0.09, { metalness: 0.45, roughness: 0.24 });
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
  const screen = roundedBox(1.88, 3.95, 0.08, 0x12342a, 0.19, { basic: true });
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
  const basket = roundedBox(2.2, 1.05, 1.45, C.orange, 0.16, { metalness: 0.32, roughness: 0.38, emissive: C.orange, emissiveIntensity: 0.12 });
  basket.position.y = 0.8;
  group.add(basket);
  const rim = new THREE.LineSegments(
    new THREE.EdgesGeometry(new RoundedBoxGeometry(2.05, 0.9, 1.3, 3, 0.12)),
    new THREE.LineBasicMaterial({ color: C.yellow, transparent: true, opacity: 0.85 })
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
  const body = roundedBox(0.75, 0.45, 1.25, C.pink, 0.18, { metalness: 0.35, emissive: C.pink, emissiveIntensity: 0.12 });
  body.position.set(0, 0.72, 0);
  group.add(body);
  const stem = cylinder(0.055, 0.055, 1.0, C.surface2, { metalness: 0.65 });
  stem.position.set(0, 1.25, -0.42);
  stem.rotation.x = -0.18;
  group.add(stem);
  const handle = roundedBox(0.8, 0.08, 0.08, C.surface2, 0.04, { metalness: 0.65 });
  handle.position.set(0, 1.7, -0.58);
  group.add(handle);
  const bag = roundedBox(0.9, 0.9, 0.72, C.blue, 0.12, { roughness: 0.58, emissive: C.blue, emissiveIntensity: 0.10 });
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
  const labelSprite = createTextSprite(label, { fontSize: 26, scale: 0.58, background: "rgba(4,39,36,.94)", color: "#86ffe8", border: "rgba(77,226,197,.55)" });
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
  const counter = roundedBox(3.1, 0.75, 1.45, 0x6b4b20, 0.14, { metalness: 0.35, roughness: 0.38, emissive: C.amber, emissiveIntensity: 0.08 });
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
  const label = createTextSprite("4  KITCHEN", { fontSize: 32, scale: 0.68, background: "rgba(35,22,5,.94)", color: "#ffca5c", border: "rgba(255,202,92,.7)" });
  label.position.set(0, 2.55, 0);
  group.add(label);
  group.userData.ticket = ticket;
  group.userData.ticketLabel = ticketLabel;
  group.userData.screen = screen;
  return group;
}

function createInventory() {
  const group = new THREE.Group();
  const back = roundedBox(3, 2.6, 0.28, 0x193e5d, 0.1, { metalness: 0.38, emissive: C.blue, emissiveIntensity: 0.08 });
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
      const inventoryColors = [C.blue, C.cyan, C.yellow];
      const box = roundedBox(0.52, 0.42, 0.66, inventoryColors[row], 0.07, { roughness: 0.58, emissive: inventoryColors[row], emissiveIntensity: 0.06 });
      box.position.set(-1.05 + col * 0.7, 0.76 + row * 0.8, 0);
      group.add(box);
      boxes.push(box);
    }
  }
  const label = createTextSprite("5  INVENTORY", { fontSize: 32, scale: 0.68, background: "rgba(5,28,44,.94)", color: "#43c6ff", border: "rgba(67,198,255,.7)" });
  label.position.set(0, 3.15, 0);
  group.add(label);
  group.userData.boxes = boxes;
  return group;
}

function createDeliveryStation() {
  const group = new THREE.Group();
  const pad = roundedBox(3.2, 0.24, 2.4, 0x54223f, 0.18, { roughness: 0.48, emissive: C.pink, emissiveIntensity: 0.08 });
  pad.position.y = 0.12;
  group.add(pad);
  const scooter = createScooter(0.72);
  scooter.position.set(0, 0.1, 0);
  scooter.rotation.y = Math.PI / 2;
  group.add(scooter);
  const station = createScreen(1.8, 1.1, C.pink, "DRIVER READY");
  station.position.set(-0.85, 1.55, -0.72);
  station.rotation.y = 0.22;
  group.add(station);
  const label = createTextSprite("6  DELIVERY", { fontSize: 32, scale: 0.68, background: "rgba(48,8,35,.94)", color: "#ff63b8", border: "rgba(255,99,184,.7)" });
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
  const laptop = createLaptop(0.65, C.cyan, "OWNER");
  laptop.position.set(0, 0.65, -0.1);
  group.add(laptop);
  const panel = createDashboardPanel(2.0, 1.35, C.cyan, "SALES + ORDER");
  panel.position.set(0, 2.55, -0.5);
  panel.rotation.x = -0.07;
  group.add(panel);
  const label = createTextSprite("7  OWNER INTELLIGENCE", { fontSize: 32, scale: 0.68, background: "rgba(4,39,36,.94)", color: "#4de2c5", border: "rgba(77,226,197,.7)" });
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
      color: C.purple,
      emissive: C.purple,
      emissiveIntensity: 1.4,
      metalness: 0.35,
      roughness: 0.2,
      transparent: true,
      opacity: 0.92
    })
  );
  group.add(core);
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.035, 8, 80), basicMaterial(C.purple, 0.9));
  ring1.rotation.x = Math.PI / 2;
  group.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.026, 8, 80), basicMaterial(C.cyan, 0.55));
  ring2.rotation.y = Math.PI / 2.7;
  group.add(ring2);
  const label = createTextSprite("2  AI UNDERSTANDS ORDER", { fontSize: 32, scale: 0.68, background: "rgba(28,12,55,.94)", color: "#c9afff", border: "rgba(164,124,255,.75)" });
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

  const backWall = roundedBox(13, 3.6, 0.16, 0x192338, 0.06, { transparent: true, opacity: 0.68, roughness: 0.58 });
  backWall.position.set(0, 1.8, -4.35);
  root.add(backWall);

  const leftWall = roundedBox(0.16, 3.6, 5.3, 0x192338, 0.06, { transparent: true, opacity: 0.40, roughness: 0.58 });
  leftWall.position.set(-6.4, 1.8, -1.75);
  root.add(leftWall);

  const kitchenPad = createZonePad(4.7, 3.6, C.amber, 4, "KITCHEN");
  kitchenPad.position.set(-3.2, 0, -2.0);
  root.add(kitchenPad);

  const inventoryPad = createZonePad(4.7, 3.6, C.blue, 5, "INVENTORY");
  inventoryPad.position.set(3.15, 0, -2.05);
  root.add(inventoryPad);

  const deliveryPad = createZonePad(4.7, 3.6, C.pink, 6, "DELIVERY");
  deliveryPad.position.set(3.2, 0, 2.1);
  root.add(deliveryPad);

  const ownerPad = createZonePad(4.7, 3.6, C.cyan, 7, "OWNER");
  ownerPad.position.set(-3.0, 0, 2.0);
  root.add(ownerPad);

  const kitchen = createKitchen();
  kitchen.position.set(-3.2, 0.08, -2.0);
  kitchen.rotation.y = 0.03;
  root.add(kitchen);

  const inventory = createInventory();
  inventory.position.set(3.15, 0.08, -2.05);
  root.add(inventory);

  const delivery = createDeliveryStation();
  delivery.position.set(3.2, 0.08, 2.1);
  root.add(delivery);

  const owner = createOwnerZone();
  owner.position.set(-3.0, 0.08, 2.0);
  root.add(owner);

  const corePad = createZonePad(2.5, 2.5, C.purple, 2, "AI CORE");
  corePad.position.set(0, 0.02, 0.05);
  root.add(corePad);

  const core = createAICore(0.72);
  core.position.set(0, 1.55, 0.05);
  root.add(core);

  root.scale.setScalar(scale);
  root.userData = { kitchen, inventory, delivery, owner, core, kitchenPad, inventoryPad, deliveryPad, ownerPad, corePad };
  return root;
}

function createCurvePath(points, color = C.green) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.32);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 100, 0.055, 10, false),
    basicMaterial(color, 0.78)
  );
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 18, 18),
    new THREE.MeshBasicMaterial({ color, toneMapped: false })
  );
  const light = new THREE.PointLight(color, 9, 3.2, 2);
  orb.add(light);
  return { curve, tube, orb };
}

function setupScene(canvasId, cameraPosition, target = new THREE.Vector3()) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  try {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06101e);
    scene.fog = new THREE.FogExp2(0x06101e, 0.016);
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
  const runner = setupScene("hero3dCanvas", new THREE.Vector3(14.5, 9.7, 15.5), new THREE.Vector3(0, 1.15, 0));
  if (!runner) return null;
  addLights(runner.scene, 1.12);

  const world = new THREE.Group();
  runner.scene.add(world);

  const restaurant = createRestaurant(0.88);
  restaurant.position.set(1.2, 0, 0);
  world.add(restaurant);

  const phone = createPhone(0.86);
  phone.position.set(-6.8, 3.15, 0.5);
  phone.rotation.set(-0.06, 0.38, -0.1);
  world.add(phone);

  const phoneLabel = createTextSprite("1  WHATSAPP ORDER", {
    fontSize: 32,
    scale: 0.72,
    background: "rgba(4,35,20,.96)",
    color: "#68ff9b",
    border: "rgba(37,211,102,.8)"
  });
  phoneLabel.position.set(-6.7, 5.7, 0.5);
  world.add(phoneLabel);

  const cart = createCart();
  cart.scale.setScalar(0.47);
  cart.position.set(0.5, 0.05, 1.38);
  world.add(cart);
  const cartLabel = createTextSprite("3  CART & CHECKOUT", {
    fontSize: 29,
    scale: 0.58,
    background: "rgba(52,25,5,.96)",
    color: "#ffb56d",
    border: "rgba(255,159,67,.8)"
  });
  cartLabel.position.set(0.5, 1.75, 1.38);
  world.add(cartLabel);

  const points = [
    new THREE.Vector3(-5.9, 2.9, 0.45),
    new THREE.Vector3(1.2, 1.55, 0.05),
    new THREE.Vector3(0.5, 0.72, 1.38),
    new THREE.Vector3(-1.62, 1.45, -1.76),
    new THREE.Vector3(3.97, 1.45, -1.80),
    new THREE.Vector3(4.02, 1.32, 1.85),
    new THREE.Vector3(-1.44, 1.90, 1.76)
  ];

  const pathGroup = new THREE.Group();
  for (let i = 0; i < points.length - 1; i++) {
    const midpoint = points[i].clone().lerp(points[i + 1], 0.5);
    midpoint.y += 0.55;
    const segmentCurve = new THREE.CatmullRomCurve3([points[i], midpoint, points[i + 1]], false, "catmullrom", 0.3);
    const segment = new THREE.Mesh(
      new THREE.TubeGeometry(segmentCurve, 28, 0.065, 10, false),
      basicMaterial(PROCESS_COLORS[i + 1], 0.82)
    );
    pathGroup.add(segment);
  }
  world.add(pathGroup);

  const fullCurve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.3);
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 20, 20),
    new THREE.MeshBasicMaterial({ color: C.green, toneMapped: false })
  );
  const orbLight = new THREE.PointLight(C.green, 13, 4, 2);
  orb.add(orbLight);
  world.add(orb);

  const markers = points.map((point, index) => {
    const marker = createStageMarker(index + 1, PROCESS_NAMES[index], PROCESS_COLORS[index]);
    marker.position.copy(point);
    marker.position.y += index === 0 ? -0.15 : 0.05;
    marker.scale.setScalar(0.92);
    world.add(marker);
    return marker;
  });

  const stageGroups = [
    phone,
    restaurant.userData.core,
    cart,
    restaurant.userData.kitchen,
    restaurant.userData.inventory,
    restaurant.userData.delivery,
    restaurant.userData.owner
  ];

  const cameraGoals = {
    overview: [new THREE.Vector3(14.5, 9.7, 15.5), new THREE.Vector3(0, 1.15, 0)],
    phone: [new THREE.Vector3(-2.8, 4.7, 7.6), new THREE.Vector3(-6.5, 2.6, 0.4)],
    ai: [new THREE.Vector3(6.4, 4.5, 7.2), new THREE.Vector3(1.2, 1.55, 0.05)],
    cart: [new THREE.Vector3(5.2, 3.7, 6.5), new THREE.Vector3(0.5, 0.8, 1.38)],
    kitchen: [new THREE.Vector3(-4.8, 5.0, 6.3), new THREE.Vector3(-1.7, 1.2, -1.7)],
    inventory: [new THREE.Vector3(8.6, 4.8, 5.8), new THREE.Vector3(4.0, 1.3, -1.8)],
    delivery: [new THREE.Vector3(8.5, 4.5, 8.2), new THREE.Vector3(4.1, 1.2, 1.9)],
    owner: [new THREE.Vector3(-6.8, 5.1, 7.0), new THREE.Vector3(-1.4, 1.7, 1.8)]
  };

  let cameraGoal = cameraGoals.overview[0].clone();
  let targetGoal = cameraGoals.overview[1].clone();
  let phase = -1;
  let mouseX = 0;
  let mouseY = 0;

  runner.canvas.addEventListener("pointermove", event => {
    const rect = runner.canvas.getBoundingClientRect();
    mouseX = (event.clientX - rect.left) / rect.width - 0.5;
    mouseY = (event.clientY - rect.top) / rect.height - 0.5;
  });

  function activatePhase(nextPhase) {
    phase = nextPhase;
    activateMarkers(markers, phase);
    stageGroups.forEach((group, index) => setGroupHighlight(group, PROCESS_COLORS[index], index === phase));
    orb.material.color.set(PROCESS_COLORS[phase]);
    orbLight.color.set(PROCESS_COLORS[phase]);

    const statuses = [
      "WhatsApp message received",
      "AI extracted product and quantity",
      "Cart and checkout prepared",
      "Kitchen ticket #1042 created",
      "Inventory reserved automatically",
      "Driver assigned for delivery",
      "Owner revenue and reports updated"
    ];
    const statusNode = document.getElementById("heroStatusText");
    if (statusNode) statusNode.textContent = statuses[phase];
    document.querySelectorAll("[data-hero-stage]").forEach((node, index) => node.classList.toggle("active", index === phase));
    beep(430 + phase * 48, 0.05, 0.018);
  }

  runner.update = (dt, t) => {
    phone.position.y = 3.15 + Math.sin(t * 1.25) * 0.12;
    phone.rotation.z = -0.1 + Math.sin(t * 0.7) * 0.025;
    restaurant.userData.core.userData.core.rotation.y += dt * 0.6;
    restaurant.userData.core.userData.rings[0].rotation.z += dt * 0.4;
    restaurant.userData.core.userData.rings[1].rotation.x += dt * 0.32;
    restaurant.userData.delivery.userData.scooter.position.z = Math.sin(t * 0.6) * 0.2;
    restaurant.userData.owner.userData.panel.userData.bars.forEach((bar, i) => {
      bar.scale.y = 0.72 + Math.sin(t * 1.2 + i * 0.5) * 0.16;
    });

    const progress = (t * 0.075) % 1;
    orb.position.copy(fullCurve.getPointAt(progress));
    orb.scale.setScalar(0.9 + Math.sin(t * 5) * 0.18);
    world.rotation.y += (mouseX * 0.055 - world.rotation.y) * 0.018;
    world.rotation.x += (-mouseY * 0.02 - world.rotation.x) * 0.018;
    runner.camera.position.lerp(cameraGoal, 0.055);
    runner.controls.target.lerp(targetGoal, 0.07);

    const nextPhase = Math.min(6, Math.floor(progress * 7));
    if (nextPhase !== phase) activatePhase(nextPhase);
  };

  activatePhase(0);

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
  const runner = setupScene("orderDemoCanvas", new THREE.Vector3(11.3, 7.8, 13.0), new THREE.Vector3(0, 1.15, 0));
  if (!runner) return null;
  addLights(runner.scene, 1.0);

  const world = new THREE.Group();
  runner.scene.add(world);
  world.add(createFloor(12.5, 8.5));

  const phonePad = createZonePad(2.8, 3.4, C.green, 1, "PHONE");
  phonePad.position.set(-4.7, 0, 0.2);
  world.add(phonePad);
  const phone = createPhone(0.62);
  phone.position.set(-4.7, 2.45, 0.2);
  phone.rotation.y = 0.35;
  world.add(phone);

  const cartPad = createZonePad(3.2, 2.8, C.orange, 2, "CART");
  cartPad.position.set(-1.1, 0, 0.8);
  world.add(cartPad);
  const cart = createCart();
  cart.scale.setScalar(0.86);
  cart.position.set(-1.1, 0.05, 0.8);
  world.add(cart);

  const burger1 = createBurger(0.82);
  const burger2 = createBurger(0.82);
  burger1.position.set(-1.52, 1.28, 0.78);
  burger2.position.set(-0.65, 1.28, 0.78);
  burger1.visible = burger2.visible = false;
  world.add(burger1, burger2);

  const spicy = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), basicMaterial(C.red));
  spicy.position.set(-1.52, 2.12, 0.78);
  spicy.visible = false;
  world.add(spicy);

  const inventoryPad = createZonePad(3.8, 3.2, C.blue, 3, "INVENTORY");
  inventoryPad.position.set(3.85, 0, -1.75);
  world.add(inventoryPad);
  const inventory = createInventory();
  inventory.scale.setScalar(0.72);
  inventory.position.set(3.85, 0.08, -1.75);
  world.add(inventory);

  const kitchenPad = createZonePad(3.8, 3.2, C.amber, 4, "KITCHEN");
  kitchenPad.position.set(3.65, 0, 1.8);
  world.add(kitchenPad);
  const kitchen = createKitchen();
  kitchen.scale.setScalar(0.72);
  kitchen.position.set(3.65, 0.08, 1.8);
  world.add(kitchen);
  kitchen.userData.ticket.visible = false;
  kitchen.userData.ticketLabel.visible = false;

  const scooter = createScooter(0.66);
  scooter.position.set(3.8, 0.12, 3.0);
  scooter.rotation.y = Math.PI / 2;
  scooter.visible = false;
  world.add(scooter);

  const dashboard = createDashboardPanel(2.7, 1.7, C.cyan, "OWNER REVENUE");
  dashboard.position.set(0.45, 4.35, -2.5);
  dashboard.rotation.x = -0.08;
  world.add(dashboard);

  const coupon = createTextSprite("SAVE10 APPLIED", {
    fontSize: 30,
    scale: 0.72,
    background: "rgba(38,16,66,.95)",
    color: "#d7c4ff",
    border: "rgba(164,124,255,.8)"
  });
  coupon.position.set(-0.95, 3.28, 0.65);
  coupon.visible = false;
  world.add(coupon);

  const stageBanner = createTextSprite("1  MENU REQUEST", {
    fontSize: 34,
    scale: 0.78,
    background: "rgba(4,8,17,.96)",
    color: "#68ff9b",
    border: "rgba(37,211,102,.8)"
  });
  stageBanner.position.set(0.2, 5.35, 0);
  world.add(stageBanner);

  const pathPhoneCart = createCurvePath([
    new THREE.Vector3(-4.0, 2.0, 0.2),
    new THREE.Vector3(-2.7, 1.6, 0.8),
    new THREE.Vector3(-1.5, 1.2, 0.8)
  ], C.orange);
  const pathCartInventory = createCurvePath([
    new THREE.Vector3(-0.3, 1.0, 0.5),
    new THREE.Vector3(1.8, 1.3, -0.8),
    new THREE.Vector3(3.1, 1.3, -1.5)
  ], C.blue);
  const pathCartKitchen = createCurvePath([
    new THREE.Vector3(-0.2, 1.0, 0.9),
    new THREE.Vector3(1.8, 1.4, 1.5),
    new THREE.Vector3(3.0, 1.4, 1.8)
  ], C.amber);
  const pathDelivery = createCurvePath([
    new THREE.Vector3(3.7, 0.65, 2.9),
    new THREE.Vector3(1.8, 0.6, 3.25),
    new THREE.Vector3(-0.2, 0.6, 3.45),
    new THREE.Vector3(-2.5, 0.6, 3.0)
  ], C.pink);

  [pathPhoneCart, pathCartInventory, pathCartKitchen, pathDelivery].forEach(path => world.add(path.tube, path.orb));
  pathPhoneCart.orb.visible = pathCartInventory.orb.visible = pathCartKitchen.orb.visible = pathDelivery.orb.visible = false;
  pathPhoneCart.tube.visible = pathCartInventory.tube.visible = pathCartKitchen.tube.visible = pathDelivery.tube.visible = false;

  const stageTargets = [phone, cart, spicy, burger1, coupon, scooter, kitchen, scooter];
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

    pathPhoneCart.tube.visible = stage >= 1;
    pathPhoneCart.orb.visible = stage === 1;
    pathCartInventory.tube.visible = stage >= 3;
    pathCartInventory.orb.visible = stage === 3;
    pathCartKitchen.tube.visible = stage >= 6;
    pathCartKitchen.orb.visible = stage === 6;
    pathDelivery.tube.visible = stage >= 7;
    pathDelivery.orb.visible = stage >= 7;

    inventory.userData.boxes.forEach((box, i) => {
      box.visible = i < (stage >= 3 ? 9 : stage >= 1 ? 10 : 12);
    });
    dashboard.userData.bars.forEach((bar, i) => {
      bar.scale.y = stage === 0 ? 0.45 : 0.75 + i * 0.1 + stage * 0.035;
    });
    if (stage >= 1) {
      burger1.position.set(-4.0, 2.25, 0.25);
      burger2.position.set(-4.0, 1.5, 0.25);
    }

    const bannerTexts = ["1  MENU REQUEST", "2  BURGERS ADDED", "3  SPICY MODIFIER", "4  EXTRA CHEESE", "5  SAVE10 COUPON", "6  DELIVERY SELECTED", "7  KITCHEN PREPARING", "8  OUT FOR DELIVERY"];
    const bannerColors = [C.green, C.orange, C.red, C.yellow, C.purple, C.pink, C.amber, C.blue];
    const oldTexture = stageBanner.material.map;
    const replacement = createTextSprite(bannerTexts[stage], {
      fontSize: 34,
      scale: 0.78,
      background: "rgba(4,8,17,.96)",
      color: hexCss(bannerColors[stage]),
      border: `${hexCss(bannerColors[stage])}cc`
    });
    stageBanner.material.map = replacement.material.map;
    stageBanner.scale.copy(replacement.scale);
    stageBanner.material.needsUpdate = true;
    if (oldTexture) oldTexture.dispose();

    const allGroups = [phone, cart, inventory, kitchen, scooter, dashboard, burger1, burger2];
    allGroups.forEach(group => setGroupHighlight(group, C.white, false));
    const accent = bannerColors[stage];
    if (stage === 0) setGroupHighlight(phone, accent, true);
    if (stage === 1) { setGroupHighlight(cart, accent, true); setGroupHighlight(burger1, accent, true); setGroupHighlight(burger2, accent, true); }
    if (stage === 2) { setGroupHighlight(burger1, accent, true); setGroupHighlight(kitchen, accent, true); }
    if (stage === 3) { setGroupHighlight(burger1, accent, true); setGroupHighlight(burger2, accent, true); setGroupHighlight(inventory, C.blue, true); }
    if (stage === 4) setGroupHighlight(dashboard, accent, true);
    if (stage === 5) setGroupHighlight(scooter, accent, true);
    if (stage === 6) setGroupHighlight(kitchen, accent, true);
    if (stage === 7) { setGroupHighlight(scooter, C.blue, true); setGroupHighlight(dashboard, C.cyan, true); }
    beep(480 + stage * 55, 0.055, 0.022);
  }

  runner.update = (dt, t) => {
    phone.position.y = 2.45 + Math.sin(t * 1.2) * 0.09;
    dashboard.position.y = 4.35 + Math.sin(t * 0.8) * 0.08;
    stageBanner.position.y = 5.35 + Math.sin(t * 0.9) * 0.08;
    const elapsed = Math.min(1, (t - transitionStart) / 1.1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    if (stage >= 1 && elapsed < 1) {
      burger1.position.lerpVectors(new THREE.Vector3(-4.0,2.25,.25), new THREE.Vector3(-1.52,1.28,.78), eased);
      burger2.position.lerpVectors(new THREE.Vector3(-4.0,1.5,.25), new THREE.Vector3(-.65,1.28,.78), eased);
    }
    if (spicy.visible) spicy.position.y = 2.12 + Math.sin(t * 3) * 0.08;
    if (coupon.visible) coupon.position.y = 3.28 + Math.sin(t * 1.4) * 0.08;
    if (scooter.visible && stage >= 7) scooter.position.x = 3.8 - ((t * 0.45) % 1) * 6.2;
    if (pathPhoneCart.orb.visible) pathPhoneCart.orb.position.copy(pathPhoneCart.curve.getPointAt((t * 0.34) % 1));
    if (pathCartInventory.orb.visible) pathCartInventory.orb.position.copy(pathCartInventory.curve.getPointAt((t * 0.30) % 1));
    if (pathCartKitchen.orb.visible) pathCartKitchen.orb.position.copy(pathCartKitchen.curve.getPointAt((t * 0.30) % 1));
    if (pathDelivery.orb.visible) pathDelivery.orb.position.copy(pathDelivery.curve.getPointAt((t * 0.18) % 1));
    kitchen.userData.screen.userData.display.material.opacity = 0.62 + Math.sin(t * 2.2) * 0.12;
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
    const sprite = createTextSprite(text, { fontSize: 23, scale: 0.48, background: "rgba(30,15,58,.94)", color: i === 3 ? "#d7c4ff" : "#f7f8fa", border: "rgba(164,124,255,.55)" });
    sprite.position.set(Math.cos(i * Math.PI / 2) * 2.4, 2.4 + (i % 2) * 0.8, Math.sin(i * Math.PI / 2) * 1.8);
    infoGroup.add(sprite);
  });
  infoGroup.position.set(0.7, 0, 0);
  world.add(infoGroup);

  const checks = new THREE.Group();
  ["PRICE ✓","STOCK ✓","MODIFIERS ✓","PROMOTION ✓"].forEach((text, i) => {
    const sprite = createTextSprite(text, { fontSize: 22, scale: 0.46, background: "rgba(5,28,44,.94)", color: "#77d9ff", border: "rgba(67,198,255,.55)" });
    sprite.position.set(2.4 + (i % 2) * 1.4, 2.2 + Math.floor(i / 2) * 0.72, -1.4);
    checks.add(sprite);
  });
  world.add(checks);

  const checkout = new THREE.Group();
  ["CUSTOMER","DELIVERY","ADDRESS","PAYMENT","COUPON","CONFIRM"].forEach((text, i) => {
    const sprite = createTextSprite(text, { fontSize: 21, scale: 0.43, background: "rgba(56,29,4,.94)", color: "#ffc184", border: "rgba(255,159,67,.55)" });
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

  const journeyBanners = [
    ["1  CAPTURE · WHATSAPP MESSAGE", C.green],
    ["2  UNDERSTAND · STRUCTURED DATA", C.purple],
    ["3  VALIDATE · PRICE + STOCK", C.blue],
    ["4  CHECKOUT · ADDRESS + PAYMENT", C.orange],
    ["5  KITCHEN · TICKET #1042", C.amber],
    ["6  DELIVERY · DRIVER ASSIGNED", C.pink],
    ["7  OWNER · SALES + LOYALTY", C.cyan]
  ].map(([text, color]) => {
    const banner = createTextSprite(text, {
      fontSize: 34,
      scale: 0.80,
      background: "rgba(4,8,17,.96)",
      color: hexCss(color),
      border: `${hexCss(color)}cc`
    });
    banner.position.set(0.5, 5.75, 0);
    banner.visible = false;
    world.add(banner);
    return banner;
  });

  const stageGroups = [
    phone,
    restaurant.userData.core,
    restaurant.userData.inventory,
    checkout,
    restaurant.userData.kitchen,
    restaurant.userData.delivery,
    restaurant.userData.owner
  ];

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
    journeyBanners.forEach((banner, index) => banner.visible = index === stage);
    stageGroups.forEach((group, index) => setGroupHighlight(group, PROCESS_COLORS[index], index === stage));
    beep(500 + stage * 52, .05, .019);
  }

  runner.update = (dt, t) => {
    phone.position.y = 2.8 + Math.sin(t * 1.1) * .1;
    infoGroup.rotation.y += dt * .2;
    checkout.rotation.z = Math.sin(t * .45) * .04;
    if (driverRoute.orb.visible) driverRoute.orb.position.copy(driverRoute.curve.getPointAt((t * .17) % 1));
    ownerStats.children.forEach((child, i) => child.position.y += Math.sin(t * 1.1 + i) * .0008);
    journeyBanners.forEach((banner, i) => banner.position.y = 5.75 + Math.sin(t * .9 + i) * .06);
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
  const orderingLabels = [
    ["MENU", C.green], ["MODIFIER", C.red], ["COUPON", C.purple], ["PAYMENT", C.orange], ["TRACKING", C.blue]
  ];
  orderingLabels.forEach(([text, color], i) => {
    const s = createTextSprite(text, {fontSize:24,scale:.46,background:"rgba(4,8,17,.94)",color:hexCss(color),border:`${hexCss(color)}99`});
    const a=i/5*Math.PI*2;
    s.position.set(.4+Math.cos(a)*3.0,2.2+Math.sin(a)*1.2,Math.sin(a)*1.4);
    ordering.add(s);
  });
  const orderingBanner=createTextSprite("PHONE → AI → CART → CHECKOUT",{fontSize:30,scale:.68,background:"rgba(4,8,17,.96)",color:"#ffb56d",border:"rgba(255,159,67,.75)"});
  orderingBanner.position.set(0,5.1,0);ordering.add(orderingBanner);
  groups.ordering=ordering;root.add(ordering);

  const operations=createRestaurant(.74);
  operations.position.set(0,0,0);
  const operationsBanner=createTextSprite("KITCHEN + INVENTORY + DELIVERY + OWNER",{fontSize:29,scale:.66,background:"rgba(4,8,17,.96)",color:"#ffca5c",border:"rgba(255,202,92,.75)"});operationsBanner.position.set(0,5.1,0);operations.add(operationsBanner);
  groups.operations=operations;root.add(operations);

  const growth=new THREE.Group();
  const loyaltyCore=createAICore(.8);loyaltyCore.position.set(0,1.7,0);growth.add(loyaltyCore);
  const growthColors=[C.purple,C.cyan,C.pink,C.blue,C.orange,C.green,C.yellow];
  for(let i=0;i<7;i++){
    const color=growthColors[i];
    const card=roundedBox(1.8,1.05,.08,color,.11,{metalness:.28,roughness:.34,emissive:color,emissiveIntensity:.10});
    const a=i/7*Math.PI*2;card.position.set(Math.cos(a)*3.4,1.9+Math.sin(a*2)*.5,Math.sin(a)*2.4);card.rotation.y=-a+Math.PI/2;
    const label=createTextSprite(["VIP","LOYALTY +20","FAVORITES","ORDER HISTORY","LEVEL 3","SAVE10","REORDER"][i],{fontSize:20,scale:.36,background:"rgba(4,8,17,.90)",color:hexCss(color),border:`${hexCss(color)}88`});label.position.z=.08;card.add(label);growth.add(card);
  }
  const growthBanner=createTextSprite("PROFILE → LOYALTY → CAMPAIGN → REORDER",{fontSize:29,scale:.67,background:"rgba(4,8,17,.96)",color:"#d7c4ff",border:"rgba(164,124,255,.75)"});growthBanner.position.set(0,5.1,0);growth.add(growthBanner);
  groups.growth=growth;root.add(growth);

  const delivery=new THREE.Group();
  const restaurantMarker=roundedBox(2.3,1.3,2.1,C.amber,.18,{metalness:.30,emissive:C.amber,emissiveIntensity:.08});restaurantMarker.position.set(-3,0.65,0);delivery.add(restaurantMarker);
  const restaurantLabel=createTextSprite("RESTAURANT",{fontSize:24,scale:.45,background:"rgba(4,8,17,.94)",color:"#ffca5c",border:"rgba(255,202,92,.7)"});restaurantLabel.position.set(-3,2.15,0);delivery.add(restaurantLabel);
  const customer=roundedBox(1.8,1.8,1.8,C.cyan,.22,{metalness:.28,emissive:C.cyan,emissiveIntensity:.08});customer.position.set(3.4,.9,0);delivery.add(customer);
  const customerLabel=createTextSprite("CUSTOMER",{fontSize:24,scale:.45,background:"rgba(4,8,17,.94)",color:"#4de2c5",border:"rgba(77,226,197,.7)"});customerLabel.position.set(3.4,2.35,0);delivery.add(customerLabel);
  const scooter=createScooter(.72);scooter.position.set(-2.1,.1,0);scooter.rotation.y=Math.PI/2;delivery.add(scooter);
  const droute=createCurvePath([new THREE.Vector3(-2.2,.7,0),new THREE.Vector3(0,.7,1.9),new THREE.Vector3(3.0,.7,0)],C.blue);delivery.add(droute.tube,droute.orb);
  const deliveryBanner=createTextSprite("DISPATCH → DRIVER → CUSTOMER",{fontSize:30,scale:.68,background:"rgba(4,8,17,.96)",color:"#ff8ac7",border:"rgba(255,99,184,.75)"});deliveryBanner.position.set(0,5.0,0);delivery.add(deliveryBanner);
  groups.delivery=delivery;delivery.userData={scooter,route:droute};root.add(delivery);

  const intelligence=new THREE.Group();
  const centerPanel=createDashboardPanel(4.3,2.7,C.cyan,"OWNER INTELLIGENCE");centerPanel.position.set(0,2,0);intelligence.add(centerPanel);
  const panels=[];
  [["DAILY SALES",C.green],["TOP PRODUCTS",C.amber],["CUSTOMERS",C.purple],["DELIVERY",C.blue]].forEach((item,i)=>{
    const panel=createDashboardPanel(2.2,1.4,item[1],item[0]);const a=i/4*Math.PI*2;panel.position.set(Math.cos(a)*3.5,1.8,Math.sin(a)*2.3);panel.rotation.y=-a+Math.PI/2;intelligence.add(panel);panels.push(panel);
  });
  const intelligenceBanner=createTextSprite("ORDERS → METRICS → REPORTS → DECISIONS",{fontSize:29,scale:.68,background:"rgba(4,8,17,.96)",color:"#86ffe8",border:"rgba(77,226,197,.75)"});intelligenceBanner.position.set(0,5.0,0);intelligence.add(intelligenceBanner);
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
  const runner = setupScene("adminCanvas", new THREE.Vector3(12.2, 8.7, 14.2), new THREE.Vector3(0, 1.5, 0));
  if (!runner) return null;
  addLights(runner.scene, 1.0);
  const world = new THREE.Group();
  runner.scene.add(world);
  world.add(createFloor(12, 8));

  const corePanel = createDashboardPanel(4.5, 2.8, C.cyan, "ADMIN HUB · MISSION CONTROL");
  corePanel.position.set(0, 2, 0);
  world.add(corePanel);

  const names = ["orders","kitchen","receipts","promotions","customers","deliveries","reports","staff","inventory","menu","system"];
  const nodeColors = [C.orange,C.amber,C.yellow,C.purple,C.cyan,C.pink,C.blue,C.green,C.blue,C.orange,C.purple];
  const nodes = {};
  const lines = {};

  names.forEach((name, i) => {
    const angle = i / names.length * Math.PI * 2;
    const radius = i % 2 ? 4.5 : 3.9;
    const color = nodeColors[i];
    const node = roundedBox(1.72, .80, .18, color, .14, {metalness:.28,roughness:.34,emissive:color,emissiveIntensity:.08});
    node.position.set(Math.cos(angle) * radius, 1.75 + Math.sin(angle * 2) * .65, Math.sin(angle) * 2.9);
    node.rotation.y = -angle + Math.PI / 2;
    const label = createTextSprite(`${i + 1}  ${name.toUpperCase()}`, {fontSize:21,scale:.40,background:"rgba(4,8,17,.94)",color:hexCss(color),border:`${hexCss(color)}88`});
    label.position.z = .12;
    node.add(label);
    world.add(node);
    nodes[name] = node;

    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,2,0), node.position.clone()]);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color,transparent:true,opacity:.45}));
    world.add(line);
    lines[name] = line;
  });

  const activeBanner = createTextSprite("ORDERS · MESSAGE → STATUS → FULFILLMENT", {fontSize:30,scale:.72,background:"rgba(4,8,17,.96)",color:"#ffb56d",border:"rgba(255,159,67,.8)"});
  activeBanner.position.set(0,5.25,0);
  world.add(activeBanner);

  let active = "orders";
  function highlight(key) {
    active = key;
    Object.entries(nodes).forEach(([name, node], index) => {
      const selected = name === key;
      node.scale.setScalar(selected ? 1.24 : .92);
      node.material.opacity = selected ? 1 : .68;
      node.material.transparent = true;
      lines[name].material.opacity = selected ? 1 : .24;
      setGroupHighlight(node, nodeColors[index], selected);
    });

    const index = names.indexOf(key);
    const texts = {
      orders:"MESSAGE → STATUS → FULFILLMENT",
      kitchen:"TICKET → PREPARING → READY",
      receipts:"ORDER → PAYMENT → RECEIPT",
      promotions:"AUDIENCE → OFFER → CONVERSION",
      customers:"PROFILE → HISTORY → LOYALTY",
      deliveries:"ASSIGNMENT → ROUTE → COMPLETE",
      reports:"DATA → METRICS → DECISIONS",
      staff:"ROLE → ACCESS → RESPONSIBILITY",
      inventory:"USAGE → STOCK → ALERT",
      menu:"PRODUCT → PRICE → AVAILABILITY",
      system:"INTEGRATION → HEALTH → CONTROL"
    };
    const replacement = createTextSprite(`${key.toUpperCase()} · ${texts[key]}`, {fontSize:30,scale:.72,background:"rgba(4,8,17,.96)",color:hexCss(nodeColors[index]),border:`${hexCss(nodeColors[index])}cc`});
    const oldTexture = activeBanner.material.map;
    activeBanner.material.map = replacement.material.map;
    activeBanner.scale.copy(replacement.scale);
    activeBanner.material.needsUpdate = true;
    if (oldTexture) oldTexture.dispose();
    beep(620, .045, .018);
  }

  runner.update = (dt, t) => {
    corePanel.position.y = 2 + Math.sin(t * .8) * .11;
    activeBanner.position.y = 5.25 + Math.sin(t * .9) * .06;
    corePanel.userData.bars.forEach((bar, i) => bar.scale.y = .78 + Math.sin(t * 1.2 + i * .5) * .16);
    Object.values(nodes).forEach((node, i) => node.position.y += Math.sin(t + i) * .0007);
  };

  highlight("orders");
  return { focus: highlight };
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

/*
 * The homepage intentionally creates only one WebGL renderer.
 * Product proof is handled by the lightweight HTML/JavaScript Taco Heat demo.
 * This keeps the sales page clearer and significantly reduces GPU load.
 */
window.OrderRise3D = {
  focusHero: key => hero?.focus(key),
  setOrderStage: () => {},
  setJourneyStage: () => {},
  setPillar: () => {},
  focusDevice: () => {},
  focusAdmin: () => {},
  setSound: enabled => {
    soundEnabled = Boolean(enabled);
    if (soundEnabled) beep(660, .07, .022);
  }
};

if (window.__orderRisePending3D) {
  for (const [method, args] of Object.entries(window.__orderRisePending3D)) {
    if (typeof window.OrderRise3D[method] === "function") {
      window.OrderRise3D[method](...(args || []));
    }
  }
  delete window.__orderRisePending3D;
}

animate();
