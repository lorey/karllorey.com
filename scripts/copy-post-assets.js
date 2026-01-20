#!/usr/bin/env node

/**
 * Copies non-markdown assets (images, etc.) from _posts/[slug]/ folders
 * to public/posts/[slug]/ so they're accessible at /posts/[slug]/image.png
 *
 * Run before build: node scripts/copy-post-assets.js
 */

const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "..", "_posts");
const PUBLIC_POSTS_DIR = path.join(__dirname, "..", "public", "img", "posts");

function copyPostAssets() {
  // Ensure public/posts exists
  if (!fs.existsSync(PUBLIC_POSTS_DIR)) {
    fs.mkdirSync(PUBLIC_POSTS_DIR, { recursive: true });
  }

  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    // Only process directories (folder-based posts)
    if (!entry.isDirectory()) continue;

    const postFolder = path.join(POSTS_DIR, entry.name);
    const targetFolder = path.join(PUBLIC_POSTS_DIR, entry.name);

    // Get all files in the post folder
    const files = fs.readdirSync(postFolder);
    const assets = files.filter((f) => !f.match(/\.(md|mdx)$/));

    if (assets.length === 0) continue;

    // Create target folder
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    // Copy each asset
    for (const asset of assets) {
      const src = path.join(postFolder, asset);
      const dest = path.join(targetFolder, asset);
      fs.copyFileSync(src, dest);
      console.log(`Copied: ${entry.name}/${asset}`);
    }
  }
}

copyPostAssets();
