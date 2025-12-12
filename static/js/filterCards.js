document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const filterLinks = document.querySelectorAll('.filter-controls a');
    const allProjectsFilter = document.querySelector('#all-projects-filter');
    if (!cards.length || !filterLinks.length) return;
    allProjectsFilter.style.display = 'block';

    // Pre-change all hrefs to hash format on page load
    filterLinks.forEach(link => {
        const originalHref = link.getAttribute('href');
        if (originalHref) {
            const tagSlug = originalHref.split('/').filter(Boolean).pop();
            link.setAttribute('href', `#${tagSlug}`);
        }
    });

    // Create a Map for O(1) lookups of links by filter value.
    const linkMap = new Map(
        Array.from(filterLinks).map(link => [link.dataset.filter, link])
    );

    // Pre-process cards data for faster filtering.
    const cardData = Array.from(cards).map(card => ({
        element: card,
        tags: card.dataset.tags?.toLowerCase().split(',').filter(Boolean) ?? []
    }));
    function getTagSlugFromHash(hash) {
        return hash ? decodeURIComponent(hash.slice(1)) : '';
    }

    function getFilterFromHash() {
        if (!window.location.hash) return 'all';
        const tagSlug = getTagSlugFromHash(window.location.hash);
        const matchingLink = Array.from(filterLinks).find(link =>
            link.getAttribute('href') === `#${tagSlug}`
        );
        return matchingLink?.dataset.filter ?? 'all';
    }

    function setActiveFilter(filterValue) {
        const isAll = filterValue === 'all';
        const display = isAll ? '' : 'none';
        const ariaHidden = isAll ? 'false' : 'true';
        requestAnimationFrame(() => {
            filterLinks.forEach(link => {
                const isActive = link.dataset.filter === filterValue;
                link.classList.toggle('active', isActive);
                link.setAttribute('aria-pressed', isActive);
            });
            if (isAll) {
                cardData.forEach(({ element }) => {
                    element.style.display = display;
                    element.setAttribute('aria-hidden', ariaHidden);
                });
            } else {
                cardData.forEach(({ element, tags }) => {
                    const shouldShow = tags.includes(filterValue);
                    element.style.display = shouldShow ? '' : 'none';
                    element.setAttribute('aria-hidden', !shouldShow);
                });
            }
        });
    }

    const filterContainer = filterLinks[0].parentElement.parentElement;
    filterContainer.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (!link) return;
        e.preventDefault();
        const filterValue = link.dataset.filter;
        if (filterValue) setActiveFilter(filterValue);
    });

    filterContainer.addEventListener('keydown', e => {
        const link = e.target.closest('a');
        if (!link) return;
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            link.click();
        }
    });

    filterLinks.forEach(link => {
        link.setAttribute('role', 'button');
        link.setAttribute('aria-pressed', link.classList.contains('active'));
    });

    window.addEventListener('popstate', () => {
        setActiveFilter(getFilterFromHash(), false);
    });

    const initialFilter = getFilterFromHash();
    if (initialFilter !== 'all') {
        setActiveFilter(initialFilter, false);
    }
});

