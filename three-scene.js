
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


function supportsWebGL() {
  try {
    const testCanvas = document.createElement("canvas");
    return Boolean(
      testCanvas.getContext("webgl2") ||
      testCanvas.getContext("webgl")
    );
  } catch (_) {
    return false;
  }
}

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

function setFallback() {
  document.documentElement.classList.remove("webgl-ready");
  document.documentElement.classList.add("webgl-static");
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

const shouldEnhanceWith3D =
  window.matchMedia("(min-width: 761px)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  supportsWebGL();

const hero = shouldEnhanceWith3D ? buildHero() : null;

if (hero) {
  document.documentElement.classList.add("webgl-ready");

  const fallback = document.querySelector(
    '[data-fallback-for="hero3dCanvas"]'
  );

  if (fallback) {
    fallback.classList.remove("show");
  }
} else {
  document.documentElement.classList.add("webgl-static");
}

/*
 * The website is static-first. WebGL is an optional desktop enhancement.
 * The Taco Heat demo and all conversion content work without the 3D engine.
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
