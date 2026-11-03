'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useId, useLayoutEffect, useRef } from 'react';

type Stroke = { d: string; color: string; width?: number };
type Illustration = { name: string; position: string; delay: number; strokes: Stroke[] };
const blue = '#219cc5', purple = '#aa70d3', pink = '#e965a2';
const green = '#79a744', orange = '#efaa35', red = '#e94c60';

// Independent strokes in drawing order, adapted from the supplied reference.
// Each illustration owns its local 260 × 240 coordinate system.
const illustrations: Illustration[] = [
  { name: 'cloud-and-flower', position: 'left-top', delay: 0, strokes: [
    { d: 'M28 79 C5 69 17 48 40 53 C27 20 62 14 73 44 C69 8 105 8 108 43 C121 16 149 25 140 54 C176 35 184 68 158 79 C182 99 154 116 132 102 C124 128 96 118 90 105 C68 130 51 112 52 99 C29 117 10 97 28 79', color: blue, width: 9 },
    { d: 'M30 67 l9 24 M47 49 l8 48 M65 39 l8 67 M86 35 l7 68 M106 43 l7 57 M127 48 l6 44 M148 59 l4 25', color: blue, width: 14 },
    { d: 'M184 166 C164 153 169 131 186 138 C185 112 213 113 215 137 C239 125 248 149 228 159 C254 177 234 198 218 183 C216 211 188 205 190 185 C167 198 154 175 184 166', color: purple, width: 12 },
    { d: 'M202 149 C186 148 187 170 202 171 C220 171 218 150 202 149', color: orange, width: 12 },
    { d: 'M220 123 Q232 100 253 104 Q246 124 220 123', color: green },
    { d: 'M35 164 C17 142 5 164 35 188 C63 159 44 145 35 164', color: purple, width: 4 },
  ] },
  { name: 'sun-and-cloud', position: 'right-top', delay: 480, strokes: [
    { d: 'M98 100 C77 70 101 41 129 43 C160 42 181 75 167 100', color: orange, width: 7 },
    { d: 'M106 76 l3 -14 M120 79 l1 -25 M134 80 l-1 -25 M147 84 l-3 -21 M158 87 l-4 -14', color: orange, width: 8 },
    { d: 'M83 72 l-22 -9 M92 48 l-17 -16 M112 33 l-7 -23 M139 30 l3 -23 M162 39 l13 -19 M180 59 l20 -14 M185 81 l26 -3', color: orange },
    { d: 'M67 143 C25 146 28 122 59 121 C41 97 63 81 83 98 C82 68 111 72 120 96 C133 72 158 85 157 108 C184 87 205 113 192 128 C226 139 204 161 177 151 C161 175 139 156 129 153 C108 174 88 155 88 149 C78 158 63 157 67 143', color: '#51afb4' },
    { d: 'M211 191 C185 169 171 191 211 216 C248 187 226 173 211 191', color: red, width: 7 },
    { d: 'M195 189 l12 15 M205 186 l10 17 M218 188 l-1 12', color: red, width: 7 },
  ] },
  { name: 'crab-and-butterfly', position: 'left-middle', delay: 1000, strokes: [
    { d: 'M56 150 C73 122 125 120 146 145 C173 169 133 191 95 184 C69 181 40 170 56 150', color: red },
    { d: 'M83 134 l-5 -32 M122 130 l7 -37 M78 102 C61 103 69 82 79 84 C93 86 91 104 78 102 M130 96 C115 95 120 74 131 78 C143 80 140 96 130 96', color: red, width: 4 },
    { d: 'M80 153 Q103 168 124 151 M59 150 L40 128 M147 148 l19 -29 M65 177 q-28 28 -29 9 M79 183 q-13 30 -20 17 M137 179 q31 19 27 3 M148 170 q32 8 27 -5', color: red, width: 4 },
    { d: 'M41 131 C11 119 16 90 21 94 L37 113 L46 90 C58 98 60 126 41 131 M164 125 C146 105 162 89 166 89 L169 110 L192 93 C197 109 181 132 164 125', color: red },
    { d: 'M184 62 C151 62 132 28 148 19 C164 8 180 37 184 62 C170 21 192 4 205 16 C218 29 202 52 184 62 M184 62 C209 30 236 41 222 58 C214 69 200 71 184 62 M184 62 C164 80 143 66 151 54', color: pink },
    { d: 'M167 70 L201 58 M194 60 Q204 29 217 30', color: pink, width: 6 },
  ] },
  { name: 'rabbit-and-star', position: 'right-middle', delay: 1350, strokes: [
    { d: 'M67 151 C40 126 47 91 82 94 C97 92 113 103 121 111 L127 95 C92 58 102 42 112 50 L144 87 C119 45 134 32 144 46 L167 91 C197 102 205 121 192 132 L170 139 C166 163 143 168 128 155 C104 170 78 168 67 151', color: orange },
    { d: 'M62 144 C24 145 22 115 30 111 C38 112 43 126 52 129 M83 147 Q95 120 118 137 L137 160 M146 143 l5 15 M173 112 l1 2 M191 125 l5 1', color: orange },
    { d: 'M206 177 l7 -20 L220 178 L242 176 L226 190 L231 211 L213 199 L194 210 L200 189 L185 176 Z', color: pink, width: 6 },
    { d: 'M39 47 C18 24 4 47 35 68 C63 46 47 27 39 47', color: purple, width: 4 },
  ] },
  { name: 'whale-and-leaves', position: 'left-bottom', delay: 700, strokes: [
    { d: 'M83 119 C72 84 90 64 118 66 C151 65 162 88 160 118 C175 131 183 98 201 103 C222 109 202 131 189 137 C225 135 232 155 214 161 C196 168 177 150 170 151 C144 194 80 184 83 119', color: '#39a8b4' },
    { d: 'M85 124 Q114 138 155 123 M90 131 Q112 180 155 130 M99 137 l3 20 M111 139 l2 24 M123 139 l1 22 M136 137 l-1 18 M98 103 l0 4 M135 103 l0 5', color: '#39a8b4' },
    { d: 'M111 62 C91 25 119 18 122 53 C122 20 151 30 136 55', color: '#39a8b4', width: 4 },
    { d: 'M62 205 Q39 165 31 115 M43 166 C7 161 8 144 18 147 Q35 148 43 166 M49 181 C57 146 75 156 65 170 Z M34 144 C5 137 11 119 21 124 Z M58 196 C27 201 26 183 39 185 Z M58 196 C78 172 87 186 75 195 Z', color: green, width: 4 },
    { d: 'M198 46 l7 -18 L211 46 L231 40 L218 56 L231 67 L211 65 L203 83 L202 62 L182 66 L196 54 L184 42 Z', color: red, width: 3 },
  ] },
  { name: 'tree-and-garden', position: 'right-bottom', delay: 250, strokes: [
    { d: 'M66 143 C31 157 23 128 43 113 C17 94 34 65 58 72 C47 43 74 26 91 47 C99 16 136 22 141 51 C170 34 190 62 170 83 C201 96 186 126 166 125 C185 155 150 163 135 146 C113 168 81 162 66 143', color: green, width: 9 },
    { d: 'M52 91 l9 37 M68 62 l10 79 M87 55 l9 88 M109 47 l7 97 M129 57 l6 82 M149 69 l4 65 M166 97 l0 18', color: green, width: 14 },
    { d: 'M99 202 L101 123 M115 202 L112 119 M106 153 C77 158 77 144 77 130 M116 151 C141 159 142 140 140 124', color: '#98633c', width: 9 },
    { d: 'M73 209 Q105 190 140 208 M79 213 Q108 203 133 212', color: green, width: 7 },
    { d: 'M201 207 Q232 161 218 110 M219 135 C188 134 189 113 202 119 Z M220 150 C251 126 254 146 237 153 Z M218 168 C190 155 186 173 203 178 Z M211 187 C246 163 251 184 226 189 Z M220 115 C207 90 225 81 228 96 Z', color: green, width: 4 },
  ] },
];

