module.exports = function(eleventyConfig) {
    // Copy static assets (CSS, JS, images, etc.) to the output directory
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("images"); // if you have an images folder
    // Add other folders if needed
  
    return {
      dir: {
        input: ".", // Look for source files in the current directory (your project root)
        output: "_site" // Build the site into a folder named _site
      }
    };
  };