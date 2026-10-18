import React, { useEffect, useRef } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Ink Plume Nodes (simulating billowing green fluid ink in water as shown in user video)
    interface InkNode {
      x: number;
      y: number;
      baseX: number;
      radius: number;
      maxRadius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      color: string;
      phase: number;
      phaseSpeed: number;
      swirlRadius: number;
    }

    interface FloatingDroplet {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulseSpeed: number;
      pulsePhase: number;
    }

    const colors = [
      'rgba(52, 211, 153, ', // radiant emerald
      'rgba(16, 185, 129, ', // vivid green
      'rgba(110, 231, 183, ', // mint glow
      'rgba(46, 125, 90, ', // deep emerald
      'rgba(167, 243, 208, ' // ethereal pale vapor
    ];

    // Generate billowing ink nodes
    const nodeCount = 55;
    const nodes: InkNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const baseX = Math.random() * width;
      nodes.push({
        x: baseX,
        y: height + Math.random() * 200,
        baseX,
        radius: 35 + Math.random() * 85,
        maxRadius: 100 + Math.random() * 120,
        speedY: 0.35 + Math.random() * 0.75,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: 0.08 + Math.random() * 0.18,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.008 + Math.random() * 0.015,
        swirlRadius: 20 + Math.random() * 50
      });
    }

    // Generate luminous suspended micro-droplets / dust motes
    const dropletCount = 60;
    const droplets: FloatingDroplet[] = [];
    for (let i = 0; i < dropletCount; i++) {
      droplets.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.8 + Math.random() * 2.2,
        speedY: -(0.2 + Math.random() * 0.5),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: 0.2 + Math.random() * 0.6,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;

      // Dark background with slight trail fade for fluid smoke blending
      ctx.fillStyle = '#060E0A';
      ctx.fillRect(0, 0, width, height);

      // Deep radial base glow
      const bgGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.85, 50,
        width * 0.5, height * 0.85, width * 0.75
      );
      bgGrad.addColorStop(0, 'rgba(16, 185, 129, 0.16)');
      bgGrad.addColorStop(0.5, 'rgba(6, 78, 59, 0.10)');
      bgGrad.addColorStop(1, 'rgba(6, 14, 10, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw and update billowing ink plumes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.phase += n.phaseSpeed;
        n.y -= n.speedY;
        n.x = n.baseX + Math.sin(n.phase) * n.swirlRadius;

        // Radius expands as it billows upward
        const currentRadius = n.radius + Math.sin(n.phase * 0.5) * 15;

        // Radial plume gradient simulating volumetric liquid ink
        const grad = ctx.createRadialGradient(
          n.x, n.y, 0,
          n.x, n.y, currentRadius
        );
        grad.addColorStop(0, `${n.color}${n.opacity * 1.5})`);
        grad.addColorStop(0.4, `${n.color}${n.opacity * 0.8})`);
        grad.addColorStop(0.8, `${n.color}${n.opacity * 0.2})`);
        grad.addColorStop(1, `${n.color}0)`);

        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Recycle node when it billows off top
        if (n.y < -currentRadius) {
          n.y = height + currentRadius + Math.random() * 100;
          n.baseX = Math.random() * width;
          n.x = n.baseX;
        }
      }

      // Draw floating luminous micro-droplets
      for (let j = 0; j < droplets.length; j++) {
        const d = droplets[j];
        d.y += d.speedY;
        d.x += d.speedX + Math.sin(time + j) * 0.2;
        d.pulsePhase += d.pulseSpeed;

        const currentOpacity = Math.max(0.1, d.opacity + Math.sin(d.pulsePhase) * 0.3);

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 243, 208, ${currentOpacity})`;
        ctx.shadowColor = '#34D399';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Recycle droplet
        if (d.y < 0) {
          d.y = height + 10;
          d.x = Math.random() * width;
        }
        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#060E0A]"
    >
      {/* 1. Fluid Emerald Smoke in Water Canvas Simulation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* 2. Soft atmospheric vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060E0A] via-transparent to-[#060E0A]/60 opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060E0A]/40 via-transparent to-[#060E0A]/40" />

      {/* 3. Subtle fine weave texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#34D399 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};
