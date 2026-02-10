"use client"

import React, { useRef, useEffect } from "react";

const CANVAS_HEIGHT_RATIO = 0.6; // 60% de la altura del contenedor

export default function FireEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<any[]>([]);
  const paletteBase = [
    { r: 255, g: 255, b: 180 }, // Amarillo claro
    { r: 255, g: 200, b: 40 },  // Amarillo fuerte
    { r: 255, g: 120, b: 0 },   // Naranja brillante
    { r: 255, g: 62, b: 0 },    // Rojo-naranja
    { r: 255, g: 255, b: 255 }  // Blanco para brillos
  ];
  const paletteRef = useRef([...paletteBase]);
  const timeRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = Math.floor(parent.clientHeight * CANVAS_HEIGHT_RATIO);
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let running = true;

    function createParticles() {
      if (!canvas) return;
      if (!canvas || canvas.width === 0 || canvas.height === 0) return;
      const particleCount = Math.max(Math.floor((canvas.width * canvas.height) / 3000), 15);
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 40,
          size: 5 + Math.random() * 18,
          opacity: 0.2 + Math.random() * 0.5,
          speedX: (Math.random() - 0.5) * 1.2,
          speedY: -1.2 - Math.random() * 2.5,
          colorIndex: Math.floor(Math.random() * paletteRef.current.length),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          sway: 0.3 + Math.random() * 0.5,
          swaySpeed: 0.005 + Math.random() * 0.01,
          swayOffset: Math.random() * Math.PI * 2,
          lifespan: 80 + Math.random() * 120
        });
      }
    }

    function updatePalette() {
      paletteRef.current = paletteBase.map((color, index) => {
        const t = timeRef.current + index * 0.5;
        const variation = 20;
        return {
          r: Math.min(255, Math.max(0, color.r + Math.sin(t) * variation)),
          g: Math.min(255, Math.max(0, color.g + Math.sin(t + 1) * variation)),
          b: Math.min(255, Math.max(0, color.b + Math.sin(t + 2) * variation))
        };
      });
    }

    function drawBrushstroke(x: number, y: number, size: number, rotation: number, color: any, opacity: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      // Glow effect
      ctx.shadowColor = `rgba(${color.r},${color.g},${color.b},${Math.max(opacity, 0.5)})`;
      ctx.shadowBlur = size * 1.2;
      const gradient = ctx.createLinearGradient(0, -size, 0, size);
      gradient.addColorStop(0, `rgba(${color.r},${color.g},${color.b},0)`);
      gradient.addColorStop(0.5, `rgba(${color.r},${color.g},${color.b},${opacity})`);
      gradient.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(-size / 3, -size);
      ctx.quadraticCurveTo(size / 2, 0, -size / 3, size);
      ctx.quadraticCurveTo(size / 2, 0, size / 3, -size / 2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0; // Remove glow for next shapes
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${opacity * 0.7})`;
      ctx.beginPath();
      ctx.ellipse(size / 6, 0, size / 4, size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function updateParticles(deltaTime: number) {
      if (!canvas) return;
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.speedX + Math.sin(timeRef.current * p.swaySpeed + p.swayOffset) * p.sway;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.lifespan -= 1;
        const lifeFactor = p.lifespan / 200;
        const currentSize = p.size * lifeFactor;
        const currentOpacity = p.opacity * lifeFactor;
        if (p.lifespan > 0 && p.y > 0) {
          drawBrushstroke(
            p.x,
            p.y,
            currentSize,
            p.rotation,
            paletteRef.current[p.colorIndex],
            currentOpacity
          );
        }
        if (p.lifespan <= 0 || p.y < -40) {
          particlesRef.current[i] = {
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 30,
            size: 5 + Math.random() * 18,
            opacity: 0.2 + Math.random() * 0.5,
            speedX: (Math.random() - 0.5) * 1.2,
            speedY: -1.2 - Math.random() * 2.5,
            colorIndex: Math.floor(Math.random() * paletteRef.current.length),
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            sway: 0.3 + Math.random() * 0.5,
            swaySpeed: 0.005 + Math.random() * 0.01,
            swayOffset: Math.random() * Math.PI * 2,
            lifespan: 80 + Math.random() * 120
          };
        }
      }
    }

    function animate(currentTime = 0) {
      if (!running) return;
      if (!canvas || !ctx) return;
      const deltaTime = currentTime - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = currentTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.01;
      updatePalette();
      updateParticles(deltaTime);
      if (particlesRef.current.length < 60) {
        createParticles();
      }
      animationRef.current = requestAnimationFrame(animate);
    }

    // Inicializar
    particlesRef.current = [];
    createParticles();
    animate();

    return () => {
      running = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // El canvas debe ser pointer-events none y ocupar el fondo inferior
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        height: `${CANVAS_HEIGHT_RATIO * 100}%`,
        pointerEvents: "none",
        zIndex: 0,
        display: "block"
      }}
    />
  );
} 