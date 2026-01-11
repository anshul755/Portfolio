import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

export default function Skills() {
  const skills = [
    { name: 'Java', icon: 'fab fa-java', color: 'text-red-600' },
    { name: 'Python', icon: 'fab fa-python', color: 'text-blue-500' },
    { name: 'JavaScript', icon: 'fab fa-js', color: 'text-yellow-400' },
    { name: 'HTML', icon: 'fab fa-html5', color: 'text-orange-600' },
    { name: 'CSS', icon: 'fab fa-css3-alt', color: 'text-blue-500' },
    { name: 'Node.js', icon: 'fab fa-node-js', color: 'text-green-500' },
    { name: 'Express.js', icon: 'fas fa-server', color: 'text-gray-300' },
    { name: 'Flask', icon: 'fas fa-flask', color: 'text-teal-400' },
    { name: 'React', icon: 'fab fa-react', color: 'text-cyan-400' },
    { name: 'MySQL', icon: 'fas fa-database', color: 'text-blue-600' },
    { name: 'MongoDB', icon: 'fas fa-leaf', color: 'text-green-600' },
    { name: 'OOP', icon: 'fas fa-cubes', color: 'text-indigo-400' },
    { name: 'DSA', icon: 'fas fa-sitemap', color: 'text-teal-400' },
    { name: 'Git', icon: 'fab fa-git-alt', color: 'text-orange-600' },
    { name: 'GitHub', icon: 'fab fa-github', color: 'text-gray-100' },
    { name: 'OpenCV', icon: 'fas fa-camera-retro', color: 'text-indigo-300' },
    { name: 'MediaPipe', icon: 'fas fa-hand-paper', color: 'text-pink-400' },
    { name: 'TF-Keras', icon: 'fas fa-brain', color: 'text-red-400' },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="skills" className="scroll-mt-20 min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl bg-white/5 dark:bg-gray-900/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10"
      >

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {skills.map((skill) => {
            const controls = useAnimation();
            const ref = useRef(null);
            const inView = useInView(ref, { margin: '-50px' });

            useEffect(() => {
              controls.start(inView ? 'visible' : 'hidden');
            }, [controls, inView]);

            return (
              <motion.div
                key={skill.name}
                ref={ref}
                variants={itemVariants}
                initial="hidden"
                animate={controls}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center justify-center bg-white/10 dark:bg-gray-800/30 text-white p-6 rounded-2xl shadow-md cursor-pointer transition-shadow duration-300 hover:shadow-xl"
              >
                <i className={`${skill.icon} ${skill.color} text-4xl mb-2 transition-transform duration-300 group-hover:scale-110`} />
                <span className="font-semibold transition-colors duration-300 group-hover:text-orange-400">
                  {skill.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
