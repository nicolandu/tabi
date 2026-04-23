// Runs immediately: before paint, no DOM elements needed
(function() {
    let THEMES = { LIGHT: 'light', DARK: 'dark' };

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? THEMES.DARK
            : THEMES.LIGHT;
    }

    function isValidTheme(theme) {
        return Object.values(THEMES).includes(theme);
    }

    let saved = localStorage.getItem('theme');
    let currentTheme = isValidTheme(saved) ? saved : getSystemTheme();

    document.documentElement.setAttribute('data-theme', currentTheme);
})();

// Runs after DOM is ready: needs DOM elements
document.addEventListener('DOMContentLoaded', function() {
    let THEMES = { LIGHT: 'light', DARK: 'dark' };
    let FAVICON = { DEFAULT: '/favicon.svg', DARK: '/favicon-dark.svg' };

    let themeSwitcher = document.querySelector('.theme-switcher');
    let faviconEl = document.getElementById('favicon-svg');

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? THEMES.DARK
            : THEMES.LIGHT;
    }

    function isValidTheme(theme) {
        return Object.values(THEMES).includes(theme);
    }

    function updateFavicon(isDark) {
        faviconEl.href = isDark ? FAVICON.DARK : FAVICON.DEFAULT;
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeSwitcher.setAttribute('aria-pressed', theme === THEMES.DARK);
        localStorage.setItem('theme', theme);
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
        currentTheme = theme;

        // Navigator accent color
        let styles = getComputedStyle(document.documentElement);
        // Color should have updated: the variable is driven by the theme in CSS
        let color = styles.getPropertyValue('--primary-color').trim();
        document.querySelector('meta[name="theme-color"]').content = color;
    }

    function switchTheme() {
        setTheme(currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
    }

    function handleThemeTogglerKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            switchTheme();
        }
    }

    let saved = localStorage.getItem('theme');
    let currentTheme = isValidTheme(saved) ? saved : getSystemTheme();

    setTheme(currentTheme);
    updateFavicon(getSystemTheme() === THEMES.DARK);

    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => updateFavicon(e.matches));

    themeSwitcher.addEventListener('click', switchTheme);
    themeSwitcher.addEventListener('keydown', handleThemeTogglerKeydown);
});
