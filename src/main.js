import * as THREE from 'three';
import vertexShader from '../shaders/vertexShader.glsl';
import fragmentShader from '../shaders/fragmentShader.glsl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 15;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'),antialias: true,alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create red material (no shader, solid red color)
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uColorChange: { value: 0 },
  },
});

// Create sphere geometry
const geometry = new THREE.IcosahedronGeometry(2, 50, 50);
const sphere = new THREE.Mesh(geometry, material);
sphere.position.y = -2.5;
scene.add(sphere);

// Mouse control variables
let mouseX = 0;
let mouseY = 0;
let isMouseDown = false;
let zoomLevel = 5;

// Mouse event listeners
document.addEventListener('mousedown', (event) => {
  isMouseDown = true;
});

document.addEventListener('mouseup', (event) => {
  isMouseDown = false;
});

document.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }
});

// Wheel event listener for zoom


document.addEventListener('wheel', (event) => {
  if (event.altKey) { // 👈 Only zoom when Alt key is held
    event.preventDefault();
    const zoomSpeed = 0.05;
    zoomLevel += event.deltaY * zoomSpeed;
    zoomLevel = Math.max(1, Math.min(20, zoomLevel));
    camera.position.z = zoomLevel;
  }
}, { passive: false });

var tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.landing',
    start: 'top top',
    end: 'bottom center',
    scrub: 2,
   
  }
});

tl.to(sphere.position, {
   y: 2.5, 
   z: -8,
   ease: 'power2.inOut',
  },"a").to(material.uniforms.uColorChange,{
    value: 1,
    ease: 'power2.inOut',
  },"a")

  .to(".landing h1",{
    opacity: 0,
    ease: 'power2.inOut',
  },"a")
  .to(".landing p",{
    opacity: 1,
  });



const clock = new THREE.Clock();

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate the sphere based on mouse position when mouse is down
  if (isMouseDown) {
    sphere.rotation.x = mouseY * Math.PI;
    sphere.rotation.y = mouseX * Math.PI;
  }
  material.uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
