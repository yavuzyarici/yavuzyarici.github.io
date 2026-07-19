// ==================== //
// Publications Renderer
// ==================== //

/**
 * Fetches publications from JSON and renders them dynamically
 */
async function loadPublications() {
    try {
        // Fetch publications data
        const response = await fetch('data/publications.json?v=' + new Date().getTime());
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

    // Group into year buckets. The array arrives already sorted newest-first,
    // so tracking the last-seen year is enough to emit headings in order.
    let currentYear = null;
    publications.forEach(pub => {
        if (pub.year !== currentYear) {
            currentYear = pub.year;
            const heading = document.createElement('h3');
            heading.className = 'pub-year';
            heading.textContent = currentYear;
            container.appendChild(heading);
        }
        container.appendChild(createPublicationCard(pub));
    });
}

/**
 * Classifies a venue string into a category used for the card's color
 * coding and badge. Order matters: "workshop" is checked before the
 * generic conference fallback because workshop venue names usually
 * contain the word "Conference" too.
 */
function classifyVenue(venue) {
    const v = (venue || '').toLowerCase();
    if (v.includes('arxiv') || v.includes('preprint')) {
        return { type: 'preprint', label: 'Preprint' };
    }
    if (v.includes('journal') || v.includes('transactions')) {
        return { type: 'journal', label: 'Journal' };
    }
    if (v.includes('workshop')) {
        return { type: 'workshop', label: 'Workshop' };
    }
    return { type: 'conference', label: 'Conference' };
}

/**
 * Creates a publication card element
 */
function createPublicationCard(pub) {
    const category = classifyVenue(pub.venue);

    const card = document.createElement('div');
    card.className = 'publication-card pub-' + category.type;

    // Category pill
    const badge = document.createElement('span');
    badge.className = 'pub-badge';
    badge.textContent = category.label;
    card.appendChild(badge);

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
