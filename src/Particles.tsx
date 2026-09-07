import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };

export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const n = window.innerWidth < 700 ? 22 : 42;
    const dots: P[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < n; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.35,
        r: 0.7 + Math.random() * 1.8,
        a: 0.25 + Math.random() * 0.55,
      });
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.shadowBlur = 0;
      for (let i = 0; i < dots.length; i++) {
        const p = dots[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
        if (p.x < 0 || p.x > w) p.vx *= -1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(196,255,80,${p.a})`;
        ctx.shadowColor = "rgba(180,255,40,.75)";
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        for (let j = i + 1; j < dots.length; j++) {
          const q = dots[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(160,255,70,${0.14 * (1 - d / 110)})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="fx-canvas" aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}