// Set false to retain the progressive drawing without visible crayons.
const SHOW_CRAYONS = true;

function useCrayonAnimation(ref: { current: SVGSVGElement | null }, delay: number) {
  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const crayon = svg.querySelector<SVGGElement>('[data-crayon]');
    const tracks = Array.from(svg.querySelectorAll<SVGPathElement>('[data-stroke]'))
      .map((path) => ({ path, length: path.getTotalLength() }));
    let frame = 0;
    const complete = () => {
      cancelAnimationFrame(frame);
      for (const { path } of tracks) path.style.strokeDashoffset = '0';
      if (crayon) crayon.style.opacity = '0';
    };
    if (!motion.matches && getComputedStyle(svg).display !== 'none') {
      // Layout effect initializes before paint; server markup is complete without JS.
      for (const { path } of tracks) path.style.strokeDashoffset = '1';
      let index = 0;
      let strokeStart = performance.now() + delay;
      let previous = tracks[0].path.getPointAtLength(0);
      const draw = (now: number) => {
        const { path, length } = tracks[index];
        const duration = Math.max(120, length / 185 * 1000);
        const elapsed = now - strokeStart;
        const progress = Math.min(1, Math.max(0, elapsed / duration));
        const point = path.getPointAtLength(length * progress);
        path.style.strokeDashoffset = String(1 - progress);
        if (crayon) {
          const transferring = elapsed < 0 && index > 0;
          const transfer = Math.max(0, Math.min(1, (elapsed + 220) / 220));
          const eased = transfer * transfer * (3 - 2 * transfer);
          const x = transferring ? previous.x + (point.x - previous.x) * eased : point.x;
          const y = transferring ? previous.y + (point.y - previous.y) * eased - Math.sin(transfer * Math.PI) * 12 : point.y;
          // The crayon's local origin is its tip, aligned with the revealed distance.
          crayon.setAttribute('transform', `translate(${x} ${y}) rotate(${24 + Math.sin(progress * Math.PI) * 5})`);
          crayon.style.color = path.getAttribute('stroke') ?? blue;
          crayon.style.opacity = elapsed >= 0 || transferring ? '1' : '0';
        }
        if (progress === 1) { previous = point; index++; strokeStart = now + 220; }
        if (index < tracks.length) frame = requestAnimationFrame(draw);
        else complete();
      };
      frame = requestAnimationFrame(draw);
    } else complete();
    // Switching to reduced motion immediately completes all remaining strokes.
    const onMotionChange = () => { if (motion.matches) complete(); };
    motion.addEventListener('change', onMotionChange);
    return () => { complete(); motion.removeEventListener('change', onMotionChange); };
  }, [ref, delay]);
}

