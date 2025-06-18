import React, { useRef, useEffect, useState } from "react";
import { ChevronDown, Send } from "lucide-react";

// Scroll-reveal hook
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setRevealed(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, revealed];
}

// Typing effect hook
function useTypedWords(words, speed = 100, pause = 1200) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const word = words[index];
    const timeout = setTimeout(() => {
      setTyped((prev) => {
        if (!deleting) {
          const next = word.slice(0, prev.length + 1);
          if (next === word) setTimeout(() => setDeleting(true), pause);
          return next;
        } else {
          const next = prev.slice(0, -1);
          if (next === '') {
            setDeleting(false);
            setIndex((index + 1) % words.length);
          }
          return next;
        }
      });
    }, deleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [typed, deleting]);

  useEffect(() => {
    const blink = setInterval(() => setCursor(c => !c), 500);
    return () => clearInterval(blink);
  }, []);

  return typed + (cursor ? "|" : " ");
}

export default function Home() {
  const [ref, revealed] = useReveal();
  const typed = useTypedWords([
    "Full Stack Developer  ",
    "AI/ML Enthusiast  ",
    "Tech Explorer  "
  ]);

  const images = ["https://images.unsplash.com/photo-1672676434074-20ff3b80a9c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1605903211242-9821559b5b10?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000); // 7 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center px-4 text-white text-center transition-all duration-700 ease-out overflow-hidden ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        backgroundImage: `url(${images[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1s ease-in-out"
      }}
    >
      {/* Optional Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Intro Text */}
      <div className="max-w-5xl mx-auto z-10 relative">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-snug">
          Hi, I’m <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Anshul Patel</span>
        </h1>
        <h2 className="text-xl md:text-3xl font-medium mb-4 text-gray-300">
          I’m a <span className="text-orange-300 font-semibold">{typed}</span>
        </h2>
        <p className="text-md md:text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          Crafting immersive digital experiences and AI-powered tools. Driven by curiosity, built on code. Let’s build the future—together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="#project"
            className="px-8 py-3 bg-orange-400 text-black font-semibold rounded-xl shadow-lg hover:bg-orange-500 hover:text-white transition"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 px-8 py-3 border border-orange-400 text-orange-400 hover:text-white hover:bg-orange-500 hover:text-black font-semibold rounded-xl transition"
          >
            <Send className="w-5 h-5" />
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll Down Icon */}
      <div className="absolute bottom-10 animate-bounce text-orange-400 z-10">
        <a
          href={"#education"}
          className="text-orange text-lg font-medium hover:text-white transition-colors"
        >
          <ChevronDown className="w-8 h-8" />
        </a>
      </div>
    </section>
  );
}
