// Update the template path to read from _templates directory
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Read the template filerom _templates directory
const templatePath = path.join(__dirname, '_templates', 'article-template.md');


// Check if the template file exists
if (!fs.existsSync(templatePath)) {
    console.error(`Template file not found: ${templatePath}`);
    process.exit(1);
  }

const templateContent = fs.readFileSync(templatePath, 'utf8');

// Get the current date in YYYY-MM-DD format
const today = new Date();
const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

// Ask questions to create frontmatter
rl.question('Enter article title: ', (title) => {
  rl.question('Enter article description: ', (description) => {
    rl.question('Enter category (default: Breathing Technique): ', (category) => {
      // Create slug from title
      const slug = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')  // Remove special chars
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .trim();
      
      // Default category if none provided
      const finalCategory = category || 'Breathing Technique';
      
      // REPLACE THESE TWO LINES with more robust parsing:
      // const [frontmatter, ...contentParts] = templateContent.split('---\n').filter(Boolean);
      // const contentTemplate = contentParts.join('---\n');
      
      // This handles different line endings better
      const templateParts = templateContent.split(/---\r?\n/);
      // Skip the first empty part (before first ---) and the frontmatter itself
      const contentTemplate = templateParts.slice(2).join('---\n');
      
      // Create new frontmatter
      const newFrontmatter = `---
title: "${title}"
description: "${description}"
date: ${formattedDate}
layout: article.html
tags: post
category: "${finalCategory}"
---`;

      // Combine new frontmatter with template content
      const content = newFrontmatter + '\n' + contentTemplate;
      
      // Create filename
      const filename = `post/${formattedDate}-${slug}.md`;
      
      // Write the file - add try/catch here
      try {
        fs.writeFileSync(filename, content);
        console.log(`\nSuccess! New article created at ${filename}`);
        console.log(`Run 'npx @11ty/eleventy --serve' to see your changes.\n`);
      } catch (error) {
        console.error(`Error creating file: ${error.message}`);
      }
      
      rl.close();
    });
  });
});