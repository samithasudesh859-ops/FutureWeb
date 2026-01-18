import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Smooth Sphere Geometry
const geometry = new THREE.IcosahedronGeometry(2, 50); // High detail for smoothness
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  },
  vertexShader: `
    varying vec2 vUv;
    varying float vDistortion;
    uniform float uTime;
    uniform vec2 uMouse;
    
    // Noise function for organic movement
    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
    float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0);
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      // මවුස් එක සහ ටයිම් එක අනුව බෝලය හැඩය වෙනස් කරනවා
      vDistortion = snoise(position + uTime * 0.5 + uMouse.x);
      vec3 newPos = position + normal * vDistortion * 0.5;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
  fragmentShader: `
    varying float vDistortion;
    void main() {
      // Future Blue/Purple Color mix
      vec3 color = mix(vec3(0.1, 0.4, 1.0), vec3(0.6, 0.2, 1.0), vDistortion);
      gl_FragColor = vec4(color, 1.0);
    }
  `
});

const blob = new THREE.Mesh(geometry, material);
scene.add(blob);

camera.position.z = 5;

window.addEventListener('mousemove', (e) => {
  material.uniforms.uMouse.value.x = (e.clientX / window.innerWidth) * 2 - 1;
  material.uniforms.uMouse.value.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);
  material.uniforms.uTime.value += 0.01;
  blob.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();