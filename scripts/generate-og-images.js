#!/usr/bin/env node

/**
 * Generates OG (Open Graph) images for blog posts and pages using Satori and Sharp.
 *
 * For each post/page, creates a 1200x630 JPEG with:
 * - Background from social-preview-bg.jpg (or solid gray fallback)
 * - Title overlaid in top-left area
 *
 * Output: public/img/og/{slug}.jpg
 *
 * Run: node scripts/generate-og-images.js
 */

const fs = require("fs");
const path = require("path");
const satori = require("satori").default;
const sharp = require("sharp");
const matter = require("gray-matter");

const POSTS_DIR = path.join(__dirname, "..", "_posts");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "img", "og");
const BG_IMAGE_PATH = path.join(
  __dirname,
  "..",
  "public",
  "social-preview-bg.jpg"
);
const PLAYFAIR_FONT_PATH = path.join(
  __dirname,
  "..",
  "node_modules",
  "@fontsource",
  "playfair-display",
  "files",
  "playfair-display-latin-400-normal.woff"
);
const LATO_FONT_PATH = path.join(
  __dirname,
  "..",
  "node_modules",
  "@fontsource",
  "lato",
  "files",
  "lato-latin-400-normal.woff"
);

const WIDTH = 1200;
const HEIGHT = 630;

async function loadFonts() {
  const fonts = [];
  if (fs.existsSync(PLAYFAIR_FONT_PATH)) {
    fonts.push({
      name: "Playfair Display",
      data: fs.readFileSync(PLAYFAIR_FONT_PATH),
      weight: 400,
      style: "normal",
    });
  } else {
    throw new Error("Playfair Display font not found");
  }
  if (fs.existsSync(LATO_FONT_PATH)) {
    fonts.push({
      name: "Lato",
      data: fs.readFileSync(LATO_FONT_PATH),
      weight: 400,
      style: "normal",
    });
  } else {
    throw new Error("Lato font not found");
  }
  return fonts;
}

async function loadBackgroundImage() {
  if (fs.existsSync(BG_IMAGE_PATH)) {
    const buffer = fs.readFileSync(BG_IMAGE_PATH);
    const base64 = buffer.toString("base64");
    const mimeType = "image/jpeg";
    return `data:${mimeType};base64,${base64}`;
  }
  return null;
}

function getEntriesFromDirectory(directory) {
  if (!fs.existsSync(directory)) return [];

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const items = [];

  for (const entry of entries) {
    let filePath;
    let slug;

    if (entry.isDirectory()) {
      // Folder-based: my-post/index.md
      const indexMd = path.join(directory, entry.name, "index.md");
      const indexMdx = path.join(directory, entry.name, "index.mdx");
      if (fs.existsSync(indexMd)) {
        filePath = indexMd;
      } else if (fs.existsSync(indexMdx)) {
        filePath = indexMdx;
      } else {
        continue;
      }
      slug = entry.name;
    } else if (entry.name.match(/\.(md|mdx)$/)) {
      // Flat file: my-post.md
      filePath = path.join(directory, entry.name);
      slug = entry.name.replace(/\.(md|mdx)$/, "");
    } else {
      continue;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    // Determine the slug, using "/" for index pages
    let itemSlug = data.slug || slug;
    if (itemSlug === "/" || itemSlug === "index") {
      itemSlug = "index";
    }

    items.push({
      slug: itemSlug,
      title: data.title || slug,
    });
  }

  return items;
}

function createOgImageElement(title, backgroundDataUrl) {
  // React-like element structure for Satori
  const backgroundStyle = backgroundDataUrl
    ? {
        backgroundImage: `url(${backgroundDataUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundColor: "#f5f5f5",
      };

  return {
    type: "div",
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 80,
        ...backgroundStyle,
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              fontSize: 56,
              fontFamily: "Playfair Display",
              fontWeight: 400,
              color: "#374151",
              lineHeight: 1.2,
              maxWidth: 700,
              wordWrap: "break-word",
            },
            children: title,
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 32,
              fontFamily: "Lato",
              fontWeight: 400,
              color: "#9ca3af",
              marginTop: 12,
            },
            children: "by Karl Lorey",
          },
        },
      ],
    },
  };
}

async function generateOgImage(item, fonts, backgroundDataUrl) {
  const element = createOgImageElement(item.title, backgroundDataUrl);

  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });

  const jpg = await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer();

  const outputPath = path.join(OUTPUT_DIR, `${item.slug}.jpg`);

  // Create parent directories if needed (for nested slugs like "human/inspiration")
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, jpg);

  return outputPath;
}

async function main() {
  console.log("Generating OG images...\n");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const fonts = await loadFonts();
  const backgroundDataUrl = await loadBackgroundImage();

  if (!backgroundDataUrl) {
    console.log(
      "Note: social-preview-bg.jpg not found, using solid gray background.\n"
    );
  }

  const posts = getEntriesFromDirectory(POSTS_DIR);

  console.log(`Found ${posts.length} posts.\n`);

  for (const item of posts) {
    try {
      const outputPath = await generateOgImage(item, fonts, backgroundDataUrl);
      console.log(`Generated: ${path.basename(outputPath)}`);
    } catch (error) {
      console.error(`Failed to generate OG image for ${item.slug}:`, error);
    }
  }

  console.log("\nDone!");
}

main().catch(console.error);
