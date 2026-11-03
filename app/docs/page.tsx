import { source } from '@/lib/source';
import { DocumentationPage, getDocumentationMetadata } from '@/components/documentation-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export default function Page() {
  const page = source.getPage([]);
  if (!page) notFound();
  return <DocumentationPage page={page} />;
}

export function generateMetadata(): Metadata {
  const page = source.getPage([]);
  if (!page) notFound();
  return getDocumentationMetadata(page);
}
