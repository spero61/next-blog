// for Search Engine Optimization(SEO)
import Head from 'next/head';

export default function Metatags({
  title = 'spero61 blog for everyone',
  description = 'a blog built on top of Next.js, Firebase and TailwindCSS',
  image = 'https://i.imgur.com/6m61BZB.png',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@spero61_blog" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}