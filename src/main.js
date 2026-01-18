import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

// NASA Black Hole Shader (The "No-Banana" Solution)
const bhGeo = new THREE.PlaneGeometry(20, 20);
const bhMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
            vec2 uv = (vUv - 0.5) * 2.0;
            uv.x *= 1.7;
            float r = length(uv);
            float hole = smoothstep(0.2, 0.22, r);
            
            // This math creates the liquid fire flow
            float disk = 0.02 / abs(uv.y - 0.05 * sin(uv.x * 2.0 + uTime));
            disk *= smoothstep(0.2, 0.8, r) * smoothstep(1.2, 0.8, r);
            
            // The Hump (Gravitational Lensing)
            float hump = 0.03 / abs(r - (0.4 + 0.1 * sin(atan(uv.y, uv.x) * 1.0)));
            
            vec3 fire = vec3(1.0, 0.4, 0.1) * (disk + hump);
            fire += vec3(1.0, 0.8, 0.2) * pow(disk + hump, 2.0);
            
            gl_FragColor = vec4(fire * hole, 1.0);
        }
    `,
    transparent: true, blending: THREE.AdditiveBlending
});

scene.add(new THREE.Mesh(bhGeo, bhMat));
camera.position.z = 1;

function animate() {
    requestAnimationFrame(animate);
    bhMat.uniforms.uTime.value += 0.03;
    renderer.render(scene, camera);
}
animate();