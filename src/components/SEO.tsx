import Head from "next/head";

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedDate?: string;
  addSuffix?: boolean;
  noindex?: boolean;
  image?: string;
}

export default function SEO({
  title,
  description,
  path,
  type,
  publishedDate,
  addSuffix = true,
  noindex = false,
  image,
}: SEOProps) {
  const siteName = "Karl Lorey";
  const twitterHandle = "@karllorey";
  const baseUrl = "https://karllorey.com";
  const defaultDescription = "A page on karllorey.com";
  const fullTitle = addSuffix ? `${title} | ${siteName}` : title;
  const fullDescription = description || defaultDescription;
  const url = path ? `${baseUrl}${path}` : baseUrl;
  const imageUrl = image
    ? `${baseUrl}${image}`
    : `${baseUrl}/social-preview.jpg`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={type || "website"} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={imageUrl} />
      {publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Head>
  );
}
