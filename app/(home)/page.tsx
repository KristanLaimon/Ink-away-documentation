import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">Ink-away.koplugin</h1>
      <p className="mt-4 text-fd-muted-foreground">Developer documentation for Ink Away plugin integrations.</p>
      <Link href="/docs" className="mt-6 font-medium text-fd-primary">Read the documentation →</Link>
    </main>
  );
}
