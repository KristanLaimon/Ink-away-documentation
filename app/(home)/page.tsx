import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Layers, Radio } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-20 md:py-32">
      <div className="mb-8 flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-fd-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-fd-primary" /> KOReader · Plugin developer documentation
      </div>
      <h1 className="w-full max-w-xl">
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
        className="mt-4 h-auto w-full max-w-3xl"
        unoptimized
      />
      <p className="mt-6 max-w-2xl text-xl leading-relaxed text-fd-muted-foreground">
        Make your plugin part of the annotation workflow. Observe sessions,
        connect a viewer, and build through a documented public API.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/docs/integration" className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-3 font-medium text-fd-primary-foreground">Build an integration <ArrowRight size={16} /></Link>
        <Link href="/docs/api" className="rounded-lg border px-5 py-3 font-medium hover:bg-fd-accent">Explore the API</Link>
      </div>
      <div className="mt-20 grid gap-4 md:grid-cols-3">
        {[
          { icon: Radio, title: 'Listen to annotation events', text: 'Connect without a custom viewer. Subscribe to opening and closing sessions.', href: '/docs/integration/event-only' },
          { icon: Layers, title: 'Bring your own rendering', text: 'Supply a surface for your viewer. Ink Away owns the tools, ink, and persistence.', href: '/docs/integration/rendering-consumer' },
          { icon: BookOpen, title: 'Know the contract', text: 'Read method signatures, return values, edge cases, and complete Lua examples.', href: '/docs/api' },
        ].map(({ icon: Icon, title, text, href }) => (
          <Link key={href} href={href} className="rounded-xl border bg-fd-card p-6 transition-colors hover:bg-fd-accent">
            <Icon size={22} className="mb-5 text-fd-muted-foreground" />
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">{text}</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-sm text-fd-muted-foreground">Integration API v1 · Feature branch documentation · Native reader defaults preserved</p>
    </main>
  );
}
