document.addEventListener('DOMContentLoaded', () => {
    // Article data structure
    const articles = [
        {
            id: 1,
            title: "Understanding Box Breathing",
            excerpt: "Learn how this simple technique can help reduce stress...",
            image: "images/box-breathing.jpg",
            category: "Breathing Technique",
            date: "2024-04-25",
            url: "/articles/box-breathing.html"
        },
        // Add more articles here
    ];

    function createArticleCard(article) {
        const date = new Date(article.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="article-card">
                <div class="article-image-container">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                    <span class="article-date">${formattedDate}</span>
                </div>
                <div class="article-content">
                    <span class="article-category">${article.category}</span>
                    <h2 class="article-title">${article.title}</h2>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <a href="${article.url}" class="article-link">Read More →</a>
                </div>
            </article>
        `;
    }

    function displayArticles() {
        const container = document.getElementById('recent-articles');
        if (!container) return;

        // Sort articles by date (newest first)
        const sortedArticles = articles.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        // Display articles
        container.innerHTML = sortedArticles
            .map(article => createArticleCard(article))
            .join('');
    }

    // Initialize blog
    displayArticles();
});