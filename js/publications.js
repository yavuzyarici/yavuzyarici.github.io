// ==================== //
// Publications Renderer
// ==================== //

/**
 * Fetches publications from JSON and renders them dynamically
 */
async function loadPublications() {
    try {
        // Fetch publications data
        const response = await fetch('data/publications.json');
        if (!response.ok) {
            throw new Error('Failed to load publications');
        }
        const publications = await response.json();

        // Sort by year (newest first)
        publications.sort((a, b) => b.year - a.year);

        // Render publications
        renderPublications(publications);
    } catch (error) {
        console.error('Error loading publications:', error);
        // Show error message to user
        const container = document.querySelector('.publications-container');
        if (container) {
            container.innerHTML = '<p style="color: #666;">Failed to load publications. Please refresh the page.</p>';
        }
    }
}

/**
 * Renders publications HTML
 */
function renderPublications(publications) {
    const container = document.querySelector('.publications-container');
    if (!container) {
        console.error('Publications container not found');
        return;
    }

    // Clear container
    container.innerHTML = '';

    // Generate HTML for each publication
    publications.forEach(pub => {
        const card = createPublicationCard(pub);
        container.appendChild(card);
    });
}

/**
 * Creates a publication card element
 */
function createPublicationCard(pub) {
    const card = document.createElement('div');
    card.className = 'publication-card';

    // Title
    const title = document.createElement('h3');
    title.textContent = pub.title;
    card.appendChild(title);

    // Authors (with highlighting)
    const authors = document.createElement('p');
    authors.className = 'authors';
    authors.innerHTML = formatAuthors(pub.authors);
    card.appendChild(authors);

    // Venue
    const venue = document.createElement('p');
    venue.className = 'venue';
    venue.textContent = `${pub.venue}, ${pub.year}`;
    card.appendChild(venue);

    // Links
    if (pub.links && Object.keys(pub.links).length > 0) {
        const linksContainer = document.createElement('div');
        linksContainer.className = 'publication-links';

        for (const [label, url] of Object.entries(pub.links)) {
            const link = document.createElement('a');
            link.href = url;
            link.className = 'pub-link';
            link.textContent = label;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            linksContainer.appendChild(link);
        }

        card.appendChild(linksContainer);
    }

    return card;
}

/**
 * Formats author list with highlighting for Yavuz Yarici
 */
function formatAuthors(authors) {
    return authors.map(author => {
        if (author === 'Yavuz Yarici') {
            return `<strong>${author}</strong>`;
        }
        return author;
    }).join(', ');
}

// Load publications when DOM is ready
document.addEventListener('DOMContentLoaded', loadPublications);
