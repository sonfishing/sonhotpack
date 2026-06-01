import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export default function MouseFlameEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Spawns a particle with randomized flame characteristics
    const createParticle = (x: number, y: number, isBurst = false) => {
      const angle = isBurst ? Math.random() * Math.PI * 2 : (Math.random() * Math.PI * 2);
      // For normal move, drift upward. For burst, shoot radial.
      const speed = isBurst ? Math.random() * 5 + 2 : Math.random() * 1.5 + 0.2;
      const vx = isBurst ? Math.cos(angle) * speed : Math.cos(angle) * 0.6;
      const vy = isBurst ? Math.sin(angle) * speed : -Math.random() * 1.8 - 0.5; // Upward drift
      const size = isBurst ? Math.random() * 6 + 4 : Math.random() * 5 + 3;
      const decay = isBurst ? Math.random() * 0.02 + 0.015 : Math.random() * 0.025 + 0.015;
      
      // Flame color spectrum (Orange, Red-Orange, Gold)
      const colors = [
        "rgba(255, 77, 0, ",   // Brand signature orange
        "rgba(255, 140, 0, ",  // Darkorange
        "rgba(255, 200, 0, ",  // Gold
        "rgba(220, 20, 60, "   // Crimson
      ];
      const baseColor = colors[Math.floor(Math.random() * colors.length)];

      return {
        x,
        y,
        vx,
        vy,
        size,
        alpha: 1,
        decay,
        color: baseColor,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      // Spawn flame particles on mouse move
      for (let i = 0; i < 2; i++) {
        particles.push(createParticle(e.clientX, e.clientY, false));
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      // Spawn burst of flame particles on click
      const burstCount = 25;
      for (let i = 0; i < burstCount; i++) {
        particles.push(createParticle(e.clientX, e.clientY, true));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spark/Flame drawing
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.size *= 0.97; // Gradually shrink

        if (p.alpha <= 0 || p.size <= 0.5) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        // Fire gradient glow filter
        ctx.globalCompositeOperation = "screen";
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        
        // Soft outer shadow for hot particles
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = "rgba(255, 77, 0, 0.6)";
        
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
