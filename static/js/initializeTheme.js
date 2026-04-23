// Runs immediately: before paint, no DOM elements needed
(function() {
    const THEMES = { LIGHT: 'light', DARK: 'dark' };

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? THEMES.DARK
            : THEMES.LIGHT;
    }

    function isValidTheme(theme) {
        return Object.values(THEMES).includes(theme);
    }

    const saved = localStorage.getItem('theme');
    const currentTheme = isValidTheme(saved) ? saved : getSystemTheme();

    document.documentElement.setAttribute('data-theme', currentTheme);
})();

// Runs after DOM is ready: needs DOM elements
document.addEventListener('DOMContentLoaded', function() {
    const THEMES = { LIGHT: 'light', DARK: 'dark' };
    const FAVICON = { DEFAULT: '/favicon.svg', DARK: '/favicon-dark.svg' };

    const themeSwitcher = document.querySelector('.theme-switcher');
    const faviconEl = document.getElementById('favicon-svg');

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

    const saved = localStorage.getItem('theme');
    let currentTheme = isValidTheme(saved) ? saved : getSystemTheme();

    setTheme(currentTheme);
    updateFavicon(getSystemTheme() === THEMES.DARK);

    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => updateFavicon(e.matches));

    themeSwitcher.addEventListener('click', switchTheme);
    themeSwitcher.addEventListener('keydown', handleThemeTogglerKeydown);
});
