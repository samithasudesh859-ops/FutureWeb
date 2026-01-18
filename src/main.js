import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- Scene & Background ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// --- Bloom (Glow Effect) ---
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

// --- The Black Hole Shader (Optimized for Web) ---
const bhGeometry = new THREE.PlaneGeometry(20, 15);
const bhMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;

        void main() {
            vec2 uv = (vUv - 0.5) * 2.0;
            uv.x *= 1.5;
            uv += uMouse * 0.05;

            float r = length(uv);
            float angle = atan(uv.y, uv.x);

            // Black Core
            float hole = smoothstep(0.25, 0.27, r);

            // Accretion Disk (Gargantua Style)
            float disk = 0.012 / abs(uv.y - 0.02 * sin(uv.x * 2.0 + uTime));
            disk *= smoothstep(0.3, 0.8, r) * smoothstep(1.5, 0.8, r);

            // Gravitational Lensing Rings
            float rings = 0.015 / abs(r - (0.45 + 0.15 * sin(angle)));
            rings += 0.01 / abs(r - (0.35 - 0.1 * cos(angle)));

            vec3 color = vec3(1.0, 0.4, 0.1) * (disk + rings);
            color += vec3(1.0, 0.8, 0.2) * pow(disk + rings, 2.0);

            gl_FragColor = vec4(color * hole, 1.0);
        }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending
});

const blackHole = new THREE.Mesh(bhGeometry, bhMaterial);
scene.add(blackHole);

// --- Stars Layer ---
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(5000 * 3);
for(let i=0; i<15000; i++) starPos[i] = (Math.random() - 0.5) * 100;
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 })));

camera.position.z = 10;

// --- Animation Loop ---
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
    requestAnimationFrame(animate);
    bhMaterial.uniforms.uTime.value += 0.02;
    bhMaterial.uniforms.uMouse.value.x += (mouseX - bhMaterial.uniforms.uMouse.value.x) * 0.05;
    bhMaterial.uniforms.uMouse.value.y += (-mouseY - bhMaterial.uniforms.uMouse.value.y) * 0.05;
    composer.render();
}
animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});