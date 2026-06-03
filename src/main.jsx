
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import './style.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import PortfolioSections from './PortfolioSections';
import { brain } from './EliteBrain';
import ThinkingAnimation from './ThinkingAnimation';
import React, { useState, useEffect, useRef, useMemo } from 'react';

function Rig() {
  return useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 1.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 1.5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
}

function Particles({ isTouching }) {
  const pointsRef = useRef();
  const count = 5000;
  const warpTimer = useRef(0);
  const [isWarping, setIsWarping] = useState(false);

  const particlesData = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const seeds = new Float32Array(count); 
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 150;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 150;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 150;
      speeds[i] = Math.random() * 0.5 + 0.2;
      seeds[i] = Math.random() * Math.PI * 2; 
    }
    return { positions: pos, speeds: speeds, seeds: seeds };
}, []);

  useEffect(() => {
    if (isTouching) {
      setIsWarping(true);
      warpTimer.current = 8.0; 
    }
  }, [isTouching]);

useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array;
    const colors = pointsRef.current.geometry.attributes.color.array;
    const activeSpeed = isWarping ? 25.0 : 0; 

    for (let i = 0; i < count; i++) {

      if (isWarping) {
        positions[i * 3 + 2] += particlesData.speeds[i] * activeSpeed * delta;
        if (positions[i * 3 + 2] > 75) positions[i * 3 + 2] = -75;
      }

      const flicker = 0.3 + Math.sin(time * 2 + particlesData.seeds[i]) * 0.7;
      colors[i * 3] = flicker;
      colors[i * 3 + 1] = flicker;
      colors[i * 3 + 2] = flicker;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
});
  return (
  <points ref={pointsRef}>
  <bufferGeometry>
    <bufferAttribute attach="attributes-position" count={count} array={particlesData.positions} itemSize={3} />
    <bufferAttribute attach="attributes-color" count={count} array={new Float32Array(count * 3)} itemSize={3} />
  </bufferGeometry>
  <pointsMaterial 
    size={0.15} 
    vertexColors 
    transparent 
    sizeAttenuation={true} 
    blending={THREE.AdditiveBlending} 
  />
</points>
  );
}


function UltraBlob({ isAiOpen, isTouching, scrollOffset = { x: 0, y: 0 } }) {
  const meshRef = useRef();
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const envMap = useMemo(() => {
    const tex = textureLoader.load('/env.jpg');
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return tex;
  }, [textureLoader]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      const baseTargetX = isAiOpen ? -2.2 : state.mouse.x * 1.2;
      const baseTargetY = state.mouse.y * 0.8;
      const targetX = baseTargetX + scrollOffset.x;
      const targetY = baseTargetY + scrollOffset.y;
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
      meshRef.current.distort = THREE.MathUtils.lerp(meshRef.current.distort, isTouching ? 1.5 : 0.6, 0.1);
      const s = THREE.MathUtils.lerp(meshRef.current.scale.x, isTouching ? 3.2 : 2.8, 0.1);
      meshRef.current.scale.set(s, s, s);
      meshRef.current.rotation.z += 0.005;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 256, 256]} ref={meshRef}>
        <MeshDistortMaterial envMap={envMap} envMapIntensity={2.5} color="#ffffff" speed={4} distort={0.6} radius={1} metalness={1} roughness={0.01} iridescence={1} />
      </Sphere>
    </Float>
  );
}

function App() {

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const [hasEntered, setHasEntered] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: "Greetings. Welcome to Next Web Solutions. I am the Elite Assistant. How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
  const chatEndRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      const height = window.innerHeight;
      if (scroll < height * 0.5) setScrollOffset({ x: 0, y: 0 });
      else if (scroll < height * 1.5) setScrollOffset({ x: -5, y: 0.5 });
      else setScrollOffset({ x: 5, y: 0 });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgMusic = useMemo(() => {
    const audio = new Audio('/bg-music.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    return audio;
  }, []);

  const rippleSnd = useMemo(() => new Audio('/touch-sound.mp3'), []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleEnter = () => {
    rippleSnd.play().catch(() => {});
    setHasEntered(true);
    bgMusic.play().catch(e => console.log("Autoplay blocked"));
  };

  const handleLaunchAi = (e) => {
    if (e) e.stopPropagation();
    rippleSnd.play().catch(() => {});
    setIsAiOpen(true);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    window.speechSynthesis.cancel();
    rippleSnd.play().catch(() => {});
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    const aiResponse = brain.generateResponse(currentInput);
    const dynamicDelay = Math.min(Math.max(currentInput.length * 150, 1500), 4000);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      if (!isMuted) {
        const speech = new SpeechSynthesisUtterance(aiResponse);
        speech.lang = "en-US";
        speech.rate = 1.0;
        speech.pitch = 1.2;
        window.speechSynthesis.speak(speech);
      }
      setIsTyping(false);
    }, dynamicDelay);
  };

  return (
    <div className="canvas-container" onPointerDown={() => setIsTouching(true)} onPointerUp={() => setIsTouching(false)}>
      {!hasEntered && (
  <div className="intro-overlay">
    <h2 className="intro-sub">ELITE WEB</h2>
    <h1 className="intro-title">SAMITHA SUDESH</h1>
    
{isSmallScreen && (
  <div className="system-alert">
    <p>3D SPATIAL INTERFACE OPTIMIZED FOR DESKTOP</p>
    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
      Please access via a desktop browser to experience the immersive environment.
    </span>
  </div>
)}

    <button className="enter-btn" onClick={handleEnter}>ENTER THE MYSTERY</button>
  </div>
)}

    <Canvas camera={{ position: [0, 0, 8] }}>
  <color attach="background" args={['#000']} />
  <Environment preset="city" />
  
  {hasEntered && (
    <>
      <Rig />
      <Particles isTouching={isTouching} />
      
      {!isSmallScreen && (
        <UltraBlob 
          isAiOpen={isAiOpen} 
          isTouching={isTouching} 
          scrollOffset={scrollOffset} 
        />
      )}

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} intensity={0.5} />
      </EffectComposer>
    </>
  )}
</Canvas>

      {hasEntered && !isAiOpen && <PortfolioSections handleLaunchAi={handleLaunchAi} />}

      {hasEntered && (
        <div className={`elite-panel ${isAiOpen ? 'open' : ''}`}>
          <div className="elite-header">
            <span>SYSTEM: ELITE AI INTERFACE</span>
            <button onClick={() => { setIsMuted(!isMuted); if (!isMuted) window.speechSynthesis.cancel(); }}>{isMuted ? "🔇" : "🔊"}</button>
            <button onClick={() => setIsAiOpen(false)}>×</button>
          </div>
          <div className="ai-chat-area">
            {messages.map((m, i) => <div key={i} className={`ai-msg ${m.role}`}>{m.text}</div>)}
            {isTyping && <ThinkingAnimation />}
            <div ref={chatEndRef} style={{ height: '1px' }} />
          </div>
          <div className="ai-input-wrapper">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask me anything..." className="ai-input" />
            <button onClick={handleSend} className="send-btn">➔</button>
          </div>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);