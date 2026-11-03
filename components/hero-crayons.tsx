'use client';

import { useEffect, useId, useRef } from 'react';
import styles from './hero-crayons.module.css';

const crayons = [
  { color: '#78b34d', position: styles.leftTop, delay: 100, duration: 3600 },
  { color: '#c6af52', position: styles.leftBottom, delay: 650, duration: 3400 },
  { color: '#4eab89', position: styles.right, delay: 350, duration: 4200 },
];

// Every control point stays inside its SVG rail, away from the hero content.
function randomPath() {
  const between = (a: number, b: number) => a + Math.random() * (b - a);
  const x = () => between(38, 119).toFixed(1);
  return `M ${x()} 75 C ${x()} 38, ${x()} 55, ${x()} 100
    S ${x()} 133, ${x()} 150 S ${x()} 194, ${x()} 211`;
}

export function HeroCrayons() {
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const tips = useRef<(SVGGElement | null)[]>([]);
  const textureId = useId().replaceAll(':', '');

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;

    const tracks = crayons.map((crayon, index) => {
      const path = paths.current[index];
      const tip = tips.current[index];
      if (!path || !tip) return null;
      path.setAttribute('d', randomPath());
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length}`;
      return { ...crayon, path, tip, length };
    });
    let frame = 0;
    const start = performance.now();
    const stop = () => cancelAnimationFrame(frame);
    const draw = (now: number) => {
      if (motion.matches) return;
      let active = false;
      for (const track of tracks) {
        if (!track) continue;
        const elapsed = now - start - track.delay;
        if (elapsed < 0) { active = true; continue; }
        const progress = Math.min(elapsed / track.duration, 1);
        const distance = progress * track.length;
        const point = track.path.getPointAtLength(distance);
        // The crayon's local origin is its wax tip, exactly on the drawn line.
        const tilt = -24 + Math.sin(progress * Math.PI * 3) * 9;
        track.tip.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${tilt})`);
        track.path.style.strokeDashoffset = `${track.length - distance}`;
        track.path.style.opacity = '0.7';
        // Lift the crayon away at the end; leave its finished wax mark visible.
        track.tip.style.opacity = `${Math.min(elapsed / 180, 1) * Math.min((1 - progress) * 12, 1)}`;
        if (progress < 1) active = true;
      }
      if (active) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    motion.addEventListener('change', stop);
    return () => {
      stop();
      motion.removeEventListener('change', stop);
    };
  }, []);

  return (
    <div className={styles.artwork} aria-hidden="true">
      {crayons.map((crayon, index) => (
        <svg key={crayon.position} viewBox="0 0 160 240" className={`${styles.track} ${crayon.position}`} fill="none">
          <defs>
            <filter id={`${textureId}-${index}`} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed={index + 1} result="grain" />
              <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <path ref={(node) => { paths.current[index] = node; }} stroke={crayon.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${textureId}-${index})`} className={styles.line} />
          <g ref={(node) => { tips.current[index] = node; }} className={styles.crayon}>
            <path d="M0 0 L-6 -17 L6 -17 Z" fill={crayon.color} />
            <path d="M0 0 L0 -17 L6 -17 Z" fill="#000" opacity="0.12" />
            <rect x="-6" y="-68" width="12" height="52" rx="2" fill={crayon.color} />
            <rect x="-6.5" y="-59" width="13" height="34" rx="1" fill="#f3eedb" />
            <path d="M-6.5 -55 H6.5 M-6.5 -29 H6.5" stroke={crayon.color} strokeWidth="2" />
            <path d="M-2 -47 L0 -50 L2 -47 L0 -38 Z" fill={crayon.color} />
            <path d="M-3 -66 V-61" stroke="#fff" strokeOpacity="0.4" strokeLinecap="round" strokeWidth="2" />
          </g>
        </svg>
      ))}
    </div>
  );
}
