import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
const defaultModel = '../../assets/models/robot.glb';

function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x02030a, 0);

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.6, 3.2);

  const hemiLight = new THREE.HemisphereLight(0x7586bf, 0x050b1d, 0.45);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0x6ab7ff, 1.0);
  keyLight.position.set(2.8, 3.2, 2.6);
  keyLight.castShadow = false;
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x2a6ad2, 0.9, 14, 2);
  fillLight.position.set(-2.4, 1.1, 1.8);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0x58d8ff, 1.3, 16, 2);
  rimLight.position.set(0.6, 2.4, -2.8);
  scene.add(rimLight);

  const backLight = new THREE.PointLight(0x1a3f78, 1.6, 18, 2);
  backLight.position.set(0, 2.8, -3.5);
  scene.add(backLight);

  const grid = new THREE.GridHelper(12, 24, 0x18426c, 0x081a2f);
  grid.rotation.x = Math.PI / 2;
  grid.position.y = -1.8;
  grid.material.opacity = 0.16;
  grid.material.transparent = true;
  scene.add(grid);

  const loader = new GLTFLoader();
  const robotGroup = new THREE.Group();
  scene.add(robotGroup);

  loader.load(
    defaultModel,
    gltf => {
      const model = gltf.scene;
      model.position.set(0, -1.05, 0);
      model.rotation.y = Math.PI * 0.45;
      model.scale.setScalar(1.05);
      model.traverse(node => {
        if (node.isMesh) {
          node.castShadow = false;
          node.receiveShadow = false;
          if (node.material) {
            node.material.envMapIntensity = 0.9;
          }
        }
      });
      robotGroup.add(model);
      console.info('Modelo 3D cargado correctamente');
    },
    xhr => {
      if (xhr && xhr.total) {
        const progress = Math.round((xhr.loaded / xhr.total) * 100);
        console.debug(`Carga robot 3D: ${progress}%`);
      }
    },
    error => {
      const fallback = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.7, 0.18, 128, 32),
        new THREE.MeshStandardMaterial({
          color: 0x2f6cde,
          roughness: 0.2,
          metalness: 0.8,
          emissive: 0x1e4f9b,
          emissiveIntensity: 0.7,
        }),
      );
      fallback.position.set(0, -0.8, 0);
      robotGroup.add(fallback);
      console.warn('No se pudo cargar el modelo 3D:', error);
    },
  );

  const clock = new THREE.Clock();

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    robotGroup.rotation.y = Math.sin(elapsed * 0.35) * 0.2;
    robotGroup.position.y = Math.sin(elapsed * 0.35) * 0.02;
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
}

export function initRobotScene(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) {
    console.error('No se encontró el canvas para la escena 3D:', selector);
    return;
  }

  createScene(canvas);
}
