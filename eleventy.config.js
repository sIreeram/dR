import path from "path";
import { fileURLToPath } from "url";
import {
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
  HtmlBasePlugin,
} from "@11ty/eleventy";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

import pluginFilters from "./src/_config/filters.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
  // Drafts, see also _data/eleventyDataSchema.js
  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // Copy the contents of the `public` folder to the output folder
  // This automatically moves public/admin/ into your live build root!
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
  });

  // Run Eleventy when these files change
  eleventyConfig.addWatchTarget("./src/css/");

  // Watch content images for the image pipeline
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // Official plugins
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // Image optimization
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["avif", "webp", "auto"],
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
  });

  // Filters
  eleventyConfig.addPlugin(pluginFilters);

  eleventyConfig.addPlugin(IdAttributePlugin, {});

  eleventyConfig.addGlobalData("siteConfigFilePath", () => {
    const jsonFileAbsolutePath = path.resolve("src/_data/metadata.json");
    const relativePath = path.relative(process.cwd(), jsonFileAbsolutePath);
    return relativePath;
  });
}

export const config = {
  templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dir: {
    input: "./src/content", 
    includes: "../_includes", 
    data: "../_data", 
    output: "_site",
  },
};
