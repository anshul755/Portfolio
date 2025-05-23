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

export default function Education() {
  const [ref, revealed] = useReveal();

  // images to rotate
  const images = [
    "https://nirmawebsite.s3.ap-south-1.amazonaws.com/wp-content/uploads/2022/04/DSC_1325-scaled.jpg",
    "https://nirmawebsite.s3.ap-south-1.amazonaws.com/wp-content/uploads/sites/22/2022/01/IMG_20200211_181018__02-1.jpg"
  ];
  const [current, setCurrent] = useState(0);

  // rotate every 7 seconds
  useEffect(() => {
    const iv = setInterval(() => setCurrent(i => (i + 1) % images.length), 7000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section
      id="education"
      ref={ref}
      className={`w-full flex justify-center px-4 py-32 transition-all duration-700 ease-out ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="w-full max-w-7xl bg-black/30 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden md:flex transform transition-transform duration-300 hover:scale-105">
        
        {/* Left: rotating images */}
        <div className="relative w-full md:w-1/2 h-96 lg:h-[32rem]">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Semester ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                idx === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Right: text info */}
        <div className="flex-1 p-8 md:p-12 lg:p-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-orange-400 mb-4">
            Computer Science Engineering
          </h2>
          <p className="text-xl text-white mb-6">
            <span className="font-semibold">Institute Of Technology,</span> Nirma University
          </p>
          <div className="flex flex-wrap gap-8 text-base text-gray-300 mb-8">
            <span>
              <span className="font-medium">CGPA:</span> 8.50
            </span>
            <span>
              <span className="font-medium">Since:</span> January 2025
            </span>
            <span>
              <span className="font-medium">Current Semester:</span> 4
            </span>
          </div>
          <p className="text-gray-100 leading-relaxed">
            Currently in my 4th semester of Computer Science Engineering, focusing on AI,
            Machine Learning, and Software Development. I actively participate in hackathons,
            tech workshops, and open-source contributions to grow my skillset.
          </p>
        </div>
      </div>
    </section>
  );
}
