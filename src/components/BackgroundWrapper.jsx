import React, { useRef, useEffect, useState } from 'react';

export default function FireBackground({
  flakeCount      = 150,
  windIntensity   = 1.5,
  flakeColor      = '#ffa116',
  backgroundImage = '/images/bg.png',
  tintColor       = '#000000',
  children
}) {
  const canvasRef = useRef();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    // Handler to update dimensions on resize/orientation change
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let animationId;
    const flakes = [];
    const dpr = window.devicePixelRatio || 1;

    // Preload background
    const bg = new Image();
    bg.src = backgroundImage;
    let bgLoaded = false;
    bg.onload = () => { bgLoaded = true; };

    // Determine dynamic flake count for performance on small screens
    const isMobile = dimensions.width < 768;
    const totalFlakes = isMobile ? Math.floor(flakeCount * 0.5) : flakeCount;

    function init() {
      const W = canvas.width  = dimensions.width  * dpr;
      const H = canvas.height = dimensions.height * dpr;
      ctx.scale(dpr, dpr);
      flakes.length = 0;

      for (let i = 0; i < totalFlakes; i++) {
        flakes.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          r: 1 + Math.random() * 3,
          d: Math.random() * totalFlakes,
        });
      }
    }

    let angle = 0;
    function draw() {
      const W = dimensions.width;
      const H = dimensions.height;

      // Draw background or fallback
      if (bgLoaded) {
        ctx.drawImage(bg, 0, 0, W, H);
      } else {
        ctx.fillStyle = '#050818';
        ctx.fillRect(0, 0, W, H);
      }

      // Tint overlay
      ctx.fillStyle = tintColor;
      ctx.fillRect(0, 0, W, H);

      // Snowflakes
      ctx.fillStyle = flakeColor;
      ctx.beginPath();
      for (let f of flakes) {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      }
      ctx.fill();

      update(W, H);
    }

    function update(W, H) {
      angle += 0.01;
      for (let f of flakes) {
        f.y += Math.cos(angle + f.d) + 1 + f.r / 2;
        f.x += Math.sin(angle) * windIntensity;

        if (f.y > H || f.x > W || f.x < 0) {
          if (Math.random() > 0.66) {
            f.x = Math.random() * W; f.y = -10;
          } else if (Math.sin(angle) > 0) {
            f.x = -5; f.y = Math.random() * H;
          } else {
            f.x = W + 5; f.y = Math.random() * H;
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      draw();
      animationId = requestAnimationFrame(loop);
    }

    init();
    loop();

    return () => cancelAnimationFrame(animationId);
  }, [dimensions, flakeCount, windIntensity, flakeColor, backgroundImage, tintColor]);

  return (
    <div className="relative w-100% h-full overflow-y-hidden">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />
      {children}
    </div>
  );
}
