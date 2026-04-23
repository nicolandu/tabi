// Get the theme switcher button elements.
const themeSwitcher = document.querySelector('.theme-switcher');
const defaultTheme = document.documentElement.getAttribute('data-default-theme');

function getSystemThemePreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Determine the initial theme.
let currentTheme =
    localStorage.getItem('theme') ||
    document.documentElement.getAttribute('data-theme') ||
    getSystemThemePreference();

function setTheme(theme, saveToLocalStorage = false) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    themeSwitcher.setAttribute('aria-pressed', theme === 'dark');

    if (saveToLocalStorage) {
        localStorage.setItem('theme', theme);
        themeResetter.classList.add('has-custom-theme');
    } else {
        localStorage.removeItem('theme');
        themeResetter.classList.remove('has-custom-theme');
    }

    // Dispatch a custom event for comment systems.
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

// Function to switch between dark and light themes.
function switchTheme() {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
}

// Initialize the theme switcher button.
themeSwitcher.addEventListener('click', switchTheme);

// Update the theme based on system preference if necessary.
if (!defaultTheme) {
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
            document.getElementById('favicon-svg').href = e.matches ? '/favicon-dark.svg' : '/favicon.svg';
        });
}

// Set initial ARIA attribute and custom theme class.
themeSwitcher.setAttribute('aria-pressed', currentTheme === 'dark');
if (localStorage.getItem('theme')) {
    themeResetter.classList.add('has-custom-theme');
}

// Function to handle keydown event on theme toggler buttons.
function handleThemeTogglerKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        switchTheme();
    }
}

themeSwitcher.addEventListener('keydown', handleThemeTogglerKeydown);
