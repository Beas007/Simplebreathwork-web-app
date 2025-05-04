const { URL } = require("url");
const markdownIt = require("markdown-it"); // Keep using require for markdown-it (likely CJS)
// const markdownItAnchor = require("markdown-it-anchor"); // <-- REMOVE THIS LINE

// Make the exported function async
module.exports = async function(eleventyConfig) {

    // Dynamically import markdown-it-anchor
    // We often need .default when dynamically importing ESM into CJS
    const markdownItAnchor = (await import('markdown-it-anchor')).default;

    // Passthrough Copies
    eleventyConfig.addPassthroughCopy("styles");
    eleventyConfig.addPassthroughCopy("scripts");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("components");
    eleventyConfig.addPassthroughCopy("favicon.ico");
    eleventyConfig.addPassthroughCopy("site.webmanifest");
    eleventyConfig.addPassthroughCopy("images/favicon");

    // Explicitly ignore the _templates directory
    eleventyConfig.ignores.add("_templates/**");

    // Collections
    eleventyConfig.addCollection("post", function(collectionApi) {
        return collectionApi.getFilteredByGlob("post/*.md");
    });

    // Filters (htmlDateString, readableDate, absoluteUrl)
    // ... (keep your existing filters) ...
    eleventyConfig.addFilter("htmlDateString", (dateObj) => {
      if (!dateObj || !(dateObj instanceof Date)) { return ""; }
      return dateObj.toISOString().split('T')[0];
    });
    eleventyConfig.addFilter("readableDate", (dateObj) => {
       if (!dateObj || !(dateObj instanceof Date)) { return "N/A"; }
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return dateObj.toLocaleDateString('en-US', options);
    });
    eleventyConfig.addFilter("absoluteUrl", (url, base) => {
      try { return (new URL(url, base)).href; }
      catch (e) { console.error(`Failed absoluteUrl: ${url}, ${base}`); return url; }
    });
    // Add this to your .eleventy.js file with your other filters
eleventyConfig.addFilter("url_encode", function(value) {
    return encodeURIComponent(value);
  });

    // --- Add Markdown Configuration ---
    let markdownLibrary = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    }).use(markdownItAnchor, { // Use the dynamically imported module
        permalink: markdownItAnchor.permalink.ariaHidden({
            placement: 'after',
            class: 'heading-anchor',
            symbol: '',
            ariaHidden: true,
        }),
        level: [2, 3]
    });
    eleventyConfig.setLibrary("md", markdownLibrary);
    // --- End Markdown Configuration ---


    // Return your config object
    return {
        dir: {
            input: ".",
            output: "_site",
            includes: "_includes",
            layouts: "_includes",
            data: "_data"
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        templateFormats: ["md", "njk", "html", "liquid"]
    };
};