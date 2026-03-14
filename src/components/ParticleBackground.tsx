import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  baseOpacity: number;
  pulse: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 初始化粒子
    const count = 60;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const baseOpacity = Math.random() * 0.3 + 0.05;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 0.5,
        opacity: baseOpacity,
        baseOpacity,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // 缓慢漂移
        p.x += p.vx;
        p.y += p.vy;

        // 呼吸脉冲
        p.pulse += 0.008;
        p.opacity = p.baseOpacity + Math.sin(p.pulse) * 0.1;

        // 边界环绕
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // 绘制发光粒子
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 4
        );
        gradient.addColorStop(0, `rgba(74, 222, 128, ${p.opacity})`);
        gradient.addColorStop(0.4, `rgba(74, 222, 128, ${p.opacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 中心亮点
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 255, 200, ${p.opacity * 1.5})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
