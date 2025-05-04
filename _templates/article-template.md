---
title: "Your Article Title Here"
description: "Write a compelling 1-2 sentence description that will appear in preview cards and meta tags"
date: {{ date }}
layout: article.html
tags: post
category: "Your Category Here"
eo_title: "Your SEO-Optimized Title (Optional, defaults to title)" 
keywords: "breathwork, breathing technique, meditation, keyword1, keyword2"
image: "/images/articles/your-feature-image.jpg"
og_type: "article"
twitter_card: "summary_large_image"
---

## Introduction

Start with an engaging introduction that hooks the reader and outlines what they'll learn in this article.

## Main Section 1

Content for your first main section. Consider including:

* Key points in bullet form
* Practical examples
* Explanations of concepts

## Main Section 2

Content for your second main section.

### Subsection 2.1

More detailed information on a specific aspect.

### Subsection 2.2

Additional details on another aspect.

## Main Section 3

Content for your third main section.

## Conclusion

Summarize the key takeaways from your article and possibly include a call to action.

[Optional Link to Related Exercise](https://simplebreathwork.com/exercise/?type=your-technique)
<!-- Social Sharing Section - Copy this into your article template -->
<section class="article-sharing">
    <h3>Share This Article</h3>
    <div class="share-buttons">
        <!-- Copy Link Button -->
        <button id="copy-link-button" class="share-button" aria-label="Copy link to clipboard">
            <i class="fas fa-link"></i>
            <span class="share-text">Copy Link</span>
        </button>
        
        <!-- Email Share -->
        <a href="mailto:?subject={{ title | url_encode }}&body=Check out this article: {{ page.url | absoluteUrl(metadata.url) | url_encode }}" class="share-button" aria-label="Share via Email">
            <i class="fas fa-envelope"></i>
            <span class="share-text">Email</span>
        </a>
        
        <!-- Facebook Share -->
        <a href="https://www.facebook.com/sharer/sharer.php?u={{ page.url | absoluteUrl(metadata.url) | url_encode }}" target="_blank" rel="noopener noreferrer" class="share-button" aria-label="Share on Facebook">
            <i class="fab fa-facebook-f"></i>
            <span class="share-text">Facebook</span>
        </a>
        
        <!-- Twitter/X Share -->
        <a href="https://twitter.com/intent/tweet?url={{ page.url | absoluteUrl(metadata.url) | url_encode }}&text={{ title | url_encode }}" target="_blank" rel="noopener noreferrer" class="share-button" aria-label="Share on Twitter">
            <i class="fab fa-twitter"></i>
            <span class="share-text">Twitter</span>
        </a>
        
        <!-- LinkedIn Share -->
        <a href="https://www.linkedin.com/shareArticle?mini=true&url={{ page.url | absoluteUrl(metadata.url) | url_encode }}&title={{ title | url_encode }}&summary={{ description | url_encode }}" target="_blank" rel="noopener noreferrer" class="share-button" aria-label="Share on LinkedIn">
            <i class="fab fa-linkedin-in"></i>
            <span class="share-text">LinkedIn</span>
        </a>
        
        <!-- Pinterest Share -->
        <a href="https://pinterest.com/pin/create/button/?url={{ page.url | absoluteUrl(metadata.url) | url_encode }}&media={{ metadata.url }}{{ image | url_encode }}&description={{ title | url_encode }}" target="_blank" rel="noopener noreferrer" class="share-button" aria-label="Share on Pinterest">
            <i class="fab fa-pinterest-p"></i>
            <span class="share-text">Pinterest</span>
        </a>
        
        <!-- Instagram doesn't have a direct share URL API, but you can add a CTA for it -->
        <a href="https://www.instagram.com/simplebreathwork" target="_blank" rel="noopener noreferrer" class="share-button" aria-label="Follow on Instagram">
            <i class="fab fa-instagram"></i>
            <span class="share-text">Instagram</span>
        </a>
    </div>
</section>

<!-- JavaScript for the copy link button -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.getElementById('copy-link-button');
    if (copyButton) {
        copyButton.addEventListener('click', function() {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(function() {
                // Success feedback
                const originalText = copyButton.querySelector('.share-text').textContent;
                copyButton.querySelector('.share-text').textContent = 'Copied!';
                setTimeout(function() {
                    copyButton.querySelector('.share-text').textContent = originalText;
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy link: ', err);
            });
        });
    }
});
</script>