import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import { Github, Globe } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      name: "NeuralAgri",
      logo: "https://www.dropbox.com/scl/fi/xlgyo976tdn8ion9gn21y/NA.png?rlkey=crwk9x8ud0fh2shvm1le7otmn&st=s6adz4uu&raw=1",
      domain: "Full Stack + AI/ML + Android Development",
      date: "March 2025",
      summary: "AI-Powered Agricultural Advisory System",
      description:
        "Built a cross-platform farming assistant integrating ML models for crop yield prediction, disease detection, and personalized crop recommendations. Used React, Flask, TensorFlow, PyTorch, and Google Earth Engine to provide real-time insights, satellite-based soil moisture, and a Hindi-supported chatbot for small and marginal farmers.",
      links: { code: "https://github.com/anshul755/NeuralAgri" },
    },
    {
      name: "SecurePay",
      logo: "https://www.dropbox.com/scl/fi/920y4m32v7kymjkg5oy2e/SP.png?rlkey=x3wvmc6qjo6hac5uy8ckkbl2w&st=2dl9og29&raw=1",
      domain: "Full Stack",
      date: "May 2025",
      summary: "Browser Extension for Seamless Blockchain Connectivity",
      description:
        "Developed a cross-browser extension enabling React apps to connect seamlessly with Ethereum and Solana wallets. Implemented secure key management, multi-network support, and standardized APIs for effortless transaction signing. Built using React (Vite), Chrome Extension APIs, ethers.js, and solana/web3.js, focusing on minimal configuration and strong security practices.",
      links: { code: "https://github.com/anshul755/SecurePay" },
    },
    {
      name: "SmartMusic",
      logo: "https://www.dropbox.com/scl/fi/ag75ojz4aep6jtsqux3lf/SM.png?rlkey=830u06j78rs6scd4tstjxe0rn&st=o3lb3f58&raw=1",
      domain: "Python AI-ML",
      date: "January 2025",
      summary: "Mood and Gesture Activated Smart Music System",
      description:
        "Developed an AI-powered music player that detects facial emotions and hand gestures to control playback using DeepFace, MediaPipe, and OpenCV. Integrated Streamlit for a user-friendly interface, allowing real-time webcam-based interaction. The system identifies moods like happiness, sadness, and anger, playing corresponding songs while enabling gesture-based playback control.",
      links: { code: "https://github.com/anshul755/Mood-and-Gesture-Activated-Smart-Music-System" },
    },
    {
      name: "Skill Swap Platform",
      logo: "https://www.dropbox.com/scl/fi/iaomids6s9q1fcfiwaicj/9353c3c0-6f35-4b0b-a8ac-a13f02c77715.png?rlkey=6c92rm2n4l87pmw9ogx2vs41t&st=kh00f0on&raw=1",
      domain: "Full Stack (MERN)",
      date: "June 2025",
      summary: "Peer-to-Peer Skill Exchange Platform",
      description:
        "Developed a full-stack web platform for peer-to-peer skill exchange, featuring user authentication, user connection functionality, interactive dashboards, and responsive UI. Built with React, Node.js, Express, MongoDB.",
      links: { code: "https://github.com/anshul755/Skill-Swap-Platform" },
    },
    {
      name: "LuxeLodge",
      logo: "https://www.dropbox.com/scl/fi/7lolkikgfu3o6scu8dzll/LuxeLodge.png?rlkey=uiyzn3dafsv0a9wkv2lmcmddv&st=4sw02m7f&raw=1",
      domain: "Full Stack (Node.js, Express, MongoDB, EJS)",
      date: "April 2025",
      summary: "Modern Lodge Management System",
      description:
        "Built a modern, full-stack lodge management system with secure user authentication, dynamic room listings, image uploads via Cloudinary, and a booking management dashboard. Server-rendered with EJS for smooth, SEO-friendly pages and Bootstrap for responsive design.",
      links: {
        code: "https://github.com/anshul755/LuxeLodge",
        live: "https://luxelodge.onrender.com/"
      },
    },
    {
      name: "Library System",
      logo: "https://www.dropbox.com/scl/fi/52aqhx5s4nwbaozhmw743/LS.png?rlkey=hu8aoepf58tldfv5dwji066pn&st=otbtiaa4&raw=1",
      domain: "Java",
      date: "October 2024",
      summary: "Java-Based Library Management System",
      description:
        "A simple Java-based Library Management System that uses a Binary Search Tree (BST) to store, search, and manage books. Each book is represented by its ISBN, title, author, and published year. The system allows users to add, search, delete, and display books in an ordered format.",
      links: { code: "https://github.com/anshul755/LibrarySystem" },
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const controls = useAnimation();

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleMouseMove = (e, index) => {
    if (hoveredCard !== index) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05,1.05,1.05)`;
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)";
    setHoveredCard(null);
  };

  return (
    <section id="project" className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <h2 className="sr-only">Projects</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj, idx) => {
          const ref = useRef(null);
          const inView = useInView(ref, { margin: "-100px" });

          useEffect(() => {
            controls.start(inView ? "visible" : "hidden");
          }, [controls, inView]);

          return (
            <motion.div
              key={proj.name}
              ref={ref}
              variants={cardVariants}
              initial="hidden"
              animate={controls}
              className="relative"
            >
              <div
                className="group relative bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg overflow-hidden transition-all duration-500"
                style={{ perspective: "1000px", transformStyle: "preserve-3d", transition: "transform 0.3s ease-out" }}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
                <div className="p-6 flex flex-col items-center text-center z-10 relative">
                  <div className="relative mb-4 transition-transform duration-500 group-hover:scale-110">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
                    <img src={proj.logo} alt={proj.name} className="h-16 w-16 object-contain relative z-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 transition-transform duration-500 group-hover:scale-105">{proj.name}</h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-6">{proj.domain}</p>
                  <div className="flex space-x-4">
                    <AnimatedButton href={proj.links.code} external icon={<Github className="w-4 h-4 mr-1" />} text="Code" color="orange" />
                    {proj.links.live && <AnimatedButton href={proj.links.live} external icon={<Globe className="w-4 h-4 mr-1" />} text="Live" color="orange" />}
                    <AnimatedButton onClick={() => setOpenIndex(idx)} text="Details" color="orange" />
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ perspective: "1000px" }}
                  >
                    <div className="absolute inset-0 bg-black/80" onClick={() => setOpenIndex(null)} />
                    <motion.div className="relative bg-black-700 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto z-10">
                      <button onClick={() => setOpenIndex(null)} className="absolute top-4 right-4 text-white text-2xl hover:text-orange-400">×</button>
                      <div className="flex items-center mb-4">
                        <img src={proj.logo} alt={proj.name} className="h-12 w-12 mr-4 object-contain" />
                        <div>
                          <h3 className="text-2xl font-bold text-orange-400">{proj.name}</h3>
                          <p className="text-sm text-gray-200">{proj.domain} • {proj.date}</p>
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-3">{proj.summary}</h4>
                      <p className="text-base text-gray-300 mb-6 whitespace-pre-line">{proj.description}</p>
                      <div className="flex space-x-4">
                        <a href={proj.links.code} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 border border-orange-400 text-white hover:bg-orange-400 hover:text-black rounded-2xl">
                          <Github className="w-5 h-5 mr-2" /> View Code
                        </a>
                        {proj.links.live && (
                          <a href={proj.links.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 border border-orange-400 text-white hover:bg-white hover:text-black rounded-2xl">
                            <Globe className="w-5 h-5 mr-2" /> Live Site
                          </a>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function AnimatedButton({ onClick, href, text, color = "orange", icon, external = false, size = "normal" }) {
  const buttonRef = useRef(null);
  const handleMouseEnter = () => {
    const overlay = buttonRef.current?.querySelector(".button-overlay");
    overlay && (overlay.style.transform = "translateX(0)");
  };
  const handleMouseLeave = () => {
    const overlay = buttonRef.current?.querySelector(".button-overlay");
    overlay && (overlay.style.transform = "translateX(-100%)");
  };
  const base = "relative overflow-hidden rounded-md font-medium transition-all duration-300 flex items-center justify-center";
  const sz = size === "large" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm";
  const colors = {
    orange: "border border-orange-400 text-white hover:text-black hover:bg-orange-400",
    white: "border border-white text-white hover:bg-white hover:text-black"
  };
  const overlayCol = { orange: "bg-orange-400", white: "bg-white" };
  const Content = () => (
    <>
      <div
        className={`button-overlay absolute inset-0 ${overlayCol[color]} transform -translate-x-full transition-transform duration-500`}
      />
      <span className="relative z-10 flex items-center">{icon}{text}</span>
    </>
  );
  if (href) {
    return (
      <a
        ref={buttonRef}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={`${base} ${sz} ${colors[color]}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Content />
      </a>
    );
  }
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`${base} ${sz} ${colors[color]}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Content />
    </button>
  );
}
