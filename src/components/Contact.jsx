import React, { useRef, useState, useEffect } from "react";
import { Mail, Github, Linkedin } from "lucide-react";
import emailjs from "@emailjs/browser";
import { motion, useInView } from "framer-motion";

export default function Contact() {
  const formRef = useRef();
  const containerRef = useRef();
  const isInView = useInView(containerRef, { once: true });
  const [animateNow, setAnimateNow] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_6ax33ic",
        "template_9g06ool",
        formRef.current,
        "GqLB8WAU1t-pTWmrK"
      )
      .then(
        () => {
          setPopupMessage("Message sent successfully!");
          setShowPopup(true);
          formRef.current.reset();
        },
        () => {
          setPopupMessage("Failed to send message. Please try again.");
          setShowPopup(true);
        }
      );
  };

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

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const [ref, revealed] = useReveal();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {showPopup && (
        <div
          className={`fixed bottom-5 left-5 flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg 
            transform transition-opacity transition-transform duration-500 ease-in-out
            ${showPopup ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        >
          <span>{popupMessage}</span>
        </div>
      )}

      <section
        id="contact"
        ref={ref}
        className={`scroll-mt-20 w-full flex items-center justify-center px-4 py-16 transition-all duration-700 ease-out ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView || animateNow ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 bg-black/30 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-2xl border border-white/20 text-white"
        >
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-orange-400 mb-4">
              Let's Connect
            </h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="from_name"
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="reply_to"
                  type="email"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-orange-400 text-black hover:text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-orange-400 mb-3">
                Find me on
              </h3>
              <div className="flex gap-6 flex-wrap">
                <a
                  href="https://github.com/anshul755"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-gray-300 transition"
                >
                  <Github className="w-5 h-5" /> GitHub
                </a>
                <a
                  href="https://linkedin.com/in/anshul-patel-2b7241313"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-blue-400 transition"
                >
                  <Linkedin className="w-5 h-5" /> LinkedIn
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-orange-400 mb-3">
                Competitive Platforms
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://leetcode.com/anshul755"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-yellow-400 transition"
                >
                  <img
                    src="https://cdn.iconscout.com/icon/free/png-256/free-leetcode-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-4-pack-logos-icons-2944960.png"
                    alt="LeetCode"
                    className="w-5 h-5"
                  />
                  LeetCode
                </a>
                <a
                  href="https://codeforces.com/profile/anshul755"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-blue-400 transition"
                >
                  <img
                    src="https://cdn.iconscout.com/icon/free/png-256/free-code-forces-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-2-pack-logos-icons-2944796.png?f=webp&w=256"
                    alt="Codeforces"
                    className="w-5 h-5"
                  />
                  Codeforces
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" />
              <span>anshulpatel2023@gmail.com</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
