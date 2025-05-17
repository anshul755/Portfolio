import React, { useRef, useState, useEffect } from 'react';
import { Mail, Download } from 'lucide-react';

// Custom hook for scroll-reveal
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

export default function About() {
  const [ref, revealed] = useReveal();

  return (
    <section
      id="about"
      ref={ref}
      className={`w-full flex items-center justify-center px-4 py-16 transition-all duration-700 ease-out
        ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl rounded-2xl p-6 md:p-10 shadow-2xl border border-white/20 overflow-hidden">
        {/* Profile Image Section */}
        <div className="flex items-center justify-center">
          <img
            src="https://www.dropbox.com/scl/fi/yrwnevv4u9kmr4mrrdc7w/A22.jpg?rlkey=w68wd6fl0qvr019tc7n6i0qjl&st=btpnti5w&raw=1"
            alt="Anshul Patel"
            className="w-40 h-40 md:w-100 md:h-100 rounded-xl border-2 border-white/30 shadow-lg object-cover transition-all duration-500 hover:scale-105 hover:shadow-xl"
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center space-y-4 text-white">
          <h2 className="text-3xl font-extrabold text-orange-400">About Me</h2>
          <p className="text-base leading-relaxed">
            Hi, I&apos;m <span className="font-semibold text-orange-500">Anshul Patel</span>, a passionate Full Stack Developer
            and AI/ML enthusiast. I love building scalable web applications and experimenting
            with machine learning models to solve real-world problems.
          </p>
          <p className="text-base leading-relaxed">
            Over the years, I&apos;ve worked on diverse projects—from blockchain-powered
            browser extensions to AI-driven music systems. I thrive in collaborative environments,
            enjoy learning new technologies, and believe in writing clean, maintainable code.
          </p>
          <div className="text-sm">
            <h3 className="font-semibold text-orange-400 mb-2">Tech Stack:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><span className="font-medium">Languages:</span> JavaScript, Python, Java</li>
              <li><span className="font-medium">Frameworks:</span> React, Flask, Node.js</li>
              <li><span className="font-medium">AI/ML:</span> TensorFlow, PyTorch, OpenCV, MediaPipe</li>
              <li><span className="font-medium">Tools:</span> GitHub</li>
            </ul>
          </div>

          {/* Buttons: Contact & Resume */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-2 bg-orange-400 text-black hover:text-white font-medium rounded-lg shadow-md hover:bg-orange-500 transition w-full sm:w-auto"
            >
              Open to Opportunities
            </a>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center justify-center px-6 py-2 bg-transparent border border-orange-400 text-orange-400 hover:bg-orange-500 hover:text-black font-medium rounded-lg shadow-md transition w-full sm:w-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
