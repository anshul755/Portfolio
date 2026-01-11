import React, { useRef, useState, useEffect } from "react";

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setRevealed(e.isIntersecting),
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, revealed];
}

export default function Experience() {
  const [ref, revealed] = useReveal();

  return (
    <section
      id="experience"
      ref={ref}
      className={`scroll-mt-20 w-full flex justify-center px-6 py-32 transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <div className="w-full max-w-6xl bg-black/30 backdrop-blur-md rounded-2xl p-12 md:p-16 shadow-2xl border border-white/20 text-white">
        <h2 className="text-4xl md:text-5xl font-extrabold text-orange-400 mb-6">
          AI Intern
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-3">
          <span className="font-semibold">Organization:</span> AICTE Internship on AI with TechSaksham (Microsoft & SAP Initiative)
        </p>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          <span className="font-semibold">Duration:</span> December 2024 – January 2025
        </p>

        <ul className="list-disc list-inside space-y-4 mb-8 text-base md:text-lg">
          <li>
            Developed a gesture‐controlled, mood‐based music player using{" "}
            <span className="font-medium">DeepFace</span>,{" "}
            <span className="font-medium">MediaPipe</span>, and{" "}
            <span className="font-medium">OpenCV</span> to detect emotions & &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hand gestures.
          </li>
          <li>
            Built an interactive AI‐powered music recommendation system with{" "}
            <span className="font-medium">Streamlit</span>, playing songs based on mood detection.
          </li>
        </ul>

        <a
          href="https://drive.google.com/file/d/1UbrGqDx9ZFAH8eaWk-eqcC5J9-bF9xcb/view"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-orange-400 text-black font-semibold rounded-2xl shadow-md hover:bg-orange-500 hover:text-white transition text-lg md:text-xl"
        >
          View Certificate
        </a>
      </div>
    </section>
  );
}
