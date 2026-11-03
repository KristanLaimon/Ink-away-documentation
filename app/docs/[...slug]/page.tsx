import { source } from '@/lib/source';
import { DocumentationPage, getDocumentationMetadata } from '@/components/documentation-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamicParams = false;

export default async function Page(props: PageProps<'/docs/[...slug]'>) {
  const { slug } = await props.params;
  const page = source.getPage(slug);
  if (!page) notFound();
  return <DocumentationPage page={page} />;
}

export function generateStaticParams() {
  // /docs has its own page; this route exports named articles only.
  return source.generateParams().filter(({ slug }) => slug.length > 0);
}

export async function generateMetadata(props: PageProps<'/docs/[...slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const page = source.getPage(slug);
  if (!page) notFound();
  return getDocumentationMetadata(page);
}
