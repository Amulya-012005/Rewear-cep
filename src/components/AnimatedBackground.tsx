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
      'rgba(245, 215, 127, ', // radiant light gold
      'rgba(251, 191, 36, ',  // warm shimmering amber
      'rgba(52, 211, 153, ',  // luminous emerald
      'rgba(110, 231, 183, ', // bright mint spark
      'rgba(254, 240, 138, '  // ethereal light golden vapor
    ];

    // Generate billowing ink plumes with brighter illumination
    const nodeCount = 65;
    const nodes: InkNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const baseX = Math.random() * width;
      nodes.push({
        x: baseX,
        y: height + Math.random() * 200,
        baseX,
        radius: 40 + Math.random() * 95,
        maxRadius: 110 + Math.random() * 140,
        speedY: 0.4 + Math.random() * 0.85,
        speedX: (Math.random() - 0.5) * 0.45,
        opacity: 0.12 + Math.random() * 0.22,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.009 + Math.random() * 0.018,
        swirlRadius: 25 + Math.random() * 60
      });
    }

    // Generate luminous suspended micro-droplets and sparkling golden stars
    const dropletCount = 85;
    const droplets: FloatingDroplet[] = [];
    for (let i = 0; i < dropletCount; i++) {
      droplets.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.0 + Math.random() * 2.8,
        speedY: -(0.25 + Math.random() * 0.65),
        speedX: (Math.random() - 0.5) * 0.35,
        opacity: 0.35 + Math.random() * 0.65,
        pulseSpeed: 0.025 + Math.random() * 0.045,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const render = () => {
      time += 0.012;

      // Deep dark emerald base
      ctx.fillStyle = '#050D09';
      ctx.fillRect(0, 0, width, height);

      // Shinier, brighter golden-emerald radial ambient light
      const bgGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.75, 40,
        width * 0.5, height * 0.75, width * 0.85
      );
      bgGrad.addColorStop(0, 'rgba(212, 175, 55, 0.22)');
      bgGrad.addColorStop(0.35, 'rgba(52, 211, 153, 0.18)');
      bgGrad.addColorStop(0.7, 'rgba(16, 78, 50, 0.12)');
      bgGrad.addColorStop(1, 'rgba(5, 13, 9, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Upper shimmering golden aura
      const topGrad = ctx.createRadialGradient(
        width * 0.7, height * 0.2, 20,
        width * 0.7, height * 0.2, width * 0.5
      );
      topGrad.addColorStop(0, 'rgba(253, 230, 138, 0.15)');
      topGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)');
      topGrad.addColorStop(1, 'rgba(5, 13, 9, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw and update billowing ink plumes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.phase += n.phaseSpeed;
        n.y -= n.speedY;
        n.x = n.baseX + Math.sin(n.phase) * n.swirlRadius;

        // Radius expands as it billows upward
        const currentRadius = n.radius + Math.sin(n.phase * 0.5) * 18;

        // Radial plume gradient simulating volumetric liquid ink with luminous luster
        const grad = ctx.createRadialGradient(
          n.x, n.y, 0,
          n.x, n.y, currentRadius
        );
        grad.addColorStop(0, `${n.color}${n.opacity * 1.8})`);
        grad.addColorStop(0.35, `${n.color}${n.opacity * 1.1})`);
        grad.addColorStop(0.75, `${n.color}${n.opacity * 0.3})`);
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

      // Draw floating luminous micro-droplets & sparkling stars
      for (let j = 0; j < droplets.length; j++) {
        const d = droplets[j];
        d.y += d.speedY;
        d.x += d.speedX + Math.sin(time * 2 + j) * 0.35;
        d.pulsePhase += d.pulseSpeed;

        const currentOpacity = Math.max(0.18, d.opacity + Math.sin(d.pulsePhase) * 0.4);

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        // Alternate between shimmering gold and mint sparkles
        if (j % 2 === 0) {
          ctx.fillStyle = `rgba(253, 230, 138, ${currentOpacity})`;
          ctx.shadowColor = '#FDE68A';
        } else {
          ctx.fillStyle = `rgba(167, 243, 208, ${currentOpacity})`;
          ctx.shadowColor = '#6EE7B7';
        }
        ctx.shadowBlur = 9;
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
