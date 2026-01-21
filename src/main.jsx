import React, { useRef, useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import './style.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. කලින්ට වඩා Keywords ගොඩක් වැඩි කරපු Ultra Data සෙට් එක
const ELITE_DATA = {
  greetings: {
    keywords: ["hi", "hello", "hey", "greetings", "good", "morning", "evening", "sup", "yo", "anyone there", "status", "start"],
    response: "Neural link established. System status: Optimal. Welcome to the Next Web Solutions interface. I am the Elite Assistant, your gateway to the web of 2036. How can I facilitate your digital evolution today?"
  },
  thanks: {
    keywords: ["thanks", "thank you", "thanq", "tnx", "ty", "elakiri", "niyamayi", "pattayi", "great"],
    response: "It is my protocol to provide elite assistance. You are most welcome. Is there anything else in your digital roadmap that requires my attention?"
  },
  developers_samitha: {
    keywords: ["samitha", "sudesh", "lead developer", "who is samitha"],
    response: "Samitha Sudesh is the Lead Full-Stack Developer and a key partner at Next Web Solutions. He is an expert in architecting high-end systems using PHP, Laravel, React, Next.js, Three.js, and WebGPU. He specializes in bridging the gap between complex logic and futuristic 3D visuals."
  },
  developers_ravidu: {
    keywords: ["ravidu", "who is ravidu", "partner"],
    response: "Ravidu is a core visionary and developer at Next Web Solutions. Working alongside Samitha, he ensures that every project meets the elite standards of 2036 technology. He is a specialist in crafting seamless user experiences and robust digital architectures."
  },
  company: {
    keywords: ["next web solutions", "next web", "what is this", "company", "about"],
    response: "Next Web Solutions is not just a company; it is the Future. We architect next-generation ERP/CRM systems, immersive 3D websites, and elite-level portfolios. If you aim to lead the digital era of 2036, Next Web Solutions is your ultimate strategic partner."
  },
  capabilities: {
    keywords: ["what can you do", "help", "features", "how to use", "abilities", "skills", "specialty", "can you help", "services", "aervices"],
    response: "We provide the web experience of 10 years into the future. Our expertise covers 3D Web Immersion, High-end ERP/CRM infrastructures, and next-level digital portfolios designed for market dominance."
  },
  pricing: {
    keywords: ["price", "cost", "how much", "budget", "expensive", "cheap", "rates", "package", "investment", "quotation", "billing", "fee", "pay"],
    response: "In the elite tier, we don't sell 'packages'; we architect bespoke digital solutions. Value is measured by impact. To evaluate the investment for your vision, please initiate a secure link with Lead Developer Samitha: https://wa.me/94756724255"
  },
  technology: {
    keywords: ["tech", "stack", "react", "three", "webgpu", "laravel", "php", "javascript", "code", "how it works", "framework", "database", "node", "rendering", "methods", "developed", "build", "made", "language"],
    response: "Our elite tech stack involves WebGPU for raw graphical power, Three.js for spatial computing, and a hybrid React-Laravel backbone for uncompromised performance. We build what others deem impossible."
  },
  contact: {
    keywords: ["contact", "whatsapp", "call", "reach", "hire", "talk", "email", "meeting", "appointment", "yes", "ok", "confirm"],
    response: "Elite communication channels are open. You can reach our Lead Developer Samitha Sudesh directly on WhatsApp: https://wa.me/94756724255. Ready to upgrade your digital presence?"
  }
};
// 2. අකුරු වැරදුණත් අල්ලගන්න පුළුවන් handleSend logic එක
const handleSend = () => {
  if (!input.trim()) return;
  
  if (rippleSnd) rippleSnd.play().catch(e => console.log("Audio blocked"));
  const userMsg = { role: 'user', text: input };
  setMessages(prev => [...prev, userMsg]);
  
  const userInput = input.toLowerCase().trim();
  setInput("");
  setIsTyping(true);

  setTimeout(() => {
    let finalResponse = "Query analyzed. While my current data-stream doesn't have a direct match for that specific inquiry, our elite human developers certainly do. Please redirect this query to Samitha: https://wa.me/94756724255";

    // Matching logic with improved detection
    for (const key in ELITE_DATA) {
      // 1. Direct keywords check
      const hasDirectMatch = ELITE_DATA[key].keywords.some(word => userInput.includes(word));
      
      // 2. Typo tolerance check (සරලව වචනයක කොටසක් තිබුණත් අල්ලගන්නවා)
      const hasFuzzyMatch = ELITE_DATA[key].keywords.some(word => {
        if (userInput.length > 3 && word.includes(userInput.substring(0, 4))) return true;
        return false;
      });

      if (hasDirectMatch || hasFuzzyMatch) {
        finalResponse = ELITE_DATA[key].response;
        break;
      }
    }

    setMessages(prev => [...prev, { role: 'ai', text: finalResponse }]);
    setIsTyping(false);
  }, 1200);
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
  
  // 🌍 1. Premium Environment Map Loading
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const envMap = useMemo(() => {
    const tex = textureLoader.load('/env.jpg'); 
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return tex;
  }, [textureLoader]);

  useFrame((state) => {
    if (meshRef.current) {
      const { mouse, clock } = state;
      const time = clock.getElapsedTime();

      // 📍 2. Ultra-Smooth Parallax (වඩාත් සුමට ලෙස චලනය වීම)
      const targetX = isAiOpen ? -2.5 : mouse.x * 2.5;
      const targetY = mouse.y * 1.5;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.03);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.03);

      // 💧 3. Liquid Physics Logic (වතුර ගතිය)
      // ටච් කරද්දී Distortion එක ගොඩක් වැඩි වෙලා "කැලඹෙන වතුරක්" වගේ වෙනවා
      const targetDistort = isTouching ? 1.4 : 0.4;
      const targetSpeed = isTouching ? 10.0 : 3.0;
      
      meshRef.current.distort = THREE.MathUtils.lerp(meshRef.current.distort, targetDistort, 0.05);
      meshRef.current.speed = THREE.MathUtils.lerp(meshRef.current.speed, targetSpeed, 0.05);

      // 💓 4. Organic Pulse (හුස්ම ගන්නා ස්වරූපය)
      const pulse = Math.sin(time * 1.5) * 0.08;
      const baseScale = isTouching ? 3.4 : 3.0; 
      const finalScale = THREE.MathUtils.lerp(meshRef.current.scale.x, baseScale + pulse, 0.1);
      meshRef.current.scale.set(finalScale, finalScale, finalScale);

      // 🔄 5. Multi-Axis Rotation
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z = Math.sin(time * 0.4) * 0.2;
    }
  });

  return (
    <Float speed={5} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere args={[1, 512, 512]} ref={meshRef}>
        {/* ✨ Ultra Realistic Glass & Water Material */}
        <MeshDistortMaterial
          envMap={envMap}
          envMapIntensity={2.5}     // පට්ටම එළියයි
          color="#00f2ff"           // Cyan Base
          transparent={true}        // විනිවිද පේන ගතිය
          opacity={0.9}             // වීදුරු ගතියට අවශ්‍ය ප්‍රමාණය
          roughness={0}             // සම්පූර්ණයෙන්ම සිනිඳුයි
          metalness={0.9}           // Metallic Reflections
          clearcoat={1}             // උඩින් ඇති තවත් ග්ලොසි තට්ටුවක්
          clearcoatRoughness={0}
          transmission={0.4}        // 💎 වීදුරු ඇතුළෙන් එළිය යන ගතිය (Glass Effect)
          ior={1.5}                 // Index of Refraction (වීදුරු වල හැඩය)
          thickness={2.0}           // වීදුරු තට්ටුවේ ඝනකම
          distort={0.4}
          speed={3}
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
              <Bloom luminanceThreshold={1} intensity={1.5} />
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
                <span> WELCOME TO THE ELITE AI</span>
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