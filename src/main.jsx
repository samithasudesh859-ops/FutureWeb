import React, { useRef, useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import './style.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- [පරණ API Key සහ genAI පේළි මකන්න] ---

// 🧠 Custom Elite Knowledge Base (API Key අවශ්‍ය නැත)
cconst handleSend = async () => {
    if (!input.trim()) return;
    
    rippleSnd.play(); 
    const userMsg = { role: 'user', text: input };
    
    // 1. User මැසේජ් එක ඇඩ් කරනවා
    setMessages(prev => [...prev, userMsg]);
    
    const userInput = input.toLowerCase();
    setInput("");
    setIsTyping(true);

    // 🕒 Realistic Delay (අකුරු ගණන අනුව තත්පර 0.8 - 2 අතර කාලයක් ගනියි)
    const processTime = Math.min(Math.max(userInput.length * 20, 800), 2000);

    setTimeout(() => {
      let finalResponse = "Query analyzed. While my current data-stream doesn't have a direct match for that specific inquiry, our elite human developers certainly do. Please redirect this query to Samitha: https://wa.me/94756724255";

      // 🔍 Matching Logic
      for (const category in ELITE_DATA) {
        const match = ELITE_DATA[category].keywords.some(word => userInput.includes(word));
        if (match) {
          finalResponse = ELITE_DATA[category].response;
          break;
        }
      }

      // 2. AI මැසේජ් එක ඇඩ් කරනවා (prev පාවිච්චි කිරීම අනිවාර්යයි)
      setMessages(prev => [...prev, { role: 'ai', text: finalResponse }]);
      setIsTyping(false);
    }, processTime); 
  };



// 🎥 කැමරාව මවුස් එකත් එක්ක ඇලවෙන රිග් එක
function Rig() {
  return useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 1.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 1.5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
}

// 🌌 Warp Effect එක සහිත තරු පද්ධතිය
function Particles({ isTouching }) {
  const ref = useRef();
  const stride = 3;
  const count = 2000;
  const zPos = useRef(0);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * stride);
    for (let i = 0; i < count; i++) {
      pos[i * stride] = (Math.random() - 0.5) * 15;
      pos[i * stride + 1] = (Math.random() - 0.5) * 15;
      pos[i * stride + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    // ටච් කරද්දී තරු අපේ පැත්තට එනවා (Warp)
    const targetZ = isTouching ? 6 : 0;
    zPos.current = THREE.MathUtils.lerp(zPos.current, targetZ, 0.05);
    ref.current.position.z = zPos.current;
    ref.current.rotation.y += 0.002;
  });

  return (
    <Points ref={ref} positions={positions} stride={stride}>
      <PointMaterial transparent color="#ffffff" size={0.015} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

// 💧 Organic Liquid Metal Blob
function UltraBlob({ isAiOpen, isTouching }) {
  const meshRef = useRef();
  const targetDistort = useRef(0.6); // රවුම් ගතිය නැති කරන්න distortion එක වැඩි කළා
  const targetScale = useRef(2.8);
  const rippleSnd = useMemo(() => new Audio('/touch-sound.mp3'), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // මවුස් එකත් එක්ක බෝලයත් පොඩ්ඩක් ඇලවීම (Parallax)
      const targetX = isAiOpen ? -2.2 : state.mouse.x * 1.2;
      const targetY = state.mouse.y * 0.8;
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
      
      // ටච් එකට ප්‍රතිචාරය
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
        <MeshDistortMaterial 
          color="#ffffff" speed={4} distort={0.6} radius={1} 
          metalness={1} roughness={0.01} iridescence={1} 
        />
      </Sphere>
    </Float>
  );
}


function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Greetings. Welcome to Next Web Solutions. I am the Elite Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // 🎵 Audio Setup
  const bgMusic = useMemo(() => {
    const audio = new Audio('/bg-music.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    return audio;
  }, []);

  const rippleSnd = useMemo(() => new Audio('/touch-sound.mp3'), []);

  // Auto-scroll logic
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handlers
  const handleEnter = () => {
    rippleSnd.play(); // බටන් එකට විතරක් සද්දේ
    setHasEntered(true);
    bgMusic.play().catch(e => console.log("Autoplay blocked"));
  };

  const handleLaunchAi = (e) => {
    e.stopPropagation();
    rippleSnd.play(); // බටන් එකට විතරක් සද්දේ
    setIsAiOpen(true);
  };

// --- [App function එක ඇතුළේ handleSend එක මේ විදිහට වෙනස් කරන්න] ---

const handleSend = async () => {
  if (!input.trim()) return;
  
  rippleSnd.play(); 
  const userMsg = { role: 'user', text: input };
  setMessages(prev => [...prev, userMsg]);
  const userInput = input.toLowerCase();
  setInput("");
  setIsTyping(true);

  setTimeout(() => {
    let finalResponse = "Query analyzed. While I don't have a direct data-match for that specific request, Next Web Solutions can certainly handle any advanced web requirement. Would you like to discuss this with Lead Developer Samitha? https://wa.me/94756724255";

    // Loop through all categories to find a keyword match
    for (const category in ELITE_DATA) {
      const match = ELITE_DATA[category].keywords.some(word => userInput.includes(word));
      if (match) {
        finalResponse = ELITE_DATA[category].response;
        break;
      }
    }

    setMessages(prev => [...prev, { role: 'ai', text: finalResponse }]);
    setIsTyping(false);
  }, 1000); 
};

  return (
    <div className="canvas-container" 
         onPointerDown={() => setIsTouching(true)} 
         onPointerUp={() => setIsTouching(false)}>
      
      {/* 1. Intro Overlay */}
      {!hasEntered && (
        <div className="intro-overlay">
          <h2 className="intro-sub">WELCOME TO THE</h2>
          <h1 className="intro-title">FUTURE WEB</h1>
          <button className="enter-btn" onClick={handleEnter}>ENTER THE MYSTERY</button>
        </div>
      )}

      {/* 2. 3D Canvas Scene */}
      <Canvas camera={{ position: [0, 0, 8] }}>
        <color attach="background" args={['#000']} />
        <Environment preset="city" />
        {hasEntered && (
          <>
            <Rig />
            <Particles isTouching={isTouching} />
            <UltraBlob isAiOpen={isAiOpen} isTouching={isTouching} />
            <EffectComposer disableNormalPass>
              <Bloom luminanceThreshold={1} intensity={0.5} />
            </EffectComposer>
          </>
        )}
      </Canvas>

      {/* 3. Main UI Overlay */}
      {hasEntered && (
        <>
          <div className="content-overlay" style={{ opacity: isAiOpen ? 0 : 1, transition: '0.8s' }}>
            <h1 className="main-title">ELITE WEB</h1>
            <div className="btn-group">
               <button className="premium-btn" onClick={handleLaunchAi}>LAUNCH AI AGENT</button>
            </div>
          </div>
          
          {/* 4. AI Chat Panel */}
          <div className={`ai-panel ${isAiOpen ? 'open' : ''}`}>
             <div className="ai-header">
                <span>NEXT WEB SOLUTIONS AI</span>
                <button onClick={() => { rippleSnd.play(); setIsAiOpen(false); }}>×</button>
             </div>
             
             <div className="ai-chat-area">
                {messages.map((m, i) => (
                  <div key={i} className={`ai-msg ${m.role}`}>{m.text}</div>
                ))}
                {isTyping && <div className="ai-msg ai typing">Thinking...</div>}
                <div ref={chatEndRef} />
             </div>

             <div className="ai-input-wrapper">
                <input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                  placeholder="Ask me anything..." 
                  className="ai-input" 
                />
                <button onClick={handleSend} className="send-btn">➔</button>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
const root = createRoot(document.getElementById('app'));
root.render(<App />);