import React from 'react';
import { motion } from 'framer-motion';

export default function PortfolioSections({ handleLaunchAi }) {
  return (
    <div className="scroll-wrapper">
 
      <section className="portfolio-section intro-section">
  <div className="profile-container">
    <img src="/profile.jpg" alt="Samitha Sudesh" className="profile-avatar" />
  </div>
  <div className="text-container">
    <h1 className="intro-title">
  <span className="samitha-text">SAMITHA</span><br />
  <span className="sudesh-text">SUDESH</span>
</h1>
    <div className="subtitle-container">
  <p className="intro-subtitle">FULL-STACK DEVELOPER</p>
  
</div>
    <button className="ai-neon-btn" onClick={handleLaunchAi}>
      <span className="ai-icon">⚡</span> LAUNCH AI AGENT
    </button>
    <div className="scroll-hint"><span>↓</span> SCROLL TO EXPLORE</div>
  </div>
</section>
      <motion.section 
        className="portfolio-section align-right"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
      >
        <motion.div 
          className="content-card"
          variants={{
            hidden: { opacity: 0, x: "100vw" },
            visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
        >
          <div className="about-block">
            <h2 className="sec-heading">_ABOUT ME</h2>
            <p className="about-text">
              I am a passionate Full-Stack Developer dedicated to architecting scalable digital platforms. By combining robust backend logic with immersive 3D frontend technologies, I create interactive web experiences that stand out.
            </p>
          </div>

          <div className="card-divider"></div>

          <div className="skills-block">
            <h3 className="sub-heading">_TECHNICAL SKILLS</h3>
            <div className="skills-grid">
              {["React", "Next.js", "Three.js", "React Three Fiber", "JavaScript", "PHP", "Laravel", "Bootstrap"].map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

     <motion.section 
    className="portfolio-section align-left"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false, amount: 0.5 }}
  >
    <motion.div 
      className="content-card"
      variants={{
        hidden: { opacity: 0, x: "-100vw" },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
      }}
    >
      <div className="projects-block">
        <h2 className="sec-heading">_FEATURED PROJECTS</h2>
        
        <div className="projects-list">
         
          <div className="project-card">
            <h3 className="proj-title">Elite Web / 3D Portfolio</h3>
            <span className="proj-tech">React Three Fiber / Three.js</span>
            <p className="proj-desc">
              An immersive, highly interactive 3D web experience blending complex WebGL elements with modern frontend architecture to push the boundaries of digital realities.
            </p>
          </div>

          <div className="card-divider"></div>
        
          <div className="project-card">
            <h3 className="proj-title">SGP Construction Management System</h3>
            <span className="proj-tech">Laravel / PHP / Bootstrap</span>
            <p className="proj-desc">
              A robust, scalable ERP solution engineered for the construction sector, featuring complex backend logic for seamless resource tracking and operational efficiency.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.section>

      <motion.section 
        className="portfolio-section footer-sec"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div className="footer-card">
          <h2 className="sec-heading">_INITIATE CONNECTION</h2>
          <p className="footer-text">
            Ready to push the boundaries of the digital realm? <br/> Let's architect your elite-tier web experience today.
          </p>
          
          <div className="social-links">
            <a href="https://wa.me/94756724255" target="_blank" rel="noreferrer" className="social-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a5.47 5.47 0 0 1-2.771-.758l-.199-.117-2.064.542 0.55-2.012-.13-.205a5.47 5.47 0 0 1-.837-2.887c0-3.036 2.47-5.506 5.506-5.506 1.47 0 2.853.573 3.892 1.614a5.45 5.45 0 0 1 1.614 3.892c-.001 3.037-2.471 5.507-5.507 5.507M21.838 2.162C19.33-.346 16.035-1.127 12.69 1.135 7.158 2.448 3.565 7.373 2.768 12.871c-0.126 0.849 0.046 1.714 0.493 2.453l-1.06 3.882 3.992-1.047a5.55 5.55 0 0 0 2.443 0.573c0.85 0.126 1.715-0.046 2.454-0.493 2.508 2.508 5.803 3.289 9.148 1.027 5.532-1.313 9.125-6.238 9.922-11.736 0.126-0.849-0.046-1.714-0.493-2.453"/></svg>
            </a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noreferrer" className="social-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://github.com/samithasudesh859-ops" target="_blank" rel="noreferrer" className="social-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          </div>

          <a href="https://wa.me/94756724255" target="_blank" rel="noreferrer" className="whatsapp-neon-btn">
            GET IN TOUCH VIA WHATSAPP
          </a>
          
          <div className="copyright-text">
            © 2026 SAMITHA SUDESH | CRAFTED FOR THE FUTURE
          </div>
        </div>
      </motion.section>
    </div>
  );
}