import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import './global.css';


export const metadata: Metadata = {
  title: { default: 'Ink-away.koplugin', template: '%s | Ink-away.koplugin' },
  description: 'Plugin integration guides and the public Ink Away extension API for KOReader.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
