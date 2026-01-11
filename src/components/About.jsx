import React, { useRef, useState, useEffect } from 'react';
import { Mail, Download } from 'lucide-react';

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
      className={`scroll-mt-20 w-full flex items-center justify-center px-4 py-16 transition-all duration-700 ease-out
        ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl rounded-2xl p-6 md:p-10 shadow-2xl border border-white/20 overflow-hidden">
        <div className="flex items-center justify-center">
          <img
            src="https://www.dropbox.com/scl/fi/0alki56r8dj3ikdvpix50/Anshul.jpeg?rlkey=4ptc71fwwvr10ppey498xsfpp&st=sa4ueako&raw=1"
            alt="Anshul Patel"
            className="w-40 h-40 md:w-100 md:h-100 rounded-xl border-2 border-white/30 shadow-lg object-cover transition-all duration-500 hover:scale-105 hover:shadow-xl"
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center space-y-4 text-white">
          <h2 className="text-3xl font-extrabold text-orange-400">About Me</h2>

          <p className="text-base leading-relaxed">
            Hi, I'm <span className="font-semibold text-orange-500">Anshul Patel</span>,
            a Computer Science Engineering student with strong interest in
            <span className="font-semibold text-orange-500"> Software Engineering & Backend Development</span>.
            I'm currently working with <span className="font-semibold text-orange-500">Spring Boot </span>
            and actively learning how scalable systems are architected.
            I aim to evolve into a well-rounded software engineer by understanding
            <span className="font-semibold text-orange-500"> software design principles, system architecture</span>,
            and production-grade backend practices.
          </p>

          <p className="text-base leading-relaxed">
            I explore Generative AI & Machine Learning, enjoy participating in hackathons,
            workshops, and open-source projects to grow step by step as a developer.
            Over time, I have built projects ranging from
            lodge management platforms to AI-powered predictive maintenance & gesture-controlled music systems.
            I believe in writing clean, maintainable code and learning through building.
          </p>

          <div className="text-sm">
            <h3 className="font-semibold text-orange-400 mb-2">Tech Stack:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><span className="font-medium">Languages:</span> Java, Python, JavaScript</li>
              <li><span className="font-medium">Backend/Frameworks:</span> Spring Boot, Node.js, Express.js</li>
              <li><span className="font-medium">Databases:</span> MySQL, MongoDB</li>
              <li><span className="font-medium">Tools:</span> GitHub, Postman</li>
            </ul>
          </div>


          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-2 bg-orange-400 text-black hover:text-white font-medium rounded-lg shadow-md hover:bg-orange-500 transition w-full sm:w-auto"
            >
              Open to Opportunities
            </a>
            <a
              href="https://drive.google.com/file/d/1sK4WczLll0kt7oeOXi3QLC13smkOKNsk/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2 bg-transparent border border-orange-400 text-orange-400 hover:bg-orange-500 hover:text-black font-medium rounded-lg shadow-md transition w-full sm:w-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
