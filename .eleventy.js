module.exports = function(eleventyConfig) {
    // Copy static assets (CSS, JS, images, etc.) to the output directory
    eleventyConfig.addPassthroughCopy("styles");
    eleventyConfig.addPassthroughCopy("scripts");
    eleventyConfig.addPassthroughCopy("images"); 
    eleventyConfig.addPassthroughCopy("components");// if you have an images folder
    // Optional: Add collection for blog posts if needed (as suggested earlier)
    eleventyConfig.addCollection("post", function(collectionApi) {
        return collectionApi.getFilteredByGlob("post/*.md"); // <-- Corrected path
      });
      // Make sure the glob pattern matches your post file location (e.g., posts/*.md or content/blog/*.md)
      // Based on your error message, it seems like your posts are in ./posts/
      const markdownIt = require("markdown-it");
      const markdownItAnchor = require("markdown-it-anchor");
      
      module.exports = function(eleventyConfig) {
        // Add your existing addPassthroughCopy and addCollection calls here...
      
        // Configure Markdown-it
        eleventyConfig.setLibrary("md", markdownIt({
          html: true, // Allow HTML in markdown
          breaks: true, // Convert newline characters to <br>
          linkify: true // Auto-convert URLs to links
        }).use(markdownItAnchor, {
          permalink: markdownItAnchor.permalink.headerLink() // Add permalink icons next to headings
        }));
      
        // Add your existing filters here...
      
        return {
          // ... your dir configuration ...
        };
      };
  
    // Add date filters
    eleventyConfig.addFilter("htmlDateString", (dateObj) => {
      // dateObj will be a Date object from front matter or collection
      if (!dateObj || !(dateObj instanceof Date)) {
        // Handle cases where dateObj might be null, undefined, or not a Date object
        return ""; // Or some other placeholder
      }
      // Use ISO string and slice to get YYYY-MM-DD format for datetime attribute
      return dateObj.toISOString().split('T')[0];
    });
  
    eleventyConfig.addFilter("readableDate", (dateObj) => {
      // dateObj will be a Date object
       if (!dateObj || !(dateObj instanceof Date)) {
           return "N/A"; // Or some other placeholder
       }
      // Use JavaScript's built-in toLocaleDateString for a readable format
      // Example: October 27, 2023
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return dateObj.toLocaleDateString('en-US', options); // Adjust 'en-US' if needed for your locale
    });

    eleventyConfig.addFilter("htmlDateString", (dateObj) => { /* ... */ });
  eleventyConfig.addFilter("readableDate", (dateObj) => { /* ... */ });


  // --- Add this configuration for Markdown-it and the Anchor plugin ---
  eleventyConfig.setLibrary("md", markdownIt({
    html: true,         // Enable HTML tags in source
    breaks: true,       // Convert '\n' in input into <br>
    linkify: true       // Autoconvert URL-like text to links
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink() // Adds a link icon next to the heading
  }));
  // --- End Markdown configuration ---
  
    // ... rest of your .eleventy.js configuration (like input/output directories)
    return {
      dir: {
        input: ".",
        output: "_site"
      }
    };
  };