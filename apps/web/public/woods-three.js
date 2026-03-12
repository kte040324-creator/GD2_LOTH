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
  const isSandalDetail = isSandal && container.closest(".sandal-product");
  const isWjDetail = modelPath.includes("gem_whitejade") && container.closest(".wj-product");
  const isAgDetail = modelPath.includes("gem_agate") && container.closest(".ag-product");
  const isJdDetail = modelPath.includes("gem_jade") && container.closest(".jd-product");
  const isRudDetail = modelPath.includes("seed_rudraksha") && container.closest(".rud-product");
  const isAoDetail = modelPath.includes("seed_autumnolive") && container.closest(".ao-product");
  const isLotDetail = modelPath.includes("seed_lotus") && container.closest(".lot-product");
  const width = (isWjDetail || isAgDetail || isJdDetail || isRudDetail || isAoDetail || isLotDetail) ? 492 : (isSandalDetail ? 492 : (isSandal ? 550 : RECT_SIZE));
  const height = (isWjDetail || isSandalDetail || isAgDetail || isJdDetail || isRudDetail || isAoDetail || isLotDetail) ? 423 : RECT_SIZE;

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
  if (isSandal && !isSandalDetail) {
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
      /* gem_agate: 리스팅에서만 위치/스케일 보정, 디테일(ag-product)에서는 아래에서 처리 */
      if (modelPath.includes("gem_agate") && !container.closest(".ag-product")) {
        model.position.x += 1.05;
        model.position.y -= 0.75;
        model.scale.multiplyScalar(1.2);
      }
      /* gem_jade: 리스팅에서만 위치/스케일 보정, 디테일(jd-product)에서는 아래에서 처리 */
      if (modelPath.includes("gem_jade") && !container.closest(".jd-product")) {
        model.position.x += 1.05;
        model.position.y -= 0.8;
        model.scale.multiplyScalar(1.1);
      }
      /* seed_rudraksha: 리스팅에서만 위치 보정, 디테일(rud-product)에서는 아래에서 처리 */
      if (modelPath.includes("seed_rudraksha") && !container.closest(".rud-product")) {
        model.position.x -= 0.5;
        model.position.y += 0.35;
      }
      /* seed_autumnolive: 리스팅에서만 위치 보정, 디테일(ao-product)에서는 아래에서 처리 */
      if (modelPath.includes("seed_autumnolive") && !container.closest(".ao-product")) {
        model.position.x += 1.3;
        model.position.y -= 0.5;
      }
      /* seed_lotus: 리스팅에서만 위치 보정, 디테일(lot-product)에서는 아래에서 처리 */
      if (modelPath.includes("seed_lotus") && !container.closest(".lot-product")) {
        model.position.x += 0.3;
        model.position.y += 0.05;
      }
      if (modelPath.includes("seed_") && !(modelPath.includes("seed_rudraksha") && container.closest(".rud-product")) && !(modelPath.includes("seed_autumnolive") && container.closest(".ao-product")) && !(modelPath.includes("seed_lotus") && container.closest(".lot-product"))) {
        model.scale.multiplyScalar(1.2);
      }
      /* wood_jujube: 리스팅(woods)에서는 작게, 디테일 페이지에서만 크게 */
      if (modelPath.includes("wood_jujube")) {
        if (container.closest(".jub-product")) {
          model.scale.multiplyScalar(1.4);
        } else {
          model.scale.multiplyScalar(0.85);
        }
      }
      /* wood_ebony: 리스팅에서는 작게, 디테일 페이지(ebo-product)에서만 크게 */
      if (modelPath.includes("wood_ebony")) {
        if (container.closest(".ebo-product")) {
          model.scale.multiplyScalar(1.4);
        } else {
          model.scale.multiplyScalar(0.85);
        }
      }
      /* wood_sandal: 디테일 페이지(sandal-product)에서는 492×423 박스에 맞게 스케일 */
      if (modelPath.includes("wood_sandal") && container.closest(".sandal-product")) {
        model.scale.multiplyScalar(1.25);
      }
      /* gem_whitejade: 디테일 페이지(wj-product)에서 492×423 박스에 맞게 스케일 */
      if (modelPath.includes("gem_whitejade") && container.closest(".wj-product")) {
        model.scale.multiplyScalar(1.2);
      }
      /* gem_agate: 디테일 페이지(ag-product)에서 492×423 박스에 맞게 스케일 */
      if (modelPath.includes("gem_agate") && container.closest(".ag-product")) {
        model.scale.multiplyScalar(1.2);
      }
      /* gem_jade: 디테일 페이지(jd-product)에서 492×423 박스에 맞게 스케일 */
      if (modelPath.includes("gem_jade") && container.closest(".jd-product")) {
        model.scale.multiplyScalar(1.2);
      }
      /* seed_rudraksha: 디테일 페이지(rud-product)에서 492×423 박스에 맞게 스케일 */
      if (modelPath.includes("seed_rudraksha") && container.closest(".rud-product")) {
        model.scale.multiplyScalar(1.2);
      }
      /* seed_autumnolive: 디테일 페이지(ao-product)에서 492×423 박스에 맞게 스케일 */
      if (modelPath.includes("seed_autumnolive") && container.closest(".ao-product")) {
        model.scale.multiplyScalar(1.2);
      }
      /* seed_lotus: 디테일 페이지(lot-product)에서 492×423 박스에 맞게 스케일 */
      if (modelPath.includes("seed_lotus") && container.closest(".lot-product")) {
        model.scale.multiplyScalar(1.2);
      }
      model.rotation.x = Math.PI / 4;
      model.rotation.y = Math.PI / 4;
    },
    undefined,
    (err) => console.error("GLTF load error:", err)
  );

  const isSeed = modelPath.includes("seed_");
  const isAutumnOlive = modelPath.includes("seed_autumnolive");
  const isLotus = modelPath.includes("seed_lotus");
  const isJujube = modelPath.includes("wood_jujube");
  const isEbony = modelPath.includes("wood_ebony");

  const seedLightBoost = isAutumnOlive || isLotus ? 1.25 : 1.0;
  const darkWoodBoost = isJujube || isEbony ? 1.8 : 1.0;

  const ambient = new THREE.AmbientLight(
    0xfff0e6,
    isSeed ? 1.3 * seedLightBoost : 1.0 * darkWoodBoost
  );
  scene.add(ambient);
  const hemisphere = new THREE.HemisphereLight(
    0xd4edda,
    0xffe4e1,
    isSeed ? 0.9 * seedLightBoost : 0.7 * darkWoodBoost
  );
  scene.add(hemisphere);
  const directional = new THREE.DirectionalLight(
    0xffe4d6,
    isSeed ? 1.5 * seedLightBoost : 1.2 * darkWoodBoost
  );
  directional.position.set(2, 2, 3);
  scene.add(directional);
  const fill = new THREE.DirectionalLight(
    0xd4edda,
    isSeed ? 0.7 * seedLightBoost : 0.5 * darkWoodBoost
  );
  fill.position.set(-1.5, 1, 2);
  scene.add(fill);
  const back = new THREE.DirectionalLight(
    0xffd6d6,
    isSeed ? 0.45 * seedLightBoost : 0.3 * darkWoodBoost
  );
  back.position.set(0, 0, -2);
  scene.add(back);

  if (isJujube || isEbony) {
    const front = new THREE.DirectionalLight(0xffffff, 0.6);
    front.position.set(0, 0.5, 2.5);
    scene.add(front);
  }

  let frameId = 0;
  const animate = () => {
    frameId = requestAnimationFrame(animate);
    if (model) model.rotation.z += ROTATION_SPEED;
    renderer.render(scene, camera);
  };
  animate();

  const resize = () => {
    const w = (isWjDetail || isAgDetail || isJdDetail || isRudDetail || isAoDetail || isLotDetail) ? (container.clientWidth || 492) : (isSandalDetail ? (container.clientWidth || 492) : (isSandal ? 550 : (container.clientWidth || RECT_SIZE)));
    const h = (isWjDetail || isSandalDetail || isAgDetail || isJdDetail || isRudDetail || isAoDetail || isLotDetail) ? (container.clientHeight || 423) : (container.clientHeight || RECT_SIZE);
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
  document.querySelectorAll(".woods-rect__canvas[data-model], .gems-rect__canvas[data-model], .seeds-rect__canvas[data-model], .jujube-rect__canvas[data-model], .ebo-rect__canvas[data-model], .sandal-rect__canvas[data-model], .wj-rect__canvas[data-model], .ag-rect__canvas[data-model], .jd-rect__canvas[data-model], .rud-rect__canvas[data-model], .ao-rect__canvas[data-model], .lot-rect__canvas[data-model]").forEach((el) => {
    initThree(el);
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(initAllCanvases));
} else {
  requestAnimationFrame(initAllCanvases);
}
