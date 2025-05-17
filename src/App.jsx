import React, { useState } from 'react';
import Navbar from './components/navbar';
import SnowBackground from './components/BackgroundWrapper';
import Skills from './components/Skills';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Education from './components/Education';
import Home from './components/Home';

export default function App() {
  const [flakeCount, setFlakeCount]       = useState(200);
  const [windIntensity, setWindIntensity] = useState(0.5);

  return (
    <div className="min-h-screen">
    <SnowBackground
      flakeCount={flakeCount}
      windIntensity={windIntensity}
      flakeColor="#ffa116"
      backgroundImage="/images/your-dark-bg.png"
    >
      <Navbar />
      <Home />
      <Education />
      <Experience />
      <Skills />
      <Projects />
      <About />
      <Contact />
    </SnowBackground>
    </div>
  );
}
