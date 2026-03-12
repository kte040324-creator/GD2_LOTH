import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * 3dmodelsetting1: 공통 회전각도(x,y 45°) + 초록/레드 라이팅 + 회전속도(0.0035)
 * sandal은 예외: position/scale/canvas 너비만 별도 적용, 위 설정은 동일 적용
 */

const RECT_SIZE = 470;
const GLTF_BASE = "./assets/gltf/";
const ROTATION_SPEED = 0.0035;

function initThree(container) {
  const modelPath = container.dataset.model;
  if (!modelPath) return;

  const scene = new THREE.Scene();

  const isSandal = modelPath.includes("wood_sandal");
  const width = isSandal ? 550 : RECT_SIZE;
  const height = RECT_SIZE;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const canvasEl = renderer.domElement;
  if (isSandal) {
    canvasEl.style.position = "absolute";
    canvasEl.style.left = "-80px";
  }
  container.appendChild(canvasEl);

  const loader = new GLTFLoader();
  let model = null;

  loader.load(
    GLTF_BASE + modelPath + "?t=" + Date.now(),
    (gltf) => {
      model = gltf.scene;
      scene.add(model);

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const isSandal = modelPath.includes("wood_sandal");
      const scale = (2 / maxDim) * (isSandal ? 1 : 1.3);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      if (isSandal) {
        model.position.x += 1.0;
        model.position.y -= 0.1;
      }
      if (modelPath.includes("gem_agate")) {
        model.position.x += 1.05;
        model.position.y -= 0.75;
        model.scale.multiplyScalar(1.2);
      }
      if (modelPath.includes("gem_jade")) {
        model.position.x += 1.05;
        model.position.y -= 0.8;
        model.scale.multiplyScalar(1.1);
      }
      if (modelPath.includes("seed_rudraksha")) {
        model.position.x -= 0.5;
        model.position.y += 0.35;
      }
      if (modelPath.includes("seed_autumnolive")) {
        model.position.x += 1.3;
        model.position.y -= 0.5;
      }
      if (modelPath.includes("seed_lotus")) {
        model.position.x += 0.3;
        model.position.y += 0.2;
      }
      model.rotation.x = Math.PI / 4;
      model.rotation.y = Math.PI / 4;
    },
    undefined,
    (err) => console.error("GLTF load error:", err)
  );

  const ambient = new THREE.AmbientLight(0xfff0e6, 1.0);
  scene.add(ambient);
  const hemisphere = new THREE.HemisphereLight(0xd4edda, 0xffe4e1, 0.7);
  scene.add(hemisphere);
  const directional = new THREE.DirectionalLight(0xffe4d6, 1.2);
  directional.position.set(2, 2, 3);
  scene.add(directional);
  const fill = new THREE.DirectionalLight(0xd4edda, 0.5);
  fill.position.set(-1.5, 1, 2);
  scene.add(fill);
  const back = new THREE.DirectionalLight(0xffd6d6, 0.3);
  back.position.set(0, 0, -2);
  scene.add(back);

  let frameId = 0;
  const animate = () => {
    frameId = requestAnimationFrame(animate);
    if (model) model.rotation.z += ROTATION_SPEED;
    renderer.render(scene, camera);
  };
  animate();

  const resize = () => {
    const w = isSandal ? 550 : (container.clientWidth || RECT_SIZE);
    const h = container.clientHeight || RECT_SIZE;
    if (w > 0 && h > 0) {
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  };

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  requestAnimationFrame(resize);

  return () => {
    cancelAnimationFrame(frameId);
    observer.disconnect();
    renderer.dispose();
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
}

function initAllCanvases() {
  document.querySelectorAll(".woods-rect__canvas[data-model], .gems-rect__canvas[data-model], .seeds-rect__canvas[data-model]").forEach((el) => {
    initThree(el);
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(initAllCanvases));
} else {
  requestAnimationFrame(initAllCanvases);
}