function CrayonArtwork({ illustration }: { illustration: Illustration }) {
  const ref = useRef<SVGSVGElement>(null);
  const id = useId().replaceAll(':', '');
  useCrayonAnimation(ref, illustration.delay);
  // Split disconnected subpaths so the tip lifts rather than jumping between marks.
  const strokes = illustration.strokes.flatMap((stroke) =>
    stroke.d.split(/(?=M)/).filter(Boolean).map((d) => ({ ...stroke, d })));
  return (
    <svg ref={ref} viewBox="0 0 260 240" fill="none" aria-hidden="true" focusable="false"
      className={`crayon-artwork ${illustration.position}`}>
      <defs>
        {/* Static pigment gaps: no animated noise, blur, or displacement. */}
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="12" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  3.4 0 0 0 -1.15" />
        </filter>
        <mask id={`${id}-wax`} maskUnits="userSpaceOnUse" x="0" y="0" width="260" height="240">
          <rect width="260" height="240" fill="white" filter={`url(#${id}-grain)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-wax)`} strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
        {strokes.map((stroke, index) => (
          <path key={index} data-stroke d={stroke.d} stroke={stroke.color}
            strokeWidth={stroke.width ?? 5} pathLength="1" strokeDasharray="1 1" />
        ))}
      </g>
      {SHOW_CRAYONS && (
        <g data-crayon style={{ opacity: 0 }}>
          <path d="M0 0 L-4 -11 L4 -11 Z" fill="currentColor" />
          <rect x="-4" y="-39" width="8" height="29" rx="1.5" fill="currentColor" />
          <path d="M-4 -32 H4 V-16 H-4 Z" fill="#f7edda" />
          <path d="M-4 -29 H4 M-4 -19 H4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-2 -37 V-34" stroke="white" strokeOpacity="0.6" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

function HeroSection() {
  return (
    <section className="crayon-hero" aria-labelledby="hero-title">
      <div className="crayon-artwork-layer" aria-hidden="true">
        {illustrations.map((illustration) => <CrayonArtwork key={illustration.name} illustration={illustration} />)}
      </div>
      <div className="crayon-hero-content">
        <p className="mb-7 inline-flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-fd-muted-foreground uppercase">
          <span className="size-2 rounded-full bg-fd-primary" /> KOReader Plugin
        </p>
        <h1 id="hero-title" className="mx-auto w-full max-w-xl">
          <Image
            src="/assets/ink-away-title.svg"
            alt="Ink-away.koplugin"
            width={377}
            height={109}
            className="h-auto w-full"
            unoptimized
            priority
          />
        </h1>
        <Image
          src="/assets/readme-divider.svg"
          alt=""
          aria-hidden="true"
          width={1000}
          height={54}
          className="mx-auto mt-4 h-auto w-full max-w-3xl"
          unoptimized
        />
        <p className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-fd-muted-foreground sm:text-xl">
          Ink Away is a drawing, notes and book annotation app for KOReader, with palm rejection and pen pressure for stylus users.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/docs" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fd-primary px-5 py-3 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-ring">
            Build an integration <ArrowRight size={16} />
          </Link>
          <Link href="/docs#public-api" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border bg-fd-background px-5 py-3 text-sm font-medium transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-ring">
            <BookOpen size={16} /> Explore the API
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="flex w-full flex-1 flex-col">
      {/* React hoists this stylesheet into the server-rendered head, before paint. */}
      <style href="ink-away-hero" precedence="default">{`
        .crayon-hero {
          position: relative;
          isolation: isolate;
          display: grid;
          place-items: center;
          min-height: 850px;
          min-height: max(850px, calc(100svh - 64px));
          overflow: hidden;
        }
        .crayon-hero-content {
          position: relative;
          z-index: 1;
          width: min(600px, 54%);
          padding: 100px 0 120px;
          text-align: center;
        }
        .crayon-artwork-layer { position: absolute; inset: 0; pointer-events: none; user-select: none; }
        .crayon-artwork { position: absolute; width: min(25vw, 350px); height: auto; overflow: visible; }
        .crayon-artwork.left-top { left: -2%; top: 2%; transform: rotate(-8deg); }
        .crayon-artwork.right-top { right: -2%; top: 0; transform: rotate(8deg); }
        .crayon-artwork.left-middle { left: -4%; top: 34%; transform: rotate(-12deg); }
        .crayon-artwork.right-middle { right: -3%; top: 35%; transform: rotate(9deg); }
        .crayon-artwork.left-bottom { left: 0; bottom: -2%; transform: rotate(5deg); }
        .crayon-artwork.right-bottom { right: -2%; bottom: -3%; transform: rotate(-7deg); }
        @media (prefers-reduced-motion: no-preference) {
          .crayon-hero [data-stroke] { stroke-dashoffset: 1; }
        }
        @media (min-width: 1600px) {
          .crayon-artwork.left-top, .crayon-artwork.left-bottom { left: calc(50% - 800px); }
          .crayon-artwork.left-middle { left: calc(50% - 830px); }
          .crayon-artwork.right-top, .crayon-artwork.right-bottom { right: calc(50% - 800px); }
          .crayon-artwork.right-middle { right: calc(50% - 830px); }
        }
        @media (max-width: 767px) {
          .crayon-hero { min-height: 880px; }
          .crayon-hero-content { width: min(100% - 40px, 480px); padding: 200px 0 230px; }
          .crayon-artwork { width: 180px; }
          .crayon-artwork.left-top { left: -28px; top: -6px; }
          .crayon-artwork.right-top { right: -24px; top: 5px; }
          .crayon-artwork.left-middle, .crayon-artwork.right-bottom { display: none; }
          .crayon-artwork.left-bottom { left: -26px; bottom: 0; }
          .crayon-artwork.right-middle { right: -30px; top: auto; bottom: 5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .crayon-hero [data-stroke] { stroke-dashoffset: 0 !important; }
          .crayon-hero [data-crayon] { display: none; }
        }
      `}</style>
      <noscript><style>{'.crayon-hero [data-stroke] { stroke-dashoffset: 0 !important; }'}</style></noscript>
      <HeroSection />
    </main>
  );
}
