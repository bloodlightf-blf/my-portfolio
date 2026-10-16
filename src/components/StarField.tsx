// 星空粒子背景：Canvas 绘制，随窗口自适应，移动端自动降低粒子数量以提升性能。
import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  twinkle: number; // 闪烁速度与方向
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let raf = 0;

    const isMobile = () => window.innerWidth < 768;

    const initStars = () => {
      // 移动端降低粒子数量
      const count = isMobile() ? 60 : 160;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * 0.02 + 0.005,
      }));
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    // 桌面端绘制粒子连线，形成星座效果
    const drawLines = () => {
      const maxDist = 120;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity.toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        // 缓慢漂移
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // 亮度闪烁
        star.alpha += star.twinkle;
        if (star.alpha > 1 || star.alpha < 0.15) star.twinkle *= -1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 240, ${star.alpha.toFixed(3)})`;
        ctx.fill();
      }

      if (!isMobile()) drawLines();

      raf = requestAnimationFrame(render);
    };

    resize();
    render();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
