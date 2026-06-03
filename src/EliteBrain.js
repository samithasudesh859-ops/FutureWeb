class EliteBrain {
  constructor() {
    this.name = "Samitha Sudesh Digital Twin";
    this.info = {
      bio: "Samitha Sudesh, Full-Stack Developer, 21, based in Kandy, Sri Lanka.",
      skills: "ERP/CRM systems, 3D animated web, Laravel, PHP, React, Next.js, Three.js, WebGPU.",
      projects: "Elite Web (3D) and SGP Construction Management System (ERP).",
      contact: {
        whatsapp: "https://wa.me/94756724255",
        emails: ["samithasudesh75@gmail.com", "Samithasudesh011@gmail.com"]
      }
    };
  }

  generateResponse(input) {
    const text = input.toLowerCase();

    
    const categories = [
      {
        id: 'contact',
        keywords: ['contact', 'hire', 'talk', 'whatsapp', 'email', 'mail', 'reach', 'number'],
        response: `Elite communication channels are open. WhatsApp: ${this.info.contact.whatsapp}. For formal inquiries: ${this.info.contact.emails.join(" or ")}. How can I facilitate your vision?`
      },
      {
        id: 'about',
        keywords: ['who', 'about', 'samitha', 'you', 'developer', 'yourself'],
        response: `I am the digital twin of ${this.info.bio}. My core focus is architecting the future through complex backend logic and immersive 3D experiences.`
      },
      {
        id: 'skills',
        keywords: ['skill', 'tech', 'stack', 'language', 'work with', 'expertise'],
        response: `My architectural stack is precision-engineered: ${this.info.skills}. I specialize in high-performance, future-ready digital ecosystems.`
      },
      {
        id: 'projects',
        keywords: ['project', 'portfolio', 'built', 'sgp', 'elite web', 'construction'],
        response: `My primary architectures include: ${this.info.projects}. Every project is a bespoke masterpiece designed for future-ready performance.`
      },
      {
        id: 'greeting',
        keywords: ['hi', 'hello', 'hey', 'greetings'],
        response: "Greetings. The digital twin of Samitha Sudesh is active and online. How can I facilitate your vision today?"
      },
      {
        id: 'gratitude',
        keywords: ['thank', 'thanks', 'ok', 'great'],
        response: "You are most welcome. Maintaining elite performance is my core objective. Anything else you'd like to explore in my ecosystem?"
      }
    ];

  
    let bestMatch = null;
    let highestScore = 0;

    categories.forEach(cat => {
      let score = 0;
      cat.keywords.forEach(word => {
        if (text.includes(word)) score++;
      });
      if (score > highestScore) {
        highestScore = score;
        bestMatch = cat;
      }
    });

  
    return bestMatch ? bestMatch.response : "Query processed. My intelligence is optimized for high-end web architecture. If you're looking for something specific, please reach out via WhatsApp.";
  }
}

export const brain = new EliteBrain();