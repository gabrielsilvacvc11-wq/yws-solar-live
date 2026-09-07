import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; life: number; hue: number };

export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let t = 0;
    let raf = 0;
    const mobile = window.innerWidth < 700;
    const n = mobile ? 90 : 160;
    const dots: P[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      life: 0.4 + Math.random() * 0.6,
      hue: 70 + Math.random() * 40,
    });
    for (let i = 0; i < n; i++) dots.push(spawn());

    const field = (x: number, y: number, time: number) => {
      const nx = x * 0.0018;
      const ny = y * 0.0018;
      const a =
        Math.sin(nx * 3.1 + time * 0.22) +
        Math.cos(ny * 2.4 - time * 0.18) +
        Math.sin((nx + ny) * 2.7 + time * 0.12);
      return a * 0.9;
    };

    const tick = () => {
      t += 0.016;
      ctx.fillStyle = "rgba(3,8,10,0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of dots) {
        const ang = field(p.x, p.y, t);
        p.vx += Math.cos(ang) * 0.18;
        p.vy += Math.sin(ang) * 0.18 + 0.01;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.0022;
        if (p.life <= 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          Object.assign(p, spawn());
        }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7);
        g.addColorStop(0, `hsla(${p.hue},100%,65%,${0.28 * p.life})`);
        g.addColorStop(1, "hsla(90,100%,50%,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fx-canvas"
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", mixBlendMode: "screen" }}
    />
  );
}
