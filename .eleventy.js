module.exports = function(eleventyConfig) {
    // Copy static assets (CSS, JS, images, etc.) to the output directory
    eleventyConfig.addPassthroughCopy("styles");
    eleventyConfig.addPassthroughCopy("scripts");
    eleventyConfig.addPassthroughCopy("images"); // if you have an images folder
    // Optional: Add collection for blog posts if needed (as suggested earlier)
    eleventyConfig.addCollection("post", function(collectionApi) {
      // Make sure the glob pattern matches your post file location (e.g., posts/*.md or content/blog/*.md)
      // Based on your error message, it seems like your posts are in ./posts/
      return collectionApi.getFilteredByGlob("posts/*.md");
    });
  
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
  
    // ... rest of your .eleventy.js configuration (like input/output directories)
    return {
      dir: {
        input: ".",
        output: "_site"
      }
    };
  };