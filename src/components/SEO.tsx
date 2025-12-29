import Head from "next/head";

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedDate?: string;
}

export default function SEO({
  title,
  description,
  path,
  type,
  publishedDate,
}: SEOProps) {
  const siteName = "Karl Lorey";
  const baseUrl = "https://karllorey.com";
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const url = path ? `${baseUrl}${path}` : baseUrl;

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type || "website"} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
    </Head>
  );
}
